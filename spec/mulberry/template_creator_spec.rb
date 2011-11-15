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

  it "should create a template with the requested name" do
    Mulberry::TemplateCreator.new('template', @tmpdir, 'foo')

    template_dir = File.join @tmpdir, @template_dir

    File.exists?(template_dir).should be_true
    Dir.entries(template_dir).include?('foo.yml').should be_true
  end

  it "should create a template" do
    tpl = 'foo'

    Mulberry::TemplateCreator.new('template', @tmpdir, tpl)

    template_file = File.join(@tmpdir, @template_dir, "#{tpl}.yml")
    template = YAML.load_file(template_file)[tpl]

    template['screens'].should_not be_nil
    template['screens'].length.should be > 0
    template['screens'].first['name'].should_not be_nil
    template['screens'].first['regions'].should_not be_nil
    template['screens'].first['regions'].length.should be > 0
  end
end
