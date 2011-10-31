require 'spec/spec_helper'
require 'assets/base_spec'
require 'fakefs/spec_helpers'

describe Mulberry::Asset::Location do
  include FakeFS::SpecHelpers

  before :each do
    @asset = Factory.build :location
  end

  it_should_behave_like "all assets"

end