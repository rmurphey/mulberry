RSpec::Matchers.define :be_period_delimited_string do |expected|
  match do |actual|
    actual.is_a?(String) && (actual.split('.').length > 1)
  end
end
