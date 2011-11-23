module Mulberry
  module Command
    class PublishOta
      def initialize(args)
        if (args.length < 1 )
          dir = Mulberry.get_app_dir
          data_json = STDIN.read # read data_json from pipe
        elsif (args.length < 2)
          dir = Mulberry.get_app_dir
          data_json = File.read(args[0])
        else
          dir = Mulberry.get_app_dir args[0]
          data_json = File.read(args[1])
        end
        app = Mulberry::App.new(dir).publish_ota(data_json)
      end
    end
  end
end