require 'spec_helper'
require 'mulberry/template_creator'

describe Mulberry::TemplateCreator do
  before :each do
    @tmpdir = Dir.mktmpdir
  end

  after :each do
    FileUtils.rm_rf @tmpdir
  end

  it "should create a template with the requested name" do
    Mulberry::TemplateCreator.new('template', @tmpdir, 'foo')

    template_dir = File.join @tmpdir, 'templates'

    File.exists?(template_dir).should be_true
    Dir.entries(template_dir).include?('foo.yml').should be_true
  end
end
