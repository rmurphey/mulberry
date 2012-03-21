require 'spec_helper'
require 'builder'
require 'fakeweb'

# This file is for testing general builder behavior. Tests for
# Mulberry-specific build behavior shoudl go in spec/cli/build_spec.rb

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

    it "should raise an error if no build_type be specified" do
      lambda {
        Builder::Build.new(@config.merge({
          :target_config => { }
        }))
      }.should raise_error
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

  describe "ota" do

    after :each do
      FakeWeb.clean_registry
    end

    describe "enabled" do

      before :each do
        @build = Builder::Build.new(@config.merge({
          :build_helper => FakeBuildHelper.new,
          :target_config => {
            'build_type' => 'device',
            'gather' => {
              'data' => true
            },
            'ota' => {
              'enabled' => true
            }
          },
          :toura_api_config => {
            'url' => 'https://api.toura.com',
            'key' => 'a_key',
            'secret' => 'a_secret'
          }
        }))
      end

      after :each do
        @build.cleanup
      end

      it "should report tour json location if ota enabled" do
        FakeWeb.register_uri(:get, //, :body => "{\"version\": 1}")
        @build.build
        data_report = @build.completed_steps[:gather][:data]
        data_report[:tour_json_location].should_not be_nil
      end
    end

  end

end
