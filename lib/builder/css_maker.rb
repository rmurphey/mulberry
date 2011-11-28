gem 'sass', '=3.1.4'
require 'sass'
require 'toura_app/application.rb'

module Builder
  class CSSMaker
    @@css_filename = 'base.scss'

    def initialize(settings)
      if settings[:custom_base_path]
        puts "CSSMaker: :custom_base_path is deprecated. Use :theme_dir instead."
      end

      if !settings[:theme_dir]
        raise "CSSMaker requires a theme_dir"
      end

      if settings[:vars_path].nil? or !settings.has_key? :vars_path
        raise "CSSMaker requires a :vars_path" unless settings[:vars]
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

      if settings.has_key?(:vars)
        settings[:vars].each do |k, v|
          scss_data << "$user-#{k}: #{v};"
        end
      end

      if settings.has_key?(:vars_path)
        scss_data << File.read(settings[:vars_path])
      end

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
