require 'yaml'
require 'json'
require 'net/http'

module Mulberry
  module Command
    class Base
      def report(app_dir, command)
        settings_file = File.join(app_dir, '.mulberry')

        if File.exists? settings_file
          settings = YAML.load_file settings_file
          config = Mulberry::App.new(app_dir).config

          host = settings['host']
          guid = settings['guid']

          return unless host && guid

          report = {
            'data' => {
              'config'    => {
                'jquery'  =>  config['jquery'],
                'os'      =>  config['os'].join(','),
                'type'    =>  config['type'].join(',')
              },
              'command'   =>  command,
              'guid'      =>  guid
            }.to_json
          }

          Net::HTTP.post_form(host, report)
        end
      end
    end
  end
end
