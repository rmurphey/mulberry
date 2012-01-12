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

  describe 'media asset behavior' do

    before :each do
      #require 'fakeweb'
      @remote_asset = Factory.build :image_remote
    end

    it_should_behave_like "all media assets"
  end

  describe '#item local', :fakefs => true do

    before :each do
      @image = Factory.build :image
    end

    it 'should calculate image dimensions' do
      item = @image.item

      Image::IMAGE_TYPES.each do |image_type|
        item[image_type][:url].should be_nil
        item[image_type][:height].should == 1
        item[image_type][:width ].should == 1
      end
    end

  end

  describe '#item streaming' do
    it 'should output url, height, width in each style' do
      @remote_image = Factory.build :image_remote
      item = @remote_image.item

      Image::IMAGE_TYPES.each do |image_type|
        item[image_type][:url].should match /#{@remote_image.asset_name}/
        item[image_type][:height].should == 1
        item[image_type][:width ].should == 1
      end
    end
  end

  describe '#IMAGE_TYPES' do
    it 'should match expected types' do
      Image::IMAGE_TYPES.collect{|c| c.to_s}.sort.should == %w(featured featuredSmall gallery original).sort
    end
  end

end
