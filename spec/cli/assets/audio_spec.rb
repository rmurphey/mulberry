require 'spec/spec_helper'
require 'cli/assets/base_shared'
require 'cli/assets/media_asset_shared'

describe Mulberry::Asset::Audio do

  describe 'base behavior', :fakefs => true do

    before :each do
      @asset = Factory.build :audio
    end

    it_should_behave_like "all assets"
  end

  describe 'media asset behavior', :fakefs => true  do

    before :each do
      @remote_asset = Factory.build :audio_remote
    end

    it_should_behave_like "all media assets"
  end

end
