require 'yaml'
require 'json'
require 'net/http'

module Mulberry
  module Command
    class Base
      def report(app_dir, command)
        begin
          return unless Mulberry::FEATURES[:reporting]

          settings_file = File.join(app_dir, '.mulberry')

          return unless File.exists? settings_file

          settings = YAML.load_file settings_file

          report_url = URI(settings['report_url'])
          guid = settings['guid']

          return unless host && guid

          config = Mulberry::App.new(app_dir).config

          req = Net::HTTP::Post.new(report_url.path)
          req.content_type = 'application/json'
          req.body = {
            'config'    => {
              'jquery'  =>  config['jquery'],
              'os'      =>  config['os'].join(','),
              'type'    =>  config['type'].join(',')
            },
            'command'   =>  command,
            'guid'      =>  guid
          }.to_json
          req.send
          res = Net::HTTP.start(report_url.host, report_url.port) { |http| http.request(req) }
        rescue
          # fail silently
        end
      end
    end
  end
end
