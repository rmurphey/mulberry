require 'cli/bin/commands/base'

module Mulberry
  module Command
    class UpdateThemes < Mulberry::Command::Base
      def initialize(args)
        to_dir = Mulberry.get_app_dir
        Mulberry::App.update_themes to_dir
        report to_dir
      end
    end
  end
end
