# Copyright (C) 2012-2025 Zammad Foundation, https://zammad-foundation.org/

RSpec.shared_examples 'Import::ImportStats' do
  it 'responds to current_state' do
    expect(described_class).to respond_to('current_state')
  end

  it 'responds to statistic' do
    expect(described_class).to respond_to('statistic')
  end
end
