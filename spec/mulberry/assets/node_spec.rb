require 'spec/spec_helper'

describe Mulberry::Asset::Node do
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
    it "should add regular assets to the node" do
      [
        [ :image,       :images       ],
        [ :audio,       :audios       ],
        [ :video,       :videos       ],
        [ :data,        :data         ],
        [ :feed,        :feeds        ],
        [ :location,    :locations    ]
      ].each do |asset_type|
        asset = Factory.build asset_type[0]
        @node.add_asset asset, asset_type[1]
        @node.item[asset_type[1]].first[asset_type[0]].length.should be 1
        @node.item[asset_type[1]].first[asset_type[0]]['_reference'].should == asset.item[:id]
      end
    end

    it "should add header images to the node" do
      header_image = Factory.build :header_image
      @node.add_asset header_image, :header_image

      @node.item[:phoneHeaderImage]['_reference'].should == header_image.item[:id]
      @node.item[:tabletHeaderImage]['_reference'].should == header_image.item[:id]
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
  end
end
