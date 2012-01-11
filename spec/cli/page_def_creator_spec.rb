require 'spec_helper'
require 'cli/page_def_creator'

describe Mulberry::PageDefCreator do
  def cleanup(dir)
    root = Mulberry::Directories.root
    Dir.chdir root
    FileUtils.rm_rf File.join(root, dir)
  end

  before :each do
    @source_dir = 'testapp'

    cleanup(@source_dir)

    Mulberry::App.scaffold(@source_dir, true)
    @page_def_dir = File.join(@source_dir, 'page_defs')

    Dir.chdir @source_dir
  end

  after :each do
    cleanup(@source_dir)
  end

  it "should create a page definition file with the requested name" do
    Mulberry::PageDefCreator.new('page_def', @source_dir, 'foo')

    File.exists?(@page_def_dir).should be_true
    Dir.entries(@page_def_dir).include?('foo.yml').should be_true
  end

  it "should create a valid page definition" do
    name = 'foo-bar'

    Mulberry::PageDefCreator.new('page_def', @source_dir, name)

    page_def_file = File.join(@page_def_dir, "#{name}.yml")
    page_def = YAML.load_file(page_def_file)[name]

    page_def['screens'].should_not be_nil
    page_def['screens'].length.should be > 0
    page_def['screens'].first['name'].should_not be_nil
    page_def['screens'].first['regions'].should_not be_nil
    page_def['screens'].first['regions'].length.should be > 0
    page_def['capabilities'].should_not be_nil
    page_def['capabilities'].first['name'].should == 'PageFooBar'
  end

  it "should create a capability for the page" do
    name = 'foo-bar'

    Mulberry::PageDefCreator.new('page_def', @source_dir, name)

    capability_file = File.join(@source_dir, 'javascript', 'capabilities', 'PageFooBar.js')

    File.exists?(capability_file).should be_true
    File.read(capability_file).should include 'mulberry.capability'
    File.read(capability_file).should include 'PageFooBar'
  end

end
