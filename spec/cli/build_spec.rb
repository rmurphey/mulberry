require 'spec_helper'

require 'builder'
require 'cli/mulberry'
require 'cli/build_helper'

describe Builder::Build do
  before(:all) do
    Mulberry::App.scaffold('testapp', true)
    @app = Mulberry::App.new 'testapp'
    @page_defs = Dir.glob(File.join(TouraAPP::Directories.page_defs, '*.yml')).map do |page_def|
      YAML.load_file(page_def).keys.first
    end
  end

  describe "iphone build" do
    before :all do
      @b = Builder::Build.new({
        :build_helper => Mulberry::BuildHelper.new(@app),
        :device_type => 'phone',
        :device_os => 'ios',
        :target => 'device_production'
      })

      @b.build
      @bundle = @b.completed_steps[:close][:bundle]
    end

    it "should include all of the required files" do
      @bundle[:location].should_not be_nil

      [
        [ 'iphone' ],

        [ 'iphone', 'Toura' ],

        [ 'iphone', 'Toura', 'Toura-Info.plist' ],
        [ 'iphone', 'Toura', 'UrbanAirship.plist' ],

        [ 'iphone', 'www' ],
        [ 'iphone', 'www', 'index.html' ],

        [ 'iphone', 'www', 'media' ],
        [ 'iphone', 'www', 'media', 'manifest.js' ],

        [ 'iphone', 'www', 'css' ],
        [ 'iphone', 'www', 'css', 'base.css' ],
        [ 'iphone', 'www', 'css', 'resources' ],

        [ 'iphone', 'www', 'data' ],
        [ 'iphone', 'www', 'data', 'tour.js.jet' ],
        [ 'iphone', 'www', 'data', 'pagedefs.js' ],

        [ 'iphone', 'www', 'javascript' ],
        [ 'iphone', 'www', 'javascript', 'dojo', 'dojo.js' ],
        [ 'iphone', 'www', 'javascript', 'toura', 'base.js' ],
        [ 'iphone', 'www', 'javascript', 'client', 'base.js' ],
        [ 'iphone', 'www', 'javascript', 'toura', 'AppConfig.js' ],
        [ 'iphone', 'www', 'javascript', 'vendor', 'haml.js' ]
      ].each do |path|
        File.exists?(File.join(@bundle[:location], path)).should be_true
      end
    end

    it "should properly generate the tour data" do
      File.read(File.join(@bundle[:location], 'iphone', 'www', 'data', 'tour.js.jet')).should include 'toura.data.local'
    end

    it "should properly generate the pagedef data" do
      page_defs = File.read(File.join(@bundle[:location], 'iphone', 'www', 'data', 'pagedefs.js'))
      page_defs.should include 'toura.pageDef('
      @page_defs.each do |page_def|
        page_defs.should include page_def
      end
    end

    after do
      @b.cleanup
    end
  end

  describe "ipad build" do
    before :all do
      @b = Builder::Build.new({
        :build_helper => Mulberry::BuildHelper.new(@app),
        :device_type => 'tablet',
        :device_os => 'ios',
        :target => 'device_production'
      })

      @b.build

      @bundle = @b.completed_steps[:close][:bundle]
    end

    it "should create the required files" do
      @bundle[:location].should_not be_nil

      [
        [ 'ipad' ],

        [ 'ipad', 'Toura' ],

        [ 'ipad', 'Toura', 'Toura-Info.plist' ],
        [ 'ipad', 'Toura', 'UrbanAirship.plist' ],

        [ 'ipad', 'www' ],
        [ 'ipad', 'www', 'index.html' ],

        [ 'ipad', 'www', 'media' ],
        [ 'ipad', 'www', 'media', 'manifest.js' ],

        [ 'ipad', 'www', 'css' ],
        [ 'ipad', 'www', 'css', 'base.css' ],
        [ 'ipad', 'www', 'css', 'resources' ],

        [ 'ipad', 'www', 'data' ],
        [ 'ipad', 'www', 'data', 'tour.js.jet' ],
        [ 'ipad', 'www', 'data', 'pagedefs.js' ],

        [ 'ipad', 'www', 'javascript' ],
        [ 'ipad', 'www', 'javascript', 'dojo', 'dojo.js' ],
        [ 'ipad', 'www', 'javascript', 'toura', 'base.js' ],
        [ 'ipad', 'www', 'javascript', 'client', 'base.js' ],
        [ 'ipad', 'www', 'javascript', 'toura', 'AppConfig.js' ],
        [ 'ipad', 'www', 'javascript', 'vendor', 'haml.js' ]
      ].each do |path|
        File.exists?(File.join(@bundle[:location], path)).should be_true
      end
    end

    it "should properly generate the tour data" do
      File.read(File.join(@bundle[:location], 'ipad', 'www', 'data', 'tour.js.jet')).should include 'toura.data.local'
    end

    it "should properly generate the page def data" do
      page_defs = File.read(File.join(@bundle[:location], 'ipad', 'www', 'data', 'pagedefs.js'))
      page_defs.should include 'toura.pageDef('
      @page_defs.each do |page_def|
        page_defs.should include page_def
      end
    end

    after do
      @b.cleanup
    end
  end

  describe "android build" do
    before :all do
      @b = Builder::Build.new({
        :build_helper => Mulberry::BuildHelper.new(@app),
        :device_type => 'phone',
        :device_os => 'android',
        :target => 'device_production'
      })

      @b.build

      @bundle = @b.completed_steps[:close][:bundle]
    end

    it "should generate all the required files" do
      @bundle[:location].should_not be_nil

      [
        [ 'android' ],

        [ 'android', 'build.xml' ],
        [ 'android', 'AndroidManifest.xml' ],
        [ 'android', 'local.properties' ],

        [ 'android', 'assets', 'www' ],
        [ 'android', 'assets', 'www', 'index.html' ],

        [ 'android', 'assets', 'www', 'media' ],
        [ 'android', 'assets', 'www', 'media', 'manifest.js' ],

        [ 'android', 'assets', 'www', 'css' ],
        [ 'android', 'assets', 'www', 'css', 'base.css' ],
        [ 'android', 'assets', 'www', 'css', 'resources' ],

        [ 'android', 'assets', 'www', 'data' ],
        [ 'android', 'assets', 'www', 'data', 'tour.js.jet' ],
        [ 'android', 'assets', 'www', 'data', 'pagedefs.js' ],

        [ 'android', 'assets', 'www', 'javascript' ],
        [ 'android', 'assets', 'www', 'javascript', 'dojo', 'dojo.js' ],
        [ 'android', 'assets', 'www', 'javascript', 'toura', 'base.js' ],
        [ 'android', 'assets', 'www', 'javascript', 'client', 'base.js' ],
        [ 'android', 'assets', 'www', 'javascript', 'toura', 'AppConfig.js' ],
        [ 'android', 'assets', 'www', 'javascript', 'vendor', 'haml.js' ]
      ].each do |path|
        File.exists?(File.join(@bundle[:location], path)).should be_true
      end
    end

    it "should properly generate the tour data" do
      File.read(File.join(@bundle[:location], 'android', 'assets', 'www', 'data', 'tour.js.jet')).should include 'toura.data.local'
    end

    it "should properly generate the page def data" do
      page_defs = File.read(File.join(@bundle[:location], 'android', 'assets', 'www', 'data', 'pagedefs.js'))
      page_defs.should include 'toura.pageDef('
      @page_defs.each do |page_def|
        page_defs.should include page_def
      end
    end

    it "should properly populate the manifest" do
      manifest = File.read(File.join(@bundle[:location], 'android', 'AndroidManifest.xml'))
      manifest.should include 'android:versionName="1.0"'
      manifest.should include 'com.toura.app2_fake'
    end

    after do
      @b.cleanup
    end
  end

  after(:all) do
    FileUtils.rm_rf 'testapp'
  end
end
