require 'rubygems'
require 'sinatra/base'

require 'lib/builder/css_maker'
require 'toura_app/application'

module Mulberry
  class Server < Sinatra::Base

    def initialize
      super

      @mulberry_app = settings.app
      @helper = @mulberry_app.helper

      @index_template = 'index.html'.to_sym
      @iframe_template = 'iframe.html'.to_sym
      @source_dir = @mulberry_app.source_dir
      @js_build_name = 'dev'
    end

    private

    #####################
    # Helpers
    #####################
    def self.file_path(*args)
      File.join(TouraAPP::Directories.root, *args)
    end

    def file_path(*args)
      Mulberry::Server.file_path(*args);
    end

    #####################
    # Settings
    #####################

    disable :logging

    set :raise_errors => true
    set :root, file_path('.')
    set :public_folder, file_path('www')
    set :views, file_path('templates')
    set :host, 'localhost'

    #####################
    # Tours
    #####################
    get '/' do
      redirect "/ios/phone/"
    end

    get "/:os/:type/" do
      haml @index_template, :locals => {
        :body_onload        => "readyFn()",
        :include_jquery     => @mulberry_app.config['jQuery'] || @mulberry_app.config['jquery'],
        :include_dev_config => true,
        :device_type        => params[:type] || 'phone',
        :device_os          => params[:os] || 'ios'
      }
    end

    get '/:os/:type/develop.html' do
      haml @iframe_template
    end

    #####################
    # CSS
    #####################
    get '/:os/:type/css/base.css' do
      content_type 'text/css'
      @helper.create_css
    end

    #####################
    # JavaScript
    #####################

    # dojo files have to come from the built js
    get '/:os/:type/javascript/dojo/*' do
      content_type 'text/javascript'
      send_file file_path(
        "javascript",
        @js_build_name,
        "dojo",
        params[:splat].first
      )
    end

    get '/:os/:type/javascript/dijit/*' do
      content_type 'text/javascript'
      send_file file_path(
        "javascript",
        @js_build_name,
        "dijit",
        params[:splat].first
      )
    end

    # nls (i18n) files have to come from the built js
    get '/:os/:type/javascript/toura/nls/*' do
      content_type 'text/javascript'
      nls_file = file_path(
        "javascript",
        @js_build_name,
        "toura",
        "nls",
        params[:splat].first
      )

      if File.exists? nls_file
        send_file nls_file
      else
        '{}'
      end
    end

    get '/:os/:type/javascript/toura/app/TouraConfig.js' do
      content_type 'text/javascript'
      device_type = params[:type] || 'phone'
      os = params[:os] || 'ios'

      config_settings = @helper.config_settings.merge(
        {
          "id" => @mulberry_app.id,
          "build" => Time.now.to_i,
          "debug" => true
        }
      )
      ['version_url', 'update_url'].each do |key|
        ota_url = config_settings[key]
        if ota_url and ota_url.length > 1
          config_settings[key] = ota_url.sub(/http:\/\/[^\/]+/, url.match(/http:\/\/[^\/]+/)[0])
        end
      end
      TouraAPP::Generators.config os, device_type, config_settings
    end

    get '*ota_service*' do
      if url.match /version_json/
        ota_url = @helper.config_settings['version_url']
      elsif url.match /data_json/
        ota_url = @helper.config_settings['update_url']
        headers 'Content-Encoding' => 'gzip'
      else
        raise "Don't know how to proxy #{url}"
      end
      begin
        res = Mulberry::Data.fetch(ota_url)
        status res.code
        res.body
      rescue Errno::ECONNREFUSED
        status 503 # unavailable
      end
    end

    get '/:os/:type/javascript/toura/app/DevConfig.js' do
      content_type 'text/javascript'

      dev_config = file_path(
        'javascript',
        'toura',
        'app',
        'DevConfig.js'
      )

      if File.exists? dev_config
        send_file dev_config
      else
        ''
      end
    end

    get '/:os/:type/javascript/client/*' do
      content_type 'text/javascript'
      send_file File.join(
        @source_dir,
        'javascript',
        params[:splat].first
      )
    end

    get '/:os/:type/javascript/*' do
      content_type 'text/javascript'
      send_file file_path(
        "javascript",
        params[:splat].first
      )
    end

    #####################
    # Data
    #####################
    get '/:os/:type/data/*' do
      content_type "text/javascript"

      begin
        case params[:splat].first
        when 'tour.js'
          target = @helper.build.target
          ota_enabled = target['ota'] and target['ota']['enabled']
          "toura.data.local = #{JSON.pretty_generate(Mulberry::Data.new(@mulberry_app).generate(ota_enabled))};"
        when 'templates.js'
          "toura.templates = #{JSON.pretty_generate(TouraAPP::Generators.page_templates @helper.templates)};"
        end
      rescue RuntimeError => e
        puts "ERROR: #{e.to_s}"
      end
    end

    #####################
    # Media
    #####################
    get '/:os/:type/media/manifest.js' do
      "toura.app.manifest = {};"
    end

    get '/:os/:type/media/*' do
      send_file File.join(
        @source_dir,
        "assets",
        params[:splat].first
      )
    end

    #####################
    # Resources
    #####################
    get '/:os/:type/*' do
      send_file file_path(
        "www",
        params[:splat].first
      )
    end
  end
end
