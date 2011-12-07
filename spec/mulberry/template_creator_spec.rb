require 'spec_helper'
require 'mulberry/template_creator'

describe Mulberry::TemplateCreator do
  before :each do
    @template_dir = 'templates'
    @tmpdir = Dir.mktmpdir
  end

  after :each do
    FileUtils.rm_rf @tmpdir
  end

  it "should create a template file with the requested name" do
    Mulberry::TemplateCreator.new('template', @tmpdir, 'foo')

    template_dir = File.join @tmpdir, @template_dir

    File.exists?(template_dir).should be_true
    Dir.entries(template_dir).include?('foo.yml').should be_true
  end

  it "should create a template" do
    tpl = 'foo-bar'

    Mulberry::TemplateCreator.new('template', @tmpdir, tpl)

    template_file = File.join(@tmpdir, @template_dir, "#{tpl}.yml")
    template = YAML.load_file(template_file)[tpl]

    template['screens'].should_not be_nil
    template['screens'].length.should be > 0
    template['screens'].first['name'].should_not be_nil
    template['screens'].first['regions'].should_not be_nil
    template['screens'].first['regions'].length.should be > 0
    template['capabilities'].should_not be_nil
    template['capabilities'].first['name'].should == 'PageFooBar'
  end

  it "should create a capability for the page" do
    tpl = 'foo-bar'

    Mulberry::TemplateCreator.new('template', @tmpdir, tpl)

    capability_file = File.join(@tmpdir, 'javascript', 'capabilities', 'PageFooBar.js')

    File.exists?(capability_file).should be_true
    File.read(capability_file).should include 'mulberry.capability'
    File.read(capability_file).should include 'PageFooBar'
  end

end
