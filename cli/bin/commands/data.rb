module Mulberry
  module Command
    class Data < Mulberry::Command::Base
      def initialize(args)
        dir = Mulberry.get_app_dir args[0]
        report dir
        app = Mulberry::App.new(dir)
        d = JSON.pretty_generate(Mulberry::Data.new(app).generate)
        puts d
      end
    end
  end
end
