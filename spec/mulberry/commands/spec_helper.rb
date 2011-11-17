require 'spec_helper'
require 'fakefs/spec_helpers'

Dir[File.dirname(__FILE__) + '/../../../mulberry/bin/commands/*.rb'].each {|file| require file }

module Mulberry
  module Command
    module SpecHelpers

      def self.extended(example_group)
        example_group.setup_app(example_group)
      end

      def self.included(example_group)
        # example_group.module_eval do
        #   include FakeFS::SpecHelpers
        # end
        example_group.extend self
      end

      def setup_app(describe_block)
        describe_block.before :each do
          Mulberry::App.scaffold('testapp', true)
          @app = Mulberry::App.new 'testapp'
          @app.should_not be_nil
        end

        describe_block.after :each do
          FileUtils.rm_rf 'testapp'
        end
      end
    end
  end
end