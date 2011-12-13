module Mulberry
  module Command
    class PublishOta
      def initialize(args)
        data_json = nil
        command = "publish_ota"
        args = []
        OptionParser.new do |opts|
          opts.banner = "Usage: mulberry publish_ota [project_directory] [options]"
          opts.on("-f FILE", "--file FILE", String, "Location of tour json file.") do |p|
            args << File.read(p)
          end

          opts.on("--current", "Show currently published version.") do
            command = "ota_version"
          end
        end.parse!

        dir = Mulberry.get_app_dir args[0]
        begin
          app = Mulberry::App.new(dir).send(command, *args)
        rescue Mulberry::Http::Exception
          puts "Error: #{$!}"
        end
      end
    end
  end
end