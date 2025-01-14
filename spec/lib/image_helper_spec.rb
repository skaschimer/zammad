# Copyright (C) 2012-2025 Zammad Foundation, https://zammad-foundation.org/

require 'rails_helper'

RSpec.describe ImageHelper do
  describe '.data_url_attributes' do
    it 'raises error if empty string given' do
      expect { described_class.data_url_attributes('') }.to raise_error(%r{Unable to parse data url})
    end

    it 'raises error if nil' do
      expect { described_class.data_url_attributes(nil) }.to raise_error(%r{Unable to parse data url})
    end
  end
end
