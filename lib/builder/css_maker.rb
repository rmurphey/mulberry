gem 'sass', '=3.1.4'
require 'sass'
require 'toura_app/application.rb'

module Builder
  class CSSMaker
    def initialize(settings)
      if !settings[:theme_path]
        raise "CSSMaker requires a theme_path"
      end

      scss_data = ''
      theme_path = settings[:theme_path]
      custom_dir = File.dirname(theme_path)
      sass_settings = {
        :syntax => :scss,
        :style => :expanded,
        :line_numbers => true,
        :full_exception => false,
        :quiet => false,
        :load_paths => [ TouraAPP::Directories.javascript, custom_dir ]
      }

      settings[:vars].each do |k, v|
        scss_data << "$user-#{k}: #{v};"
      end

      [ TouraAPP::base_scss, theme_path ].each do |path|
        scss_data << File.read(path)
      end

      @engine = Sass::Engine.new(scss_data, sass_settings)
    end

    def render
      @engine.render
    end
  end
end
