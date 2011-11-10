gem 'sass', '=3.1.4'
require 'sass'

module Builder
  class CSSMaker
    def initialize(settings)
      scss_data = ''

      if settings[:toura_base_path].nil? or !settings.has_key? :toura_base_path
        raise "CSSMaker requires a :toura_base_path"
      end

      settings[:vars].each do |k, v|
        scss_data << "$user-#{k}: #{v};"
      end

      [ :toura_base_path, :theme_path ].each do |path|
        if settings.has_key?(path) && settings[path] && File.exists?(settings[path])
          scss_data << File.read(settings[path])
        end
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
