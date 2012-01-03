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

        reporting_opt_in unless !Mulberry::FEATURES[:reporting]
      end

      def reporting_opt_in
        unless @options[:reporting_enabled]
          puts "Are you willing to send Toura anonymous usage statistics to help improve Mulberry? (Y/n)"
          input = STDIN.gets.strip
        else
          input = 'Y'
        end

        if input.downcase == 'y'
          File.open(File.join(@dir, '.mulberry'), 'w') do |f|
            y = {
              'host'            =>  'http://localhost:8888',
              'guid'            =>  Guid.new.to_s
            }.to_yaml

            f.write y
          end

          puts "Created #{File.join(@dir, '.mulberry')} to enable anonymous reporting"
        end
      end
    end
  end
end
