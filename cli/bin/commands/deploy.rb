module Mulberry
  module Command
    class Deploy
      def initialize(args, additional_options = {})

        dir = Mulberry.get_app_dir args[0]
        app = Mulberry::App.new(dir)

        app.device_build additional_options
      end
    end
  end
end