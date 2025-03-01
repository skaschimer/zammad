# Copyright (C) 2012-2025 Zammad Foundation, https://zammad-foundation.org/

require 'rails_helper'
require 'models/application_model_examples'
require 'models/concerns/can_csv_import_examples'
require 'models/concerns/can_csv_import_text_module_examples'
require 'models/concerns/has_optional_groups_examples'

RSpec.describe TextModule, type: :model do
  it_behaves_like 'ApplicationModel', can_create_update: { unique_name: false }
  it_behaves_like 'CanCsvImport'
  it_behaves_like 'HasOptionalGroups', model_factory: :text_module

  include_examples 'CanCsvImport - TextModule specific tests'
end
