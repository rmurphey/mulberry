require File.join(File.expand_path(File.dirname(__FILE__)), '../../lib/builder')

describe Builder::Build do
  before(:each) do
    @config = { :skip_js_build => true }
  end

  it "should raise an exception if no target is provided" do
    lambda {
      Builder::Build.new({})
    }.should raise_error
  end

  it "should log completed tasks" do
    b = Builder::Build.new(@config.merge({
      :target_config => {
        'build_type' => 'fake'
      }
    }))

    b.build

    b.mark_complete(:gather, 'task', 1)
    b.mark_complete(:build, 'task', 2)
    b.mark_complete(:close, 'task', 3)

    b.completed_steps[:gather]['task'].should == 1
    b.completed_steps[:build]['task'].should == 2
    b.completed_steps[:close]['task'].should == 3

    b.cleanup
  end

  it "should support quiet mode" do
    builder = Proc.new do |truthy|
      Builder::Build.new(@config.merge({
        :target_config => {
          'build_type' => 'fake'
        },
        :quiet => truthy
      }))
    end

    [true, false].each do |truthy|
      builder.call( truthy ).quiet.should == truthy
    end

  end

  describe "check for requirements" do
    it "should raise an error if requirements are not met" do
      lambda {
        Builder::Build.new(@config.merge({
          :target_config => {
            'requires' => [
              'some fake requirement'
            ],
            'build_type' => 'fake'
          }
        }))
      }.should raise_error
    end

    it "should not raise an error if requirements are met" do
      lambda {
        b = Builder::Build.new(@config.merge({
          :target_config => {
            'requires' => [
              'thing'
            ],
            'build_type' => 'fake'
          },
          :thing => true
        }))

        b.cleanup
      }.should_not raise_error
    end

    it "should not raise an error if there are no requirements" do
      lambda {
        b = Builder::Build.new(@config.merge({
          :target_config => {
            'requires' => [],
            'build_type' => 'fake'
          }
        }))

        b.cleanup
      }.should_not raise_error
    end

    it "should raise an error if no build_type be specified" do
      lambda {
        Builder::Build.new(@config.merge({
          :target_config => { }
        }))
      }.should raise_error
    end
  end


  describe "gathering step" do
    it "should do nothing if no gathering tasks are specified" do
      b = Builder::Build.new(@config.merge({
        :target_config => {
          'build_type' => 'fake'
        }
      }))

      b.build

      b.completed_steps[:build].keys.length.should == 0

      b.cleanup
    end

    it "should gather www icons if specified" do
      b = Builder::Build.new(@config.merge({
        :target_config => {
          'build_type' => 'device',
          'gather' => {
            'www_icons' => true
          }
        }
      }))

      b.build

      www_icons = b.completed_steps[:gather][:www_icons]
      www_icons.should_not be_nil
      www_icons[:location].should_not be_nil
      www_icons[:files].should_not be_nil

      b.cleanup
    end
  end

  describe "build step" do
    it "should do nothing if no build tasks are specified" do
      b = Builder::Build.new(@config.merge({
        :target_config => {
          'build_type' => 'fake'
        }
      }))

      b.build

      b.completed_steps[:build].keys.length.should == 0

      b.cleanup
    end

    it "should kick off js build if javascript layers are specified" do
      b = Builder::Build.new(@config.merge({
        :skip_js_build => false,
        :target_config => {
          'build_type' => 'fake',
          'build' => {
            'javascript' => [ 'dojo', 'toura' ]
          }
        }
      }))

      b.build

      js = b.completed_steps[:build][:javascript]

      js.should_not be_nil
      js[:location].should_not be_nil
      js[:profile].should_not be_nil
      js[:build_contents].should_not be_nil

      File.exists?(File.join(js[:location], 'dojo', 'dojo.js')).should_not be_nil
      File.exists?(File.join(js[:location], 'toura', 'base.js')).should_not be_nil

      b.cleanup
    end

    it "should ensure haml ends up unminified" do
      b = Builder::Build.new(@config.merge({
        :skip_js_build => false,
        :target_config => {
          'build_type' => 'fake',
          'build' => {
            'javascript' => [ 'dojo' ]
          }
        }
      }))

      b.build

      js = b.completed_steps[:build][:javascript]

      haml = File.join(js[:location], 'vendor', 'haml.js')
      File.exists?(haml).should_not be_nil
      contents = File.read haml
      contents.should_not match 'dojo._hasResource'

      b.cleanup
    end

    it "should build html if html is specified" do
      b = Builder::Build.new(@config.merge({
        :target_config => {
          'build_type' => 'device',
          'build' => {
            'html' => true
          }
        }
      }))

      b.build

      html = b.completed_steps[:build][:html]
      html.should_not be_nil
      html[:location].should_not be_nil
      html[:files].should_not be_nil

      index_html = File.read(File.join(html[:location], 'index.html'))
      index_html.should match 'phonegap'
      index_html.should_not match 'readyFn'

      b.cleanup
    end

    it "should not include phonegap in the html if it is a browser build" do
      b = Builder::Build.new(@config.merge({
        :target_config => {
          'build_type' => 'browser',
          'build' => {
            'html' => true
          }
        }
      }))

      b.build

      html = b.completed_steps[:build][:html]
      index_html = File.read(File.join(html[:location], 'index.html'))
      index_html.should_not match 'phonegap'
    end
  end

  describe "closing" do
    it "should do nothing if no closing tasks are specified" do
      b = Builder::Build.new(@config.merge({
        :target_config => {
          'build_type' => 'fake',
          'close' => nil
        }
      }))

      b.build

      b.completed_steps[:close].keys.length.should == 0

      b.cleanup
    end

    describe "bundled builds" do
    end
  end
end
