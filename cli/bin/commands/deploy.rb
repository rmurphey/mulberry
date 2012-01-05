module Mulberry
  module Command
    class Deploy < Mulberry::Command::Base
      def initialize(args, additional_options = {})

        dir = Mulberry.get_app_dir args[0]
        app = Mulberry::App.new(dir)

        app.device_build additional_options

        report dir, "deploy"
      end
    end
  end
end
