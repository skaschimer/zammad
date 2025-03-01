# Copyright (C) 2012-2025 Zammad Foundation, https://zammad-foundation.org/

FactoryBot.define do
  factory :'ticket/state_type', aliases: %i[ticket_state_type] do
    name do
      # The following line ensures that the name generated by Faker
      # does not conflict with any existing names in the DB.
      Faker::Verb.unique.exclude(:past_participle, [], Ticket::StateType.pluck(:name))
    end

    updated_by_id { 1 }
    created_by_id { 1 }
  end
end
