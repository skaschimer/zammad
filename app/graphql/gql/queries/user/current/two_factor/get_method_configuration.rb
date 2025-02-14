# Copyright (C) 2012-2025 Zammad Foundation, https://zammad-foundation.org/

module Gql::Queries
  class User::Current::TwoFactor::GetMethodConfiguration < BaseQuery
    include Gql::Concerns::HandlesPasswordRevalidationToken

    description 'Fetch list of configured two factor authentication methods.'

    argument :method_name, String, description: 'Name of the method to remove'

    type GraphQL::Types::JSON, null: true

    def self.authorize(_obj, ctx)
      ctx.current_user.permissions?('user_preferences.two_factor_authentication')
    end

    def resolve(method_name:, token:)
      verify_token!(token)

      Service::User::TwoFactor::GetMethodConfiguration
        .new(user: context.current_user, method_name:)
        .execute
    end
  end
end
