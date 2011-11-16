module Mulberry
  module Command
    class Test
      def initialize(args)
        dir = Mulberry.get_app_dir args[0]
        app = Mulberry::App.new(dir)
        app.generate(:test => true)
      end
    end
  end
end