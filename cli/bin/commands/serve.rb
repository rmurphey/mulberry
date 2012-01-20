require 'cli/bin/commands/base'

module Mulberry
  module Command
    class Serve < Mulberry::Command::Base
      def initialize(args, additional_options = {})
        default_port = 3001
        options = { :port => default_port }

        OptionParser.new do |opts|
          opts.banner = "Usage: mulberry serve [options]"

          opts.on("-p PORT", "--port PORT", Integer, "Runs Mulberry Server on the specified PORT. Default: #{default_port}") do |p|
            options[:port] = p
          end

          opts.on("-v", "--verbose", "Show server logging. Default: Logging Disabled") do |v|
            options[:verbose] = v
          end
        end.parse!

        dir = Mulberry.get_app_dir args[0]

        begin
          app = Mulberry::App.new(dir)
          report dir
          app.serve(options) unless additional_options[:running_under_test]
        rescue ConfigError => ce
          puts "Configuration error: #{ce}"
        end
      end
    end
  end
end
