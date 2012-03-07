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

      # This directory contains the basic styles needed by the framework to work
      framework_dir = Mulberry::Framework::Directories.app

      # This is the directory within the mulberry app where user-created styles go
      css_dir = settings[:css_dir]

      app_scss_base = File.join(css_dir, @@css_filename)

      sass_settings = {
        :syntax => :scss,
        :style => :expanded,
        :line_numbers => true,
        :full_exception => false,
        :quiet => false,
        :load_paths => [ framework_dir, css_dir ]
      }

      data = load_dependencies(settings, app_scss_base)
      create_engine(data, sass_settings)
    end

    def render
      @engine.render
    end

    private
    def load_dependencies(settings, app_scss_base)
      scss_data = ''

      app_scss_base_contents = File.read(app_scss_base)

      settings[:overrides].each do |k, v|
        app_scss_base_contents.gsub!("@import '#{k.to_s}';", v)
      end if settings[:overrides]

      scss_data << app_scss_base_contents

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
