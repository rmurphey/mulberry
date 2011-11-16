module Mulberry
  module Command
    class Serve
      def initialize(args)

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
          app.serve(options)
        rescue ConfigError => ce
          puts "Configuration error: #{ce}"
        end
      end
    end
  end
end