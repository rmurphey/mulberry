gem 'sass', '=3.1.4'
require 'sass'
require 'toura_app/application.rb'

module Builder
  class CSSMaker
    def initialize(settings)
      scss_data = ''

      puts TouraAPP::base_scss
      puts settings[:theme_path]

      settings[:vars].each do |k, v|
        scss_data << "$user-#{k}: #{v};"
      end

      [ TouraAPP::base_scss, settings[:theme_path] ].each do |path|
        scss_data << File.read(path)
      end

      @engine = Sass::Engine.new(scss_data,
        :syntax => :scss,
        :style => :expanded,
        :line_numbers => true,
        :full_exception => false,
        :quiet => false,
        :load_paths => settings[:load_paths]
      )
    end

    def render
      @engine.render
    end
  end
end
