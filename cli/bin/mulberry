#!/usr/bin/env ruby
$: << File.expand_path('../..', __FILE__)
$: << File.expand_path('../../..', __FILE__)

require 'mulberry'
require 'optparse'

Dir[File.dirname(__FILE__) + '/commands/*.rb'].each {|file| require file }

module Mulberry
  class CLI
    def run(args)

      if !args[0]
        puts "mulberry must be called with an action."
        return
      end

      action = args.shift

      if action.match /^-{0,2}(version|v)$/
        puts "Mulberry v#{Mulberry::version}"
        return
      end

      begin

        Mulberry::Command.class_eval(action.camelize).new(args)

      rescue NameError => ex

        # Re-raise anything that's unexpected
        raise ex unless ex.message.include? "uninitialized constant Mulberry::Command::"

        puts "Invalid command: #{action}\n\Valid commands:\n"

        Mulberry::Command.constants.collect{ |c| c.to_s.underscore }.sort.each do |command|
          puts command
        end

      end # begin/rescue
    end # run
  end # cli
end # mulberry

Mulberry::CLI.new.run(ARGV)
