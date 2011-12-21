gem 'sass', '=3.1.4'
require 'sass'
require 'app'

module Builder
  class CSSMaker
    @@css_filename = 'base.scss'

    def self.scss_data_from_vars_hash(vars_hash)
      vars_hash.keys.reduce("") do |scss_data, k|
        scss_data << "$#{k}: #{vars_hash[k]};"
        scss_data
      end
    end

    def initialize(settings)
      if !settings[:theme_dir]
        raise "CSSMaker requires a theme_dir"
      end

      app_dir = settings.has_key?(:app_dir) ? settings[:app_dir] : TouraAPP::Directories.javascript
      app_base = File.join(app_dir, @@css_filename)

      theme_dir = settings[:theme_dir]
      theme_base = File.join(theme_dir, @@css_filename)

      sass_settings = {
        :syntax => :scss,
        :style => :expanded,
        :line_numbers => true,
        :full_exception => false,
        :quiet => false,
        :load_paths => [ app_dir, theme_dir ]
      }

      data = load_dependencies(settings, app_base, theme_base)
      create_engine(data, sass_settings)
    end

    def render
      @engine.render
    end

    private
    def load_dependencies(settings, app_base, theme_base)
      scss_data = ''

      [ app_base, theme_base ].each do |path|
        scss_data << File.read(path)
      end

      scss_data
    end

    def create_engine(scss_data, sass_settings)
      @engine = Sass::Engine.new(scss_data, sass_settings)
    end
  end
end
