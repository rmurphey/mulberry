require 'cli/bin/commands/base'

module Mulberry
  module Command
    class Data < Mulberry::Command::Base
      def initialize(args)
        super

        report @dir
        app = Mulberry::App.new(@dir)
        d = JSON.pretty_generate(Mulberry::Data.new(app).generate)
        puts d
      end
    end
  end
end
