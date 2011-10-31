require 'spec/spec_helper'
require 'mulberry/assets/base_shared'
require 'mulberry/assets/media_asset_shared'
require 'fakefs/spec_helpers'

describe Mulberry::Asset::Image do

  describe 'base behavior' do
    include FakeFS::SpecHelpers

    before :each do
      @asset = Factory.build :image
    end

    it_should_behave_like "all assets"
  end

  describe 'media asset behavior' do
    include FakeFS::SpecHelpers

    before :each do
      @remote_asset = Factory.build :image_remote
    end

    it_should_behave_like "all media assets"
  end

  describe '#item' do
    include FakeFS::SpecHelpers

    before :each do
      @remote_image = Factory.build :image_remote
    end

    it 'should output url in each style' do
      item = @remote_image.item
      [ :featured, :featuredSmall, :gallery, :original ].each do |image_type|
        item[image_type][:url].should match /#{@remote_image.asset_name}/
      end
    end

  end

end