require 'spec_helper'

require 'lib/builder'
require 'mulberry/mulberry'
require 'mulberry/build_helper'

describe Builder::Build do
  before(:all) do
    @config = { :skip_js_build => true }
    Mulberry::App.scaffold('testapp', true)
    @app = Mulberry::App.new 'testapp'
  end

  it "should properly bundle an iphone build" do
    b = Builder::Build.new(@config.merge({
      :build_helper => Mulberry::BuildHelper.new(@app),
      :device_type => 'phone',
      :device_os => 'ios',
      :target => 'device_production'
    }))

    b.build

    bundle = b.completed_steps[:close][:bundle]
    bundle[:location].should_not be_nil

    [
      [ 'iphone' ],

      [ 'iphone', 'Toura' ],

      [ 'iphone', 'Toura', 'Toura-Info.plist' ],
      [ 'iphone', 'Toura', 'UrbanAirship.plist' ],

      [ 'iphone', 'www' ],
      [ 'iphone', 'www', 'index.html' ],

      [ 'iphone', 'www', 'media' ],
      [ 'iphone', 'www', 'media', 'manifest.js' ],
      [ 'iphone', 'www', 'icons' ],

      [ 'iphone', 'www', 'css' ],
      [ 'iphone', 'www', 'css', 'base.css' ],

      [ 'iphone', 'www', 'data' ],
      [ 'iphone', 'www', 'data', 'tour.js.jet' ],
      [ 'iphone', 'www', 'data', 'templates.js' ],

      [ 'iphone', 'www', 'javascript' ]
    ].each do |path|
      File.exists?(File.join(bundle[:location], path)).should be_true
    end

    b.cleanup
  end

  it "should properly bundle an iphone build" do
    b = Builder::Build.new(@config.merge({
      :build_helper => Mulberry::BuildHelper.new(@app),
      :device_type => 'phone',
      :device_os => 'ios',
      :target => 'device_production'
    }))

    b.build

    bundle = b.completed_steps[:close][:bundle]
    bundle[:location].should_not be_nil

    [
      [ 'iphone' ],

      [ 'iphone', 'Toura' ],

      [ 'iphone', 'Toura', 'Toura-Info.plist' ],
      [ 'iphone', 'Toura', 'UrbanAirship.plist' ],

      [ 'iphone', 'www' ],
      [ 'iphone', 'www', 'index.html' ],

      [ 'iphone', 'www', 'media' ],
      [ 'iphone', 'www', 'media', 'manifest.js' ],
      [ 'iphone', 'www', 'icons' ],

      [ 'iphone', 'www', 'css' ],
      [ 'iphone', 'www', 'css', 'base.css' ],

      [ 'iphone', 'www', 'data' ],
      [ 'iphone', 'www', 'data', 'tour.js.jet' ],
      [ 'iphone', 'www', 'data', 'templates.js' ],

      [ 'iphone', 'www', 'javascript' ]
    ].each do |path|
      File.exists?(File.join(bundle[:location], path)).should be_true
    end
  end

  it "should properly bundle an ipad build" do
    b = Builder::Build.new(@config.merge({
      :build_helper => Mulberry::BuildHelper.new(@app),
      :device_type => 'tablet',
      :device_os => 'ios',
      :target => 'device_production'
    }))

    b.build

    bundle = b.completed_steps[:close][:bundle]
    bundle[:location].should_not be_nil

    [
      [ 'ipad' ],

      [ 'ipad', 'Toura' ],

      [ 'ipad', 'Toura', 'Toura-Info.plist' ],
      [ 'ipad', 'Toura', 'UrbanAirship.plist' ],

      [ 'ipad', 'www' ],
      [ 'ipad', 'www', 'index.html' ],

      [ 'ipad', 'www', 'media' ],
      [ 'ipad', 'www', 'media', 'manifest.js' ],
      [ 'ipad', 'www', 'icons' ],

      [ 'ipad', 'www', 'css' ],
      [ 'ipad', 'www', 'css', 'base.css' ],

      [ 'ipad', 'www', 'data' ],
      [ 'ipad', 'www', 'data', 'tour.js.jet' ],
      [ 'ipad', 'www', 'data', 'templates.js' ],

      [ 'ipad', 'www', 'javascript' ]
    ].each do |path|
      File.exists?(File.join(bundle[:location], path)).should be_true
    end
  end

  it "should properly bundle an android build" do
    b = Builder::Build.new(@config.merge({
      :build_helper => Mulberry::BuildHelper.new(@app),
      :device_type => 'phone',
      :device_os => 'android',
      :target => 'device_production'
    }))

    b.build

    bundle = b.completed_steps[:close][:bundle]
    bundle[:location].should_not be_nil

    [
      [ 'android' ],

      [ 'android', 'build.xml' ],
      [ 'android', 'AndroidManifest.xml' ],
      [ 'android', 'local.properties' ],

      [ 'android', 'assets', 'www' ],
      [ 'android', 'assets', 'www', 'index.html' ],

      [ 'android', 'assets', 'www', 'media' ],
      [ 'android', 'assets', 'www', 'media', 'manifest.js' ],
      [ 'android', 'assets', 'www', 'icons' ],

      [ 'android', 'assets', 'www', 'css' ],
      [ 'android', 'assets', 'www', 'css', 'base.css' ],

      [ 'android', 'assets', 'www', 'data' ],
      [ 'android', 'assets', 'www', 'data', 'tour.js.jet' ],
      [ 'android', 'assets', 'www', 'data', 'templates.js' ],

      [ 'android', 'assets', 'www', 'javascript' ]
    ].each do |path|
      File.exists?(File.join(bundle[:location], path)).should be_true
    end
  end

  after(:all) do
    FileUtils.rm_rf 'testapp'
  end
end
