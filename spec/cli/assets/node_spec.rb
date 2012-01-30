require 'spec_helper'

describe Mulberry::Asset::Node, :fakefs => true do

  before :each do
    @node = Factory.build :node, :asset_name => 'foo'
  end

  describe "#item" do
    it "should have a type of node" do
      @node.item[:type].should == 'node'
    end

    it "should have an id" do
      @node.item[:id].should == 'node-foo'
    end
  end

  describe "#reference" do
    it "should have a _reference property whose value is the node's id" do
      @node.reference['_reference'].should == @node.item[:id]
    end
  end

  describe "#add_asset" do
    [
      [ :image,       :images,      :images,          :image          ],
      [ :audio,       :audios,      :audios,          :audio          ],
      [ :video,       :videos,      :videos,          :video          ],
      [ :data,        :data,        :data,            :dataAsset      ],
      [ :feed,        :feeds,       :feeds,           :feed           ],
      [ :location,    :locations,   :googleMapPins,   :googleMapPin   ]
    ].each do |factory_name, asset_group, data_group, data_name|
      it "should add #{asset_group.to_s} to the node" do
        asset = Factory.build factory_name

        @node.add_asset asset, asset_group

        @node.item[data_group].should_not be_nil
        @node.item[data_group].length.should be 1
        @node.item[data_group].first[data_name]['_reference'].should == asset.item[:id]
      end
    end

    it "should add header images to the node" do
      header_image = Factory.build :header_image
      @node.add_asset header_image, :header_image

      [ :phoneHeaderImage, :tabletHeaderImage ].each do |p|
        @node.item[p]['_reference'].should == header_image.item[:id]
      end
    end

    it "should add featured images to the node" do
      featured_image = Factory.build :image
      @node.add_asset featured_image, :featured_image
      @node.item[:featuredImage][:image]['_reference'].should == featured_image.item[:id]
    end

    it "should add body text assets to the node" do
      text_asset = Factory.build :text
      @node.add_asset text_asset, :body_text
      @node.item[:bodyText]['_reference'].should == text_asset.item[:id]
    end

    it "should add background images to the node" do
      background_image = Factory.build :background_image
      @node.add_asset background_image, :background_image
      [ :phoneBackgroundImage, :tabletBackgroundImage ].each do |p|
        @node.item[p]['_reference'].should == background_image.item[:id]
      end
    end

  end
end
