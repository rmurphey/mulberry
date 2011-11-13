gem 'sass', '=3.1.4'
require 'sass'
require 'toura_app/application.rb'

module Builder
  class CSSMaker
    @@css_filename = 'base.scss'

    def initialize(settings)
      if !settings[:theme_dir]
        raise "CSSMaker requires a theme_dir"
      end

      scss_data = ''
      app_dir = TouraAPP::Directories.javascript
      app_base = File.join(app_dir, @@css_filename)

      theme_dir = settings[:theme_dir]
      theme_base = File.join(theme_dir, @@css_filename)

      puts "app_dir: #{app_dir}"
      puts "theme_base: #{theme_base}"

      sass_settings = {
        :syntax => :scss,
        :style => :expanded,
        :line_numbers => true,
        :full_exception => false,
        :quiet => false,
        :load_paths => [ app_dir, theme_dir ]
      }

      if settings.has_key?(:vars)
        settings[:vars].each do |k, v|
          scss_data << "$user-#{k}: #{v};"
        end
      end

      [ app_base, theme_base ].each do |path|
        scss_data << File.read(path)
      end

      @engine = Sass::Engine.new(scss_data, sass_settings)
    end

    def render
      @engine.render
    end
  end
end
