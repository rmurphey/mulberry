require 'spec_helper'

describe Mulberry::Data do
  before :each do
    FileUtils.rm_rf 'testapp'
    Mulberry::App.scaffold('testapp', true)
    @data = (Mulberry::Data.new Mulberry::App.new('testapp')).generate
  end

  after :each do
    FileUtils.rm_rf 'testapp'
  end

  it "should generate a data object" do
    @data[:items].should_not be_nil
    @data[:app].should_not be_nil
  end

  it "should properly place the pages in the data" do
    @data[:items].select { |item|
      item[:id] == 'node-home'
    }.length.should be 1

    @data[:items].select { |item|
      item[:id] == 'node-about'
    }.length.should be 1
  end
end
