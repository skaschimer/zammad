# Copyright (C) 2012-2025 Zammad Foundation, https://zammad-foundation.org/

require 'builder'

class Integration::SipgateController < ApplicationController
  skip_before_action :verify_csrf_token
  before_action :check_configured, :check_token

  # notify about inbound call / block inbound call
  def event

    local_params = ActiveSupport::HashWithIndifferentAccess.new(params.permit!.to_h)

    cti = Cti::Driver::SipgateIo.new(params: local_params, config: config_integration)

    result = cti.process

    # check if inbound call should get rejected
    if result[:action] == 'reject'
      response_reject(result)
      return true
    end

    # check if outbound call changes the outbound caller_id
    if result[:action] == 'set_caller_id'
      response_set_caller_id(result)
      return true
    end

    if result[:action] == 'invalid_direction'
      response_error(__("Invalid 'direction'!"))
      return true
    end

    response_ok(response)
    true
  end

  private

  def check_token
    if Setting.get('sipgate_token') != params[:token]
      response_unauthorized(__('Invalid token, please contact your admin!'))
      return
    end

    true
  end

  def check_configured
    http_log_config facility: 'sipgate.io'

    if !Setting.get('sipgate_integration')
      xml_error(__('Feature is disabled, please contact your administrator!'))
      return
    end
    if config_integration.blank? || config_integration[:inbound].blank? || config_integration[:outbound].blank?
      xml_error(__('Feature not configured, please contact your admin!'))
      return
    end

    true
  end

  def config_integration
    @config_integration ||= Setting.get('sipgate_config')
  end

  def xml_error(error, code = 422)
    xml = Builder::XmlMarkup.new(indent: 2)
    xml.instruct!
    content = xml.Response() do
      xml.Error(error)
    end
    send_data content, type: 'application/xml; charset=UTF-8;', status: code
  end

  def base_url
    http_type = Setting.get('http_type')
    fqdn = Setting.get('sipgate_alternative_fqdn')
    if fqdn.blank?
      fqdn = Setting.get('fqdn')
    end
    "#{http_type}://#{fqdn}/api/v1/sipgate/#{Setting.get('sipgate_token')}"
  end

  def url
    "#{base_url}/#{params['direction']}"
  end

  def response_unauthorized(error)
    xml_error(error, 401)
  end

  def response_reject(_result)
    xml = Builder::XmlMarkup.new(indent: 2)
    xml.instruct!
    content = xml.Response(onHangup: url, onAnswer: url) do
      xml.Reject({ reason: 'busy' })
    end
    send_data content, type: 'application/xml; charset=UTF-8;'
  end

  def response_set_caller_id(result)
    xml = Builder::XmlMarkup.new(indent: 2)
    xml.instruct!
    content = xml.Response(onHangup: url, onAnswer: url) do
      xml.Dial(callerId: result[:params][:from_caller_id]) { xml.Number(result[:params][:to_caller_id]) }
    end
    send_data(content, type: 'application/xml; charset=UTF-8;')
  end

  def response_ok(_result)
    xml = Builder::XmlMarkup.new(indent: 2)
    xml.instruct!
    content = xml.Response(onHangup: url, onAnswer: url)
    send_data content, type: 'application/xml; charset=UTF-8;'
  end

end
