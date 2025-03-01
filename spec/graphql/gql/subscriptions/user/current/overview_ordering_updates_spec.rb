# Copyright (C) 2012-2025 Zammad Foundation, https://zammad-foundation.org/

require 'rails_helper'

RSpec.describe Gql::Subscriptions::User::Current::OverviewOrderingUpdates, type: :graphql do
  let(:subscription) do
    <<~SUBSCRIPTION
      subscription userCurrentOverviewOrderingUpdates($ignoreUserConditions: Boolean!) {
        userCurrentOverviewOrderingUpdates(ignoreUserConditions: $ignoreUserConditions) {
          overviews {
            id
            name
          }
        }
      }
    SUBSCRIPTION
  end

  let(:mock_channel) { build_mock_channel }
  let(:target)       { create(:agent) }

  context 'with authenticated user', authenticated_as: :target do
    it 'subscribes' do
      gql.execute(subscription, variables: { ignoreUserConditions: false }, context: { channel: mock_channel })
      expect(gql.result.data).to eq({ 'overviews' => nil })
    end

    it 'receives user overview ordering updates for target user' do
      gql.execute(subscription, variables: { ignoreUserConditions: false }, context: { channel: mock_channel })

      create(:'user/overview_sorting', user: target)
      described_class.trigger_by(target)

      all_overviews = Ticket::Overviews.all(current_user: target, ignore_user_conditions: false)
      expect(mock_channel.mock_broadcasted_messages.first[:result]['data']['userCurrentOverviewOrderingUpdates']['overviews'].count)
        .to eq(all_overviews.count)
    end

    it 'does not receive user overview ordering updates for other users' do
      gql.execute(subscription, context: { channel: mock_channel })
      create(:'user/overview_sorting', user: create(:agent))
      expect(mock_channel.mock_broadcasted_messages).to be_empty
    end
  end

  context 'when subscribing for unauthenticated users' do
    let(:variables)             { { ignoreUserConditions: false } }

    it 'does not subscribe but returns an authorization error' do
      gql.execute(subscription, variables:, context: { channel: mock_channel })
      expect(gql.result.error_type).to eq(Exceptions::NotAuthorized)
    end
  end

  describe '.trigger_by' do
    it 'passes user id as argument' do
      allow(described_class).to receive(:trigger)

      described_class.trigger_by(target)

      expect(described_class).to have_received(:trigger).exactly(2)
    end
  end
end
