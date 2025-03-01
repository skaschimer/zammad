# Copyright (C) 2012-2025 Zammad Foundation, https://zammad-foundation.org/

RSpec.configure do |config|
  config.around(:each, :allow_forgery_protection) do |example|
    orig = ActionController::Base.allow_forgery_protection

    ActionController::Base.allow_forgery_protection = true

    example.run
  ensure
    ActionController::Base.allow_forgery_protection = orig
  end
end
