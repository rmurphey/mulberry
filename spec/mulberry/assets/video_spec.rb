require 'spec/spec_helper'
require 'mulberry/assets/base_shared'
require 'mulberry/assets/media_asset_shared'
require 'fakefs/spec_helpers'


require 'pp'

describe Mulberry::Asset::Video do

  describe 'base behavior' do
    include FakeFS::SpecHelpers

    before :each do
      @asset = Factory.build :video
    end

    it_should_behave_like "all assets"

    it "should have a poster image url" do
      @asset.item[:poster][:url].should == "media/videos/posters/#{@asset.item[:name]}.jpg"
    end
  end

  describe 'video asset behavior' do
    include FakeFS::SpecHelpers

    before :each do
      @remote_asset = Factory.build :video_remote
    end

    it_should_behave_like "all media assets"

  end


end
