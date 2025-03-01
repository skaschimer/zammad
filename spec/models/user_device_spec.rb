# Copyright (C) 2012-2025 Zammad Foundation, https://zammad-foundation.org/

require 'rails_helper'

RSpec.describe UserDevice, type: :model do
  let(:ip) { '91.115.248.231' }

  before do
    mock_geoip_service_location(ip, {
                                  'country_code'   => 'AT',
                                  'country_name'   => 'Austria',
                                  'city_name'      => 'Graz',
                                  'city_code'      => '8010',
                                  'continent_code' => 'EU',
                                  'continent_name' => 'Europe',
                                  'latitude'       => 47.0833,
                                  'longitude'      => 15.5667,
                                  'time_zone'      => 'Europe/Vienna',
                                })
  end

  describe '.add' do
    let(:existing_record) { described_class.add(user_agent, ip, agent.id, fingerprint, type) }
    let(:agent)           { create(:agent) }

    context 'with existing record of type: "session"' do
      before { existing_record }  # create existing record

      let(:user_agent) { 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.107 Safari/537.36' }
      let(:fingerprint) { 'fingerprint1234' }
      let(:type)        { 'session' }

      context 'when called with same parameters as existing record' do
        it 'returns the original record' do
          expect(described_class.add(user_agent, ip, agent.id, fingerprint, type))
            .to eq(existing_record)
        end
      end

      context 'when called with different IP from existing record' do
        let(:other_ip) { '176.198.137.254' }

        before do
          mock_geoip_service_location(other_ip, {
                                        'country_code'   => 'DE',
                                        'country_name'   => 'Germany',
                                        'city_name'      => 'Marl',
                                        'city_code'      => '45770',
                                        'continent_code' => 'EU',
                                        'continent_name' => 'Europe',
                                        'latitude'       => 51.6586,
                                        'longitude'      => 7.1135,
                                        'time_zone'      => 'Europe/Berlin',
                                      })
        end

        it 'returns a new record' do
          expect(described_class.add(user_agent, other_ip, agent.id, fingerprint, type))
            .to be_a(described_class)
            .and not_eq(existing_record)
        end
      end

      context 'when called with invalid IP, not matching existing record' do
        let(:other_ip) { 'foo' }

        before do
          mock_geoip_service_location(other_ip, {})
        end

        it 'returns a new record' do
          expect(described_class.add(user_agent, other_ip, agent.id, fingerprint, type))
            .to be_a(described_class)
            .and not_eq(existing_record)
        end
      end

      context 'when called with different fingerprint from existing record' do
        let(:other_fingerprint) { 'fingerprintABCD' }

        it 'returns a new record' do
          expect(described_class.add(user_agent, ip, agent.id, other_fingerprint, type))
            .to be_a(described_class)
            .and not_eq(existing_record)
        end
      end

      context 'with recognized user_agent (Mac/Chrome)' do
        it 'assigns #user_agent attribute to given value' do
          expect(existing_record.user_agent).to eq(user_agent)
        end

        it 'derives #name attribute from given value' do
          expect(existing_record.name).to eq('Mac, Chrome')
        end

        it 'derives #browser attribute from given value' do
          expect(existing_record.browser).to eq('Chrome')
        end
      end

      context 'with recognized user_agent (iOS/Safari)' do
        let(:user_agent) { 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_4 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12H143 Safari/600.1.4' }

        it 'assigns #user_agent attribute to given value' do
          expect(existing_record.user_agent).to eq(user_agent)
        end

        it 'derives #name attribute from given value' do
          expect(existing_record.name).to eq('Ios, Safari')
        end

        it 'derives #browser attribute from given value' do
          expect(existing_record.browser).to eq('Safari')
        end
      end

      context 'with partially recognized user_agent (Mac/CalendarAgent)' do
        let(:user_agent) { 'Mac+OS+X/10.10.5 (14F27) CalendarAgent/316.1' }

        it 'assigns #user_agent and #browser attributes to given value' do
          expect([existing_record.user_agent, existing_record.browser])
            .to all(eq(user_agent))
        end

        it 'derives #name attribute from given value' do
          expect(existing_record.name).to eq("Mac, #{user_agent}")
        end
      end

      context 'with unrecognized user_agent' do
        let(:user_agent) { 'foo' }

        it 'assigns #user_agent, #name, and #browser attributes to given value' do
          expect([existing_record.user_agent, existing_record.name, existing_record.browser])
            .to all(eq(user_agent))
        end
      end
    end

    context 'with existing record of type: "basic_auth"' do
      before { existing_record }  # create existing record

      let(:user_agent)  { 'curl/7.43.0' }
      let(:fingerprint) { nil }
      let(:type)        { 'basic_auth' }

      context 'when called with same parameters as existing record' do
        it 'returns the original record' do
          expect(described_class.add(user_agent, ip, agent.id, fingerprint, type))
            .to eq(existing_record)
        end
      end

      context 'when called with different IP from existing record' do
        let(:other_ip) { '176.198.137.254' }

        before do
          mock_geoip_service_location(other_ip, {
                                        'country_code'   => 'DE',
                                        'country_name'   => 'Germany',
                                        'city_name'      => 'Marl',
                                        'city_code'      => '45770',
                                        'continent_code' => 'EU',
                                        'continent_name' => 'Europe',
                                        'latitude'       => 51.6586,
                                        'longitude'      => 7.1135,
                                        'time_zone'      => 'Europe/Berlin',
                                      })
        end

        it 'returns a new record' do
          expect(described_class.add(user_agent, other_ip, agent.id, fingerprint, type))
            .to be_a(described_class)
            .and not_eq(existing_record)
        end
      end

      context 'when called with different type from existing record ("token_auth")' do
        let(:other_type) { 'token_auth' }

        it 'returns the original record' do
          expect(described_class.add(user_agent, ip, agent.id, fingerprint, other_type))
            .to eq(existing_record)
        end
      end

      context "when called without existing record's user agent" do
        let(:other_user_agent) { '' }

        it 'returns a new record' do
          expect(described_class.add(other_user_agent, ip, agent.id, fingerprint, type))
            .to be_a(described_class)
            .and not_eq(existing_record)
        end
      end

      context "when existing record's user agent is blank, and given is nil" do
        let(:user_agent)       { '' }
        let(:other_user_agent) { nil }

        it 'returns the original record' do
          expect(described_class.add(other_user_agent, ip, agent.id, fingerprint, type))
            .to eq(existing_record)
        end
      end

      context "when existing record and given args have nil user agent, but IPs don't match" do
        let(:user_agent) { nil }
        let(:other_ip) { '176.198.137.254' }

        before do
          mock_geoip_service_location(other_ip, {
                                        'country_code'   => 'DE',
                                        'country_name'   => 'Germany',
                                        'city_name'      => 'Marl',
                                        'city_code'      => '45770',
                                        'continent_code' => 'EU',
                                        'continent_name' => 'Europe',
                                        'latitude'       => 51.6586,
                                        'longitude'      => 7.1135,
                                        'time_zone'      => 'Europe/Berlin',
                                      })
        end

        it 'returns a new record' do
          expect(described_class.add(user_agent, other_ip, agent.id, fingerprint, type))
            .to be_a(described_class)
            .and not_eq(existing_record)
        end
      end
    end

    context 'with exceedingly long fingerprint (161+ chars)' do
      let(:user_agent) { 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.107 Safari/537.36' }
      let(:fingerprint) { 'x' * 161 }
      let(:type)        { 'session' }

      it 'raises an error' do
        expect { described_class.add(user_agent, ip, agent.id, fingerprint, type) }
          .to raise_error(Exceptions::UnprocessableEntity)
      end
    end
  end

  describe '.action' do
    let(:user_device) { described_class.add(user_agent, ip, agent.id, fingerprint, type) }
    let(:user_agent)  { 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.107 Safari/537.36' }
    let(:agent)       { create(:agent) }
    let(:fingerprint) { 'fingerprint1234' }
    let(:type)        { 'session' }

    context 'when called with parameters matching given user_device' do
      it 'returns the given user_device' do
        expect(described_class.action(user_device.id, user_agent, ip, agent.id, type))
          .to eq(user_device)
      end
    end

    context 'when called with different IP from given user_device' do
      let(:other_ip) { '176.198.137.254' }

      before do
        mock_geoip_service_location(other_ip, {
                                      'country_code'   => 'DE',
                                      'country_name'   => 'Germany',
                                      'city_name'      => 'Marl',
                                      'city_code'      => '45770',
                                      'continent_code' => 'EU',
                                      'continent_name' => 'Europe',
                                      'latitude'       => 51.6586,
                                      'longitude'      => 7.1135,
                                      'time_zone'      => 'Europe/Berlin',
                                    })
      end

      it 'returns a new user_device' do
        expect(described_class.action(user_device.id, user_agent, other_ip, agent.id, type))
          .to be_a(described_class)
          .and not_eq(user_device)
      end
    end

    context 'when called with invalid IP, not matching given user_device' do
      let(:other_ip) { 'foo' }

      before do
        mock_geoip_service_location(other_ip, {})
      end

      it 'returns the given user_device' do
        expect(described_class.action(user_device.id, user_agent, other_ip, agent.id, type))
          .to eq(user_device)
      end

      it 'sets user_device.ip to the given (invalid) IP' do
        expect { described_class.action(user_device.id, user_agent, other_ip, agent.id, type) }
          .to change { user_device.reload.ip }.to(other_ip)
      end
    end
  end

  describe '#notification_send' do
    let(:user_device) { described_class.add(user_agent, ip, agent.id, fingerprint, type) }
    let(:user_agent)  { 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.107 Safari/537.36' }
    let(:fingerprint) { 'fingerprint1234' }
    let(:type)        { 'session' }

    context 'user with email address' do
      let(:agent) { create(:agent, email: 'somebody@example.com') }

      it 'returns true' do
        expect(user_device.notification_send('user_device_new_location'))
          .to be(true)
      end
    end

    context 'user without email address' do
      let(:agent) { create(:agent, email: '') }

      it 'returns false' do
        expect(user_device.notification_send('user_device_new_location'))
          .to be(false)
      end
    end
  end

  # Mock the location response of the GeoIP service in order to improve the stability of the test.
  def mock_geoip_service_location(ip, location)
    allow(Service::GeoIp).to receive(:location).with(ip).and_return(location)
  end
end
