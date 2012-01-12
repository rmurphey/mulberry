require 'yaml'
require 'json'
require 'net/http'

module Mulberry
  module Command
    class Base
      def report(app_dir, sub_command=nil)
        begin
          return unless Mulberry::FEATURES[:reporting]

          command = self.class.name.split("::").last.underscore
          command << ":#{sub_command}" if sub_command

          settings_file = File.join(app_dir, '.mulberry')

          return unless File.exists? settings_file

          settings = YAML.load_file settings_file

          guid = settings['guid']

          return unless settings['report_url'] && guid

          report_url = URI(settings['report_url'].sub("https", "http"))

          config = Mulberry::App.new(app_dir).config

          req = Net::HTTP::Post.new(report_url.path)
          req.content_type = 'application/json'
          req.body = {
            'config'    => {
              'jquery'  =>  config['jquery'],
              'oses'      =>  config['os'],
              'types'    =>  config['type']
            },
            'command'   =>  command,
            'guid'      =>  guid
          }.to_json
          res = Net::HTTP.start(report_url.host, report_url.port) { |http| http.request(req) }
        rescue
          # fail silently
        end
      end
    end
  end
end
