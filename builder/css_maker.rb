gem 'sass', '=3.1.4'
require 'sass'
require 'app'

module Builder
  class CSSMaker
    @@css_filename = 'base.scss'

    def initialize(settings)
      if !settings[:css_dir]
        raise "CSSMaker requires a css_dir"
      end

      app_dir = settings.has_key?(:app_dir) ? settings[:app_dir] : Mulberry::Framework::Directories.javascript
      app_base = File.join(app_dir, @@css_filename)

      css_dir = settings[:css_dir]
      theme_base = File.join(css_dir, @@css_filename)

      sass_settings = {
        :syntax => :scss,
        :style => :expanded,
        :line_numbers => true,
        :full_exception => false,
        :quiet => false,
        :load_paths => [ app_dir, css_dir ]
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

      scss_data << File.read(app_base)

      theme_base_contents = File.read(theme_base)

      settings[:overrides].each do |k, v|
        theme_base_contents.gsub!("@import '#{k.to_s}';", v)
      end if settings[:overrides]

      scss_data << theme_base_contents

      if settings[:postscript]
        scss_data << settings[:postscript]
      end

      scss_data
    end

    def create_engine(scss_data, sass_settings)
      @engine = Sass::Engine.new(scss_data, sass_settings)
    end
  end
end
