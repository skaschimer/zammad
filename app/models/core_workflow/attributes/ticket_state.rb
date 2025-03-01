# Copyright (C) 2012-2025 Zammad Foundation, https://zammad-foundation.org/

class CoreWorkflow::Attributes::TicketState < CoreWorkflow::Attributes::Base
  def values
    @values ||= begin
      state_ids = []
      if state_type && state_types.exclude?(state_type.name)
        state_ids.push @attributes.saved.state_id
      end
      Ticket::State.joins(:state_type).where(ticket_state_types: { name: state_types }).each do |state|
        state_ids.push state.id
      end
      state_ids
    end
  end

  def default_value
    @default_value ||= Ticket::State.find_by(default_create: true).try(:id)&.to_s
  end

  def state_type
    return if @attributes.saved.id.blank?

    @attributes.saved.state.state_type
  end

  def state_types
    state_types = ['open', 'closed', 'pending action', 'pending reminder']
    return state_types if @attributes.payload['screen'] != 'create_middle'

    state_types.unshift('new')
  end
end
