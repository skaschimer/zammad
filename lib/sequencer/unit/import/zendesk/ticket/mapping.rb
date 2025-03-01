# Copyright (C) 2012-2025 Zammad Foundation, https://zammad-foundation.org/

class Sequencer::Unit::Import::Zendesk::Ticket::Mapping < Sequencer::Unit::Base
  include ::Sequencer::Unit::Import::Common::Mapping::Mixin::ProvideMapped

  uses :resource, :user_id, :owner_id, :group_id,
       :organization_id, :priority_id, :state_id,
       :article_sender_id, :article_type_id,
       :subject

  def process
    provide_mapped do
      {
        id:                       resource.id,
        number:                   resource.id,
        title:                    subject,
        owner_id:                 owner_id,
        group_id:                 group_id,
        customer_id:              user_id,
        organization_id:          organization_id,
        priority_id:              priority_id,
        state_id:                 state_id,
        pending_time:             resource.due_at,
        updated_at:               resource.updated_at,
        created_at:               resource.created_at,
        updated_by_id:            user_id,
        created_by_id:            user_id,
        type:                     resource.type,
        create_article_sender_id: article_sender_id,
        create_article_type_id:   article_type_id,
      }
    end
  end
end
