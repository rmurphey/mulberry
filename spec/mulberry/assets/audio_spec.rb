require 'spec/spec_helper'
require 'mulberry/assets/base_shared'
require 'mulberry/assets/media_asset_shared'
require 'fakefs/spec_helpers'

describe Mulberry::Asset::Audio do

  describe 'base behavior' do
    include FakeFS::SpecHelpers

    before :each do
      @asset = Factory.build :audio
    end

    it_should_behave_like "all assets"
  end

  describe 'media asset behavior' do
    include FakeFS::SpecHelpers

    before :each do
      @remote_asset = Factory.build :audio_remote
    end

    it_should_behave_like "all media assets"
  end

end