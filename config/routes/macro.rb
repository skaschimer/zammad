# Copyright (C) 2012-2025 Zammad Foundation, https://zammad-foundation.org/

Zammad::Application.routes.draw do
  api_path = Rails.configuration.api_path

  # macros
  match api_path + '/macros',         to: 'macros#index',   via: :get
  match api_path + '/macros/search',  to: 'macros#search',  via: %i[get post]
  match api_path + '/macros/:id',     to: 'macros#show',    via: :get
  match api_path + '/macros',         to: 'macros#create',  via: :post
  match api_path + '/macros/:id',     to: 'macros#update',  via: :put
  match api_path + '/macros/:id',     to: 'macros#destroy', via: :delete

end
