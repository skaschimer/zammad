# Copyright (C) 2012-2025 Zammad Foundation, https://zammad-foundation.org/

Zammad::Application.routes.draw do
  api_path = Rails.configuration.api_path

  # omniauth
  match '/auth/:provider/callback',                to: 'sessions#create_omniauth',  via: %i[post get puts delete]
  match '/auth/failure',                           to: 'sessions#failure_omniauth', via: %i[post get]
  match '/auth/openid_connect/backchannel_logout', to: 'sessions#oidc_bc_logout',   via: %i[post delete]

  # sso
  match '/auth/sso',                        to: 'sessions#create_sso',           via: %i[get post]

  # two factor
  match api_path + '/auth/two_factor_initiate_authentication/:method', to: 'sessions#two_factor_authentication_method_initiate_authentication', via: :post

  # sessions
  match api_path + '/signin',               to: 'sessions#create',               via: :post
  match api_path + '/signshow',             to: 'sessions#show',                 via: %i[get post]
  match api_path + '/signout',              to: 'sessions#destroy',              via: %i[get delete]

  match api_path + '/available',            to: 'sessions#available',            via: :get

  match api_path + '/sessions/switch/:id',  to: 'sessions#switch_to_user',       via: :get
  match api_path + '/sessions/switch_back', to: 'sessions#switch_back_to_user',  via: :get
  match api_path + '/sessions',             to: 'sessions#list',                 via: :get
  match api_path + '/sessions/:id',         to: 'sessions#delete',               via: :delete

end
