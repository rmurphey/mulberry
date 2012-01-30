require 'cli/bin/commands/base'

module Mulberry
  module Command
    class WwwBuild < Mulberry::Command::Base
      def initialize(args, additional_options = {})
        OptionParser.new do |opts|
          opts.banner = "Usage: mulberry www_build [options]"

          opts.on("--skip-js-build", "Disable JavaScript build task.  This
                                     option should not be used on real
                                     projects, it's a tool for Mulberry
                                     core developers to bypass this
                                     time-consuming step when working on
                                     other aspects of deployment.") do |s|
            additional_options[:skip_js_build] = s
          end

          opts.on("--publish-ota",   "Publish an OTA with the contents of this
                                     build.") do |p|
            additional_options[:publish_ota] = p
          end

        end.parse!

        dir = Mulberry.get_app_dir args[0]
        report dir

        app = Mulberry::App.new(dir)
        app.www_build additional_options
      end
    end
  end
end
