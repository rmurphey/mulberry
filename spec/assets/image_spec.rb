require 'spec/spec_helper'
require 'assets/base_spec'
require 'fakefs/spec_helpers'

describe Mulberry::Asset::Image do
  include FakeFS::SpecHelpers

  before :each do
    @asset = Factory.build :image
  end

  it_should_behave_like "all assets"

end