require 'yaml'
require 'json'
require 'net/http'

module Mulberry
  module Command
    class Base
      def report(app_dir, command)
        return unless Mulberry::FEATURES[:reporting]

        settings_file = File.join(app_dir, '.mulberry')

        return unless File.exists? settings_file

        settings = YAML.load_file settings_file

        host = settings['host']
        guid = settings['guid']

        return unless host && guid

        config = Mulberry::App.new(app_dir).config

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

        begin
          Net::HTTP.post_form(host, report)
        rescue
          # fail silently
        end

      end
    end
  end
end
