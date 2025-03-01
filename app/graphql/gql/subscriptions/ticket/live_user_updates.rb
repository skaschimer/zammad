# Copyright (C) 2012-2025 Zammad Foundation, https://zammad-foundation.org/

module Gql::Subscriptions
  class Ticket::LiveUserUpdates < BaseSubscription

    description 'Updates to ticket live users (for agents).'

    subscription_scope :current_user_id

    argument :key, String, description: 'Taskbar key to filter for.'
    argument :app, Gql::Types::Enum::TaskbarAppType, description: 'Taskbar app to filter for.'

    field :live_users, [Gql::Types::Ticket::LiveUserType], description: 'Current live users from the ticket.'

    def authorized?(key:, app:)
      context.current_user.permissions?('ticket.agent')
    end

    def subscribe(key:, app:)
      response(Taskbar.find_by(key: key, user_id: context.current_user.id, app: app))
    end

    def update(key:, app:)
      response(object)
    end

    private

    def response(taskbar_item)
      { live_users: transform_tasks(taskbar_item) }
    end

    def transform_tasks(taskbar_item)
      return [] if taskbar_item.blank?

      taskbar_item
        .preferences
        .fetch(:tasks, [])
        .map { |task| transform_single_task(task) }
    end

    def transform_single_task(task)
      {
        user: ::User.find_by(id: task[:user_id]),
        apps: transform_task_apps(task[:apps]),
      }
    end

    def transform_task_apps(apps)
      apps.map do |app, data|
        {
          name:             app,
          editing:          data[:changed],
          last_interaction: data[:last_contact],
        }
      end
    end
  end
end
