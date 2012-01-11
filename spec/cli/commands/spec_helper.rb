require 'spec_helper'
require 'fakefs/spec_helpers'
require 'webmock/rspec'
WebMock.disable!
require 'nokogiri'

Dir[File.dirname(__FILE__) + '/../../../cli/bin/commands/*.rb'].each {|file| require file }

module Mulberry
  module Command
    module SpecHelpers

      def self.extended(example_group)
        example_group.setup_app(example_group)
      end

      def self.included(example_group)
        example_group.extend self
      end

      def setup_app(describe_block)
        describe_block.before :each do
          @app = scaffold_app("test_app")
          @app.should_not be_nil
        end

        describe_block.after :each do
          Dir.chdir Mulberry::Directories.root

          FileUtils.rm_rf File.join(Mulberry::Directories.root, @app.name)
        end
      end

      def scaffold_app(name)
        Dir.chdir Mulberry::Directories.root

        # Just in case
        FileUtils.rm_rf File.join(Mulberry::Directories.root, name)

        Mulberry::App.scaffold(name, true)
        Mulberry::App.new name
      end
    end
  end
end

shared_examples_for "all commands" do

  it "should report its usage" do
    begin
      WebMock.enable!
      Mulberry::Command::Scaffold.create_dot_mulberry_file @app.source_dir
      toura_api_uri = URI(TouraApi::URL)
      command = described_class.name.split("::").last.underscore
      begin
        if self.respond_to? "exec_simple_init_example"
          exec_simple_init_example
        else
          described_class.new([@app.name, "foo"])
        end
      rescue
      end
      WebMock.should have_requested(:post,
                       "#{toura_api_uri.host}/mulberry_command_logs").
                     with { |req| JSON.parse(req.body)['command'].match /^#{command}/ }
    ensure
      WebMock.disable!
      FileUtils.rm_rf File.join(@app.source_dir, ".mulberry")
    end
  end

end