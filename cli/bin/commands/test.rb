module Mulberry
  module Command
    class Test < Mulberry::Command::Base
      def initialize(args, additional_options = {})
        options = {:quiet => false, :test => true}

        OptionParser.new do |opts|
          opts.banner = "Usage: mulberry test [options]"

          opts.on("-q", "--quiet", "Runs Mulberry test in quiet mode (will not open xcode proj). Default: #{options[:quiet]}") do |q|
            options[:quiet] = q
          end

          opts.on("-s", "--skip-js-build", "Runs Mulberry test without building the javascript.") do |s|
            options[:skip_js_build] = s
          end
        end.parse!

        dir = Mulberry.get_app_dir args[0]
        app = Mulberry::App.new(dir)

        app.device_build( options.merge(additional_options) )
        report dir
      end
    end
  end
end
