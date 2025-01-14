# Copyright (C) 2012-2025 Zammad Foundation, https://zammad-foundation.org/

require 'rails_helper'

RSpec.describe Channel::Driver::MicrosoftGraphInbound, :aggregate_failures, integration: true, required_envs: %w[MICROSOFTGRAPH_REFRESH_TOKEN MICROSOFT365_CLIENT_ID MICROSOFT365_CLIENT_SECRET MICROSOFT365_CLIENT_TENANT MICROSOFT365_USER], use_vcr: true do # , retry: 5, retry_wait: 30.seconds do
  let(:channel) do
    create(:microsoft_graph_channel).tap(&:refresh_xoauth2!).tap do |channel|
      VCR.configure do |c|
        c.filter_sensitive_data('<MICROSOFTGRAPH_ACCESS_TOKEN>') { channel.options['inbound']['options']['password'] }
        c.filter_sensitive_data('<MICROSOFT365_USER_ESCAPED>')   { CGI.escapeURIComponent(ENV['MICROSOFT365_USER']) }
      end
    end
  end

  let(:client_access_token) { channel.options['inbound']['options']['password'] }
  let(:client)              { MicrosoftGraph.new(access_token: client_access_token, mailbox: ENV['MICROSOFT365_USER']) }

  describe '.fetch' do

    context 'with valid token' do
      let(:mail_subject) { "CI test for #{described_class}" }
      let(:folder_name) { "rspec-#{SecureRandom.uuid}" }
      let(:folder)      do
        VCR.configure do |c|
          c.filter_sensitive_data('<FOLDER_NAME>') { folder_name }
        end

        client.create_message_folder(folder_name)
      end

      let(:message) do
        {
          subject:      mail_subject,
          body:         { content: 'Test email' },
          from:         {
            emailAddress: { address: 'from@example.com' }
          },
          toRecipients: [
            {
              emailAddress: { address: 'test@example.com' }
            }
          ],
        }
      end

      shared_examples 'fetches the test message' do
        it 'fetches the test message' do
          client.store_mocked_message(message, folder_id: channel.options['inbound']['options']['folder_id'] || 'inbox')

          expect { channel.fetch }.to change(Ticket, :count)
          expect(Ticket.find_by(title: mail_subject)).to be_present
          expect(channel.reload.status_in).to eq('ok')
        end
      end

      context 'when fetching from the inbox' do
        before do
          # No special time-based treatment for existing verify messages. This might break VCR cassette handling.
          allow_any_instance_of(described_class).to receive(:messages_is_too_old_verify?).and_return(true)
        end

        include_examples 'fetches the test message'
      end

      context 'when fetching from a custom folder' do
        before do
          channel.options['inbound']['options']['folder_id'] = folder['id']
          channel.save!
        end

        after do
          client.delete_message_folder(folder['id'])
        end

        include_examples 'fetches the test message'
      end
    end

    context 'without valid token' do
      before do
        channel.options['inbound']['options']['password'] = 'incorrect'
        channel.save!
        allow(channel).to receive(:refresh_xoauth2!)
        allow(Ticket).to receive(:new)
      end

      it 'raises an error' do
        expect(channel.fetch).to be(false)
        expect(channel.reload.status_in).to eq('error')
        expect(Ticket).not_to have_received(:new)
      end
    end
  end
end