require 'spec_helper'
require 'mulberry/code_creator'

describe Mulberry::CodeCreator do
  before :each do
    @tmpdir = Dir.mktmpdir
  end

  after :each do
    FileUtils.rm_rf @tmpdir
  end

  it "should raise an error if trying to create a file that already exists" do
    lambda {
      Mulberry::CodeCreator.new('component', @tmpdir, 'fake')
      Mulberry::CodeCreator.new('component', @tmpdir, 'fake')
    }.should raise_error
  end

  it "should raise an error if asked to create an unknown code type" do
    lambda {
      Mulberry::CodeCreator.new('unknown', @tmpdir, 'fake')
    }.should raise_error
  end

  describe "component creation" do
    before :each do
      Mulberry::CodeCreator.new('component', @tmpdir, 'FooBarBaz')
    end

    it "should create the component file" do
      c = File.join(@tmpdir, 'javascript', 'components', 'FooBarBaz.js')
      File.exists?(c).should be_true
      File.read(c).should match 'client.components.FooBarBaz'
    end

    it "should create the component resources directory" do
      d = File.join(@tmpdir, 'javascript', 'components', 'FooBarBaz')
      File.exists?(d).should be_true
      File.directory?(d).should be_true
    end

    it "should create the component template" do
      t = File.join(@tmpdir, 'javascript', 'components', 'FooBarBaz', 'FooBarBaz.haml')
      File.exists?(t).should be_true
      File.read(t).should match '.component.foo-bar-baz'
    end

    it "should require the component in the base.js" do
      js = File.join(@tmpdir, 'javascript', 'base.js')
      File.read(js).should == "dojo.require('client.components.FooBarBaz');\n"
    end
  end

  describe "capability creation" do
    before :each do
      Mulberry::CodeCreator.new('capability', @tmpdir, 'BizBopBim')
    end

    it "should create the capability file" do
      c = File.join(@tmpdir, 'javascript', 'capabilities', 'BizBopBim.js')
      File.exists?(c).should be_true
      File.read(c).should match 'client.capabilities.BizBopBim'
    end

    it "should require the capability in the base.js" do
      js = File.join(@tmpdir, 'javascript', 'base.js')
      File.read(js).should == "dojo.require('client.capabilities.BizBopBim');\n"
    end
  end
end
