require 'spec_helper'
require 'fakefs/spec_helpers'
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
