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
        example_group.extend self
      end

      def setup_app(describe_block)
        describe_block.before :each do
          name = 'command_test_app'

          Dir.chdir Mulberry.root

          # Just in case
          FileUtils.rm_rf File.join(Mulberry.root, name)

          Mulberry::App.scaffold(name, true)
          @app = Mulberry::App.new name
          @app.should_not be_nil

        end

        describe_block.after :each do
          Dir.chdir Mulberry.root

          FileUtils.rm_rf File.join(Mulberry.root, @app.name)
        end
      end
    end
  end
end