require 'lib/builder/build_helper'
require 'lib/builder/css_maker'

module Mulberry
  class BuildHelper
    include Builder::BuildHelper

    attr_reader :source_dir

    def initialize(app)
      @app          = app

      @config       = @app.config
      @name         = @app.name
      @assets_dir   = @app.assets_dir
      @source_dir   = @app.source_dir

      @build_dir    =  File.join(
        @source_dir,
        'builds'
      )
    end

    def before_steps() end
    def after_steps() end

    def project_settings
      {
        :id                   => @config['name'].gsub(/'/, "\\\\'"),
        :version              => Time.now.to_i,
        :name                 => @name,
        :bundle               => @build_dir,
        :jquery               => @config['jquery'],
        :config_dir           => @source_dir,
        :flurry_config        => @config['flurry'],
        :urban_airship_config => @config['urban_airship']
      }
    end

    def config_settings
      {
        'id' => @config['name'].gsub(/'/, "\\\\'")
      }
    end

    def icons(destination, report)
      false
    end

    def load_screens(destination, report)
      required = []

      [ 'phone', 'tablet' ].each do |type|
        if @config['type'].include? type
          required << "#{type}_portrait.png" << "#{type}_landscape.png"
        end
      end

      found = required.select do |screen|
        File.exists? File.join(@assets_dir, 'load_screens', screen)
      end

      found.each do |screen|
        FileUtils.cp(
          File.join(@assets_dir, 'load_screens', screen),
          destination
        )
      end
    end

    def assets(destination, report)
      device_type = build.target['device_type']
      destination_dir = File.join(destination, device_type)
      FileUtils.rm_rf destination_dir if File.exists? destination_dir
      FileUtils.mkdir_p destination_dir
      report[:dir] = device_type

      [ 'audios', 'images', 'videos', 'data' ].each do |asset_type|
        src = File.join(@assets_dir, asset_type)
        if File.exists? src
          FileUtils.cp_r(src, destination_dir)
        end
      end

      true
    end

    def data
      Mulberry::Data.new(@app).generate
    end

    def templates
      templates_dir = File.join(@source_dir, 'templates')
      templates = {}

      Dir.entries(templates_dir).each do |t|
        if t.match(/.yml$/)
          template_data = YAML.load_file File.join(@source_dir, 'templates', t)
          templates.merge!(template_data) if template_data
        end
      end unless !File.exists?(templates_dir)

      templates
    end

    def css(destination, report)
      File.open(destination, 'w') { |f| f.write create_css }
      true
    end

    def create_css
      begin
        theme = @config['theme']['name'] || 'default'

        custom_dir        = File.join(@source_dir, 'themes', theme)

        theme_base_path   = File.join(custom_dir, 'theme.scss')
        custom_base_path  = File.join(custom_dir, 'custom.scss')

        theme_base_path   = (File.exists? theme_base_path) ? theme_base_path : TouraAPP::App.base_scss

        Builder::CSSMaker.new(
          :vars => @config['theme']['settings'],
          :toura_base_path => theme_base_path,
          :custom_base_path => (custom_base_path if File.exists? custom_base_path),
          :load_paths => [ TouraAPP::App.js_dir, custom_dir ]
        ).render
      rescue Sass::SyntaxError => err
        puts "SASS ERROR: #{err.to_s}"
      end
    end

    def html_vars
      {
        :include_jquery     => @config['jQuery'] || @config['jquery'],
      }
    end

    def app_id(device_os, device_type)
      @config['app_id'][device_os][device_type]
    end

    def custom_js_source
      File.join(@source_dir, 'javascript')
    end

    private
    def padded_id
      project_settings[:id].gsub(/\W/, '');
    end
  end
end
