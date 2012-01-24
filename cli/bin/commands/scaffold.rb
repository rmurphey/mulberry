require 'cli/bin/commands/base'
require 'yaml'
require 'guid'

module Mulberry
  module Command
    class Scaffold < Mulberry::Command::Base
      def initialize(args, additional_options = {})
        dir = args[0]

        @options = { :reporting_enabled => false }.merge(additional_options)
        input = nil

        OptionParser.new do |opts|
          opts.banner = "Usage: mulberry scaffold [dirname] [options]"

          opts.on("-r", "--reporting_enabled", "Automatically enables reporting. Default: #{@options[:reporting_enabled]}") do |r|
            @options[:reporting_enabled] = r
          end
        end.parse!

        raise "You must specify an app name" unless dir

        @dir = dir.gsub(File.join(Dir.pwd, ""), "")
        Mulberry::App.scaffold(@dir)

        reporting_opt_in if Mulberry::FEATURES[:reporting]
      end

      def reporting_opt_in
        if @options[:reporting_enabled]
          # this is to allow tests to run silently and without interruption
          input = 'Y'
        else
          puts "Are you willing to send Toura anonymous usage statistics to help improve Mulberry? (y/N)"
          input = STDIN.gets.strip
        end

        if input.downcase == 'y'
          self.class.create_dot_mulberry_file @dir
          report @dir
        end
      end

      def self.create_dot_mulberry_file(dir)
        File.open(File.join(dir, '.mulberry'), 'w') do |f|
          y = {
            'report_url'      =>  URI.join(TouraApi::URL, '/mulberry_command_logs').to_s,
            'guid'            =>  Guid.new.to_s
          }.to_yaml

          f.write y
        end

      end

    end
  end
end
