module Mulberry
  module Command
    class PublishOta < Mulberry::Command::Base
      def initialize(args)
        data_json = nil
        app_method = "publish_ota"
        app_method_args = []
        OptionParser.new do |opts|
          opts.banner = "Usage: mulberry publish_ota [project_directory] [options]"
          opts.on("-f FILE", "--file FILE", String, "Location of tour json file.") do |p|
            app_method_args << File.read(p)
          end

          opts.on("--current", "Show currently published version.") do
            app_method = "ota_version"
          end
        end.parse!

        dir = Mulberry.get_app_dir args[0]
        report dir
        begin
          app = Mulberry::App.new(dir).send(app_method, *app_method_args)
        rescue Mulberry::Http::Exception
          puts "Error: #{$!}"
        end
      end
    end
  end
end