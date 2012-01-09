require 'spec/spec_helper'
require 'cli/assets/base_shared'
require 'cli/assets/media_asset_shared'

describe Mulberry::Asset::Image do

  describe 'base behavior', :fakefs => true do

    before :each do
      @asset = Factory.build :image
    end

    it_should_behave_like "all assets"
  end

  describe 'media asset behavior', :fakefs => true do

    before :each do
      @remote_asset = Factory.build :image_remote
    end

    it_should_behave_like "all media assets"
  end

  describe '#item', :fakefs => true do

    before :each do
      #@remote_image = Factory.build :image_remote
      @image = Factory.build :image

      # Copy the fixture file into our fake filesystem so the dimensions can be calculated
      FakeFS::FileSystem.clone @image.asset_file
    end

    it 'should calculate image dimensions' do

      item = @image.item

      Image::IMAGE_TYPES.each do |image_type|
        item[image_type][:height].should == 1
        item[image_type][:width ].should == 1
      end
    end

  end

  describe '#item', :fakefs => true do
    it 'should output url in each style' do
      @remote_image = Factory.build :image_remote
      item = @remote_image.item
      Image::IMAGE_TYPES.each do |image_type|
        item[image_type][:url].should match /#{@remote_image.asset_name}/
        item[image_type][:height].should == 1
        item[image_type][:width ].should == 1
      end
    end
  end

end
