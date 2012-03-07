require 'spec_helper'
require 'cli/code_creator'

describe Mulberry::CodeCreator do
  before :each do
    @source_dir = 'testapp'
    Mulberry::App.scaffold(@source_dir, true)
  end

  after :each do
    FileUtils.rm_rf @source_dir
  end

  it "should raise an error if trying to create a file that already exists" do
    lambda {
      Mulberry::CodeCreator.new('component', @source_dir, 'fake')
      Mulberry::CodeCreator.new('component', @source_dir, 'fake')
    }.should raise_error
  end

  it "should raise an error if asked to create an unknown code type" do
    lambda {
      Mulberry::CodeCreator.new('unknown', @source_dir, 'fake')
    }.should raise_error
  end

  describe "base js creation" do
    before :each do
      @base_file = File.join(@source_dir, 'app', 'base.js')
    end

    it "should create the file" do
      File.exists?(@base_file).should be_true
    end

    it "should require toura.base" do
      File.read(@base_file).should include 'toura.base'
    end
  end

  describe "component creation" do
    before :each do
      Mulberry::CodeCreator.new('component', @source_dir, 'FooBarBaz')
    end

    it "should create the component file" do
      c = File.join(@source_dir, 'app', 'components', 'FooBarBaz.js')
      File.exists?(c).should be_true
      File.read(c).should include 'client.components.FooBarBaz'
    end

    it "should create the component resources directory" do
      d = File.join(@source_dir, 'app', 'components', 'FooBarBaz')
      File.exists?(d).should be_true
      File.directory?(d).should be_true
    end

    it "should create the component template" do
      t = File.join(@source_dir, 'app', 'components', 'FooBarBaz', 'FooBarBaz.haml')
      File.exists?(t).should be_true
      File.read(t).should include '.component.foo-bar-baz'
    end

    it "should require the component in the base.js" do
      js = File.join(@source_dir, 'app', 'base.js')
      File.read(js).should include "dojo.require('client.components.FooBarBaz');\n"
    end

    it "should create the component styles" do
      s = File.join(@source_dir, 'app', 'components', 'FooBarBaz', '_foo-bar-baz.scss')
      File.exists?(s).should be_true
      File.read(s).should include '.component.foo-bar-baz {'
    end

    it "should import the component style in the base.scss" do
       scss = File.join(@source_dir, 'app', 'base.scss')
       File.read(scss).should include '@import \'components/FooBarBaz/foo-bar-baz\';'
    end

    it "should include the component styling in the compiled css" do
      s = File.join(@source_dir, 'app', 'components', 'FooBarBaz', '_foo-bar-baz.scss')

      file_contents = File.read(s).gsub /\{.*\}/m, '{ background-color: #FFFFFF }'

      File.open(s, 'w'){ |f| f.write(file_contents) }

      css_maker = Builder::CSSMaker.new :css_dir => File.join(@source_dir, 'app')

      css_maker.render.should include '.component.foo-bar-baz'
    end


  end

  describe "capability creation" do
    before :each do
      Mulberry::CodeCreator.new('capability', @source_dir, 'BizBopBim')
    end

    it "should create the capability file" do
      c = File.join(@source_dir, 'app', 'capabilities', 'BizBopBim.js')
      File.exists?(c).should be_true
      File.read(c).should include 'client.capabilities.BizBopBim'
    end

    it "should require the capability in the base.js" do
      js = File.join(@source_dir, 'app', 'base.js')
      File.read(js).should include "dojo.require('client.capabilities.BizBopBim');\n"
    end
  end

  describe "route creation" do
    before :each do
      Mulberry::CodeCreator.new('route', @source_dir, '/foo/:bar')
      @routes = File.join(@source_dir, 'app', 'routes.js')
    end

    it "should create the routes file" do
      File.exists?(@routes).should be_true
    end

    it "should add the dependency to the base.js file" do
      File.read(File.join(@source_dir, 'app', 'base.js')).should include 'client.routes'
    end

    it "should add the route to the routes file" do
      File.read(@routes).should include "mulberry.route('/foo/:bar', function"
    end
  end


end
