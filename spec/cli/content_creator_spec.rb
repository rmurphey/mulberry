require 'spec_helper'
require 'cli/content_creator'

describe Mulberry::ContentCreator do
  before :each do
    @source_dir = 'testapp'
    Mulberry::App.scaffold(@source_dir, true)
  end

  after :each do
    FileUtils.rm_rf @source_dir
  end

  it "should create a page" do
    Mulberry::ContentCreator.new('page', @source_dir, 'test')
    File.exists?(File.join(@source_dir, 'pages', 'test.md')).should be_true
  end

  it "should create a feed asset" do
    Mulberry::ContentCreator.new('feed', @source_dir, 'test')
    File.exists?(File.join(@source_dir, 'assets', 'feeds', 'test.yml')).should be_true
  end

  it "should create a data asset" do
    Mulberry::ContentCreator.new('data', @source_dir, 'test')
    File.exists?(File.join(@source_dir, 'assets', 'data', 'test.yml')).should be_true
  end

  it "should create a location asset" do
    Mulberry::ContentCreator.new('location', @source_dir, 'test')
    File.exists?(File.join(@source_dir, 'assets', 'locations', 'test.yml')).should be_true
  end

  it "should raise an error when trying to create a page that already exists" do
    lambda {
      Mulberry::ContentCreator.new('page', @source_dir, 'test')
      Mulberry::ContentCreator.new('page', @source_dir, 'test')
    }.should raise_error
  end

  it "should put the page title in the file" do
    Mulberry::ContentCreator.new('page', @source_dir, 'testpage')
    File.read(File.join(@source_dir, 'pages', 'testpage.md')).should include 'title: testpage'
  end

end

