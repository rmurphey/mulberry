module Mulberry
  module Command
    class Test
      def initialize(args)
        options = {:quiet => false}

        OptionParser.new do |opts|
          opts.banner = "Usage: mulberry test [options]"

          opts.on("-q", "--quiet", "Runs Mulberry test in quiet mode (will not open xcode proj). Default: #{options[:quiet]}") do |q|
            options[:quiet] = q
          end
        end.parse!

        dir = Mulberry.get_app_dir args[0]
        app = Mulberry::App.new(dir)
        app.device_build( options.merge({:test => true}) )
      end
    end
  end
end