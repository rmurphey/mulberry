module Mulberry
  module Command
    class Deploy
      def initialize(args, options_hash = {})

        dir = Mulberry.get_app_dir args[0]
        app = Mulberry::App.new(dir)

        app.device_build options_hash
      end
    end
  end
end