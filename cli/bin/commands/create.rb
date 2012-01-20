require 'cli/bin/commands/base'

module Mulberry
  module Command
    class Create < Mulberry::Command::Base
      def self.commands
        {
          :page       => {},
          :feed       => {},
          :data       => {},
          :location   => {},

          :component  => {
            :creator  =>  Mulberry::CodeCreator
          },

          :page_def   => {
            :creator  =>  Mulberry::PageDefCreator
          },

          :capability => {
            :creator  =>  Mulberry::CodeCreator
          },

          :store      => {
            :creator  =>  Mulberry::CodeCreator
          },

          :model      => {
            :creator  =>  Mulberry::CodeCreator
          },

          :route      => {
            :creator  =>  Mulberry::CodeCreator
          }
        }
      end

      def initialize(args)
        dir          = Mulberry.get_app_dir
        content_type = args.shift.to_sym
        filenames    = args
        commands     = Mulberry::Command::Create.commands

        report dir, content_type

        raise "You must specify a file to create." unless filenames.length > 0

        default_creator = Mulberry::ContentCreator

        raise "Don't know how to create #{content_type}. Valid types:\n" << commands.collect{ |cmd| "#{cmd[0]}" }.sort.join("\n") unless commands[content_type]
        command = commands[content_type]

        filenames.each { |f| raise "The name of a #{content_type.to_s} may not include spaces." if f.match(/\s/) }
        filenames.each { |f| (command[:creator] || default_creator).new(content_type.to_s, dir, f) }
      end
    end
  end
end
