require 'spec_helper'

describe Mulberry::App do
  before :each do
    Mulberry::App.scaffold('testapp', true)
  end

  after :each do
    FileUtils.rm_rf 'testapp'
  end

  describe "#scaffold" do
    it "should create an app directory" do
      File.exists?('testapp').should be_true
    end

    it "should create the correct files and directories for the app" do
      [
        'config.yml',
        'sitemap.yml',
        [ 'pages', 'home.md' ],
        [ 'pages', 'about.md' ],
        [ 'assets', 'audios' ],
        [ 'assets', 'videos' ],
        [ 'assets', 'images' ],
        [ 'assets', 'locations' ],
        [ 'assets', 'data' ],
        [ 'assets', 'feeds' ],
        [ 'assets', 'audios', 'captions' ],
        [ 'assets', 'videos', 'captions' ],
        [ 'assets', 'images', 'captions' ],
        [ 'assets', 'locations', 'captions' ],
        'themes',
        'templates',
        [ 'javascript', 'components' ]
      ].each do |f|
        File.exists?(File.join('testapp', f)).should be_true
      end
    end

    it "should raise an error if the directory already exists" do
      lambda {
        Mulberry::App.scaffold('testapp', true)
      }.should raise_error
    end

    it "should put the home and about pages in the sitemap" do
      sitemap = YAML.load_file File.join('testapp', 'sitemap.yml')
      sitemap.include?('home').should be_true
      sitemap.include?('about').should be_true
    end

    it "should put the app name in the config" do
      File.read(File.join('testapp', 'config.yml')).should match 'testapp'
      File.read(File.join('testapp', 'config.yml')).should_not match "#{Dir.pwd}/testapp"
    end
  end

  describe "#initialize" do
    before :each do
      @app = Mulberry::App.new 'testapp'
    end

    it "should set the name of the app" do
      @app.name.should == 'testapp'
    end
  end

  describe "#serve" do
  end

  describe "#generate" do
  end

  describe "#data" do
    before :each do
      @app = Mulberry::App.new 'testapp'
    end

    it "should generate the data for the app" do
      @app.data.should have_key :items
      @app.data.should have_key :app
      @app.data[:items].select { |item| item[:id] == 'text-asset-home' }.length.should equal 1
      @app.data[:items].select { |item| item[:id] == 'node-home' }.length.should equal 1
    end
  end
end
