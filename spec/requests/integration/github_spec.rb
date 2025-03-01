# Copyright (C) 2012-2025 Zammad Foundation, https://zammad-foundation.org/

require 'rails_helper'

# rubocop:disable RSpec/StubbedMock,RSpec/MessageSpies

RSpec.describe 'GitHub', required_envs: %w[GITHUB_ENDPOINT GITHUB_APITOKEN], type: :request do

  let(:token)    { 't0k3N' }
  let(:endpoint) { 'https://api.github.com/graphql' }

  let!(:admin) do
    create(:admin, groups: Group.all)
  end

  let!(:agent) do
    create(:agent, groups: Group.all)
  end

  let(:issue_data) do
    {
      id:         '1575',
      title:      'GitHub integration',
      url:        ENV['GITHUB_ISSUE_LINK'],
      icon_state: 'closed',
      milestone:  '4.0',
      assignees:  ['Thorsten'],
      labels:     [
        {
          color:      '#fef2c0',
          text_color: '#000000',
          title:      'feature backlog'
        },
        {
          color:      '#bfdadc',
          text_color: '#000000',
          title:      'integration'
        }
      ],
    }
  end

  let(:dummy_schema) do
    {
      a: :b
    }
  end

  describe 'request handling' do
    it 'does verify integration' do
      params = {
        endpoint:  endpoint,
        api_token: token,
      }
      authenticated_as(agent)
      post '/api/v1/integration/github/verify', params: params, as: :json
      expect(response).to have_http_status(:forbidden)
      expect(json_response).to be_a(Hash)
      expect(json_response).not_to be_blank
      expect(json_response['error']).to eq('User authorization failed.')

      authenticated_as(admin)
      instance = instance_double(GitHub)
      expect(GitHub).to receive(:new).with(endpoint: endpoint, api_token: token).and_return instance
      expect(instance).to receive(:verify!).and_return(true)

      post '/api/v1/integration/github/verify', params: params, as: :json
      expect(response).to have_http_status(:ok)
      expect(json_response).to be_a(Hash)
      expect(json_response).not_to be_blank
      expect(json_response['result']).to eq('ok')
    end

    context 'with activated github integration' do
      before do
        Setting.set('github_integration', true)
        Setting.set('github_config', { 'endpoint' => ENV['GITHUB_ENDPOINT'], 'api_token' => ENV['GITHUB_APITOKEN'] })
      end

      it 'does query objects without ticket id' do
        params = {
          links: [ ENV['GITHUB_ISSUE_LINK'] ],
        }
        authenticated_as(agent)
        instance = instance_double(GitHub)
        expect(GitHub).to receive(:new).and_return instance
        expect(instance).to receive(:issues_by_urls).and_return(
          {
            issues:           [issue_data],
            url_replacements: []
          }
        )

        post '/api/v1/integration/github', params: params, as: :json
        expect(response).to have_http_status(:ok)

        expect(json_response).to be_a(Hash)
        expect(json_response).not_to be_blank
        expect(json_response['result']).to eq('ok')
        expect(json_response['response']).to eq([issue_data.deep_stringify_keys])
      end
    end

    it 'does save ticket issues' do
      ticket = create(:ticket, group: Group.first)

      params = {
        ticket_id:   ticket.id,
        issue_links: [ ENV['GITHUB_ISSUE_LINK'] ],
      }
      authenticated_as(agent)
      post '/api/v1/integration/github_ticket_update', params: params, as: :json
      expect(response).to have_http_status(:ok)
      expect(json_response).to be_a(Hash)
      expect(json_response).not_to be_blank
      expect(json_response['result']).to eq('ok')

      expect(ticket.reload.preferences[:github][:issue_links]).to eq(params[:issue_links])
    end
  end
end

# rubocop:enable RSpec/StubbedMock,RSpec/MessageSpies
