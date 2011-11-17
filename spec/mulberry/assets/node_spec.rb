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
end
