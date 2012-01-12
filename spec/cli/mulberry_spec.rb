require 'spec_helper'
require 'fakeweb'

describe Mulberry::App do
  before :each do
    Mulberry::App.scaffold('testapp', true)
    @app = Mulberry::App.new 'testapp'
    @initial_dir = Dir.pwd
  end

  after :each do
    Dir.chdir @initial_dir
    FileUtils.rm_rf 'testapp'
  end

  describe "::get_app_dir" do
    it "should find a mulberry directory" do
      Mulberry.get_app_dir('testapp').should match 'testapp'
    end

    it "should error out if not in a mulberry directory" do
      Dir.mkdir 'foobar'
      lambda { Mulberry.get_app_dir('foobar') }.should raise_error
      Dir.rmdir 'foobar'
    end
  end

  describe "::scaffold" do
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
        'page_defs',
        [ 'javascript', 'components' ],
        [ 'javascript', 'stores' ],
        [ 'javascript', 'models' ],
        [ 'javascript', 'capabilities' ],
        [ 'javascript', 'base.js' ]
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
    it "should set the name of the app" do
      @app.name.should == 'testapp'
    end
  end

  describe "#www_build" do
    before :each do
      @app.www_build
    end

    it "should build the files for serving as a static site" do
      [ 'web-phone', 'web-tablet' ].each do |subdir|
        build_dir = File.join(@app.source_dir, 'builds', subdir, 'www')
        File.exists?(build_dir).should be_true

        [
          'index.html',
          [ 'media', 'manifest.js' ],
          [ 'css', 'base.css' ],
          [ 'data', 'tour.js' ],
          [ 'data', 'pagedefs.js' ],
          [ 'javascript', 'dojo', 'dojo.js' ],
          [ 'javascript', 'toura', 'base.js' ],
          [ 'javascript', 'toura', 'app', 'TouraConfig.js' ],
          [ 'javascript', 'client', 'base.js' ]
        ].each do |dir|
          File.exists?(File.join(build_dir, dir)).should be_true
        end
      end
    end
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

  describe "#publish_ota" do
    after :each do
      FakeWeb.clean_registry
    end

    it 'should raise appropriate exception on http error' do
      @app.config['ota'] = { 'enabled' => 'true' }
      @app.config['toura_api'] = {
        'url' => 'https://myapi.com',
        'key' => 'some_key'
      }

      {
        "404" => Mulberry::Http::NotFound,
        "503" => Mulberry::Http::ServiceUnavailable
      }.each do |status, exception|
        FakeWeb.register_uri(:post, //, :status => status)
        lambda {@app.publish_ota '{"foo":"bar"}'}.should raise_error exception
      end
    end

  end

  describe "#device_build" do

    after :each do
      FakeWeb.clean_registry
    end

    def test_should_publish
      @app.config['ota'] = { 'enabled' => 'true' }
      @app.config['toura_api'] = {
        'url' => 'https://myapi.com',
        'key' => 'some_key'
      }

      yield

      FakeWeb.last_request.method.should == "POST"
      FakeWeb.last_request.path.should match /publish$/
    end

    it "should publish ota if enabled and no published version exists" do
      test_should_publish do
        FakeWeb.register_uri(:get, //,  :status => "404")
        FakeWeb.register_uri(:post, //, :body => "{\"version\": 1}")
        @app.device_build :skip_js_build => true
      end
    end

    it "should publish ota if forced even if published version exists" do
      test_should_publish do
        FakeWeb.register_uri(:get, //,  :body => "{\"version\": 1}")
        FakeWeb.register_uri(:post, //, :body => "{\"version\": 2}")

        @app.device_build :skip_js_build => true, :publish_ota => true
      end
    end

  end
end
