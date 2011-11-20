module Mulberry
  module Command
    class Deploy
      def initialize(args)
        dir = Mulberry.get_app_dir args[0]
        app = Mulberry::App.new(dir)
        app.device_build
      end
    end
  end
end