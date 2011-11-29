module Mulberry
  module Command
    class PublishOta
      def initialize(args)
        data_json = nil
        OptionParser.new do |opts|
          opts.banner = "Usage: mulberry publish_ota [project_directory] [options]"

          opts.on("-f FILE", "--file FILE", String, "Location of tour json file.") do |p|
            data_json = File.read(p)
          end
        end.parse!

        dir = Mulberry.get_app_dir args[0]
        begin
          app = Mulberry::App.new(dir).publish_ota(data_json)
        rescue Mulberry::Http::Exception
          puts "Error: #{$!}"
        end
      end
    end
  end
end