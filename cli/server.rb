require 'rubygems'
require 'sinatra/base'
require 'rack/file'

require 'mulberry'
require 'builder/css_maker'
require 'app'

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
    def self.mulberry_file_path(*args)
      File.join(Mulberry::Directories.root, *args)
    end

    def mulberry_file_path(*args)
      Mulberry::Server.mulberry_file_path(*args);
    end

    def self.app_file_path(*args)
      File.join(TouraAPP::Directories.app, *args)
    end

    def app_file_path(*args)
      Mulberry::Server.app_file_path(*args);
    end

    #####################
    # Settings
    #####################

    disable :logging

    set :raise_errors => true
    set :root, app_file_path('.')
    set :views, TouraAPP::Templates.root
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

    get '/:os/:type/css/resources/*' do
      send_file File.join(
        @helper.theme_dir,
        'resources',
        params[:splat].first
      )
    end

    #####################
    # JavaScript
    #####################

    # dojo files have to come from the built js
    get '/:os/:type/javascript/dojo/*' do
      content_type 'text/javascript'
      send_file mulberry_file_path(
        'js_builds',
        @js_build_name,
        "dojo",
        params[:splat].first
      )
    end

    get '/:os/:type/javascript/dijit/*' do
      content_type 'text/javascript'
      send_file mulberry_file_path(
        "js_builds",
        @js_build_name,
        "dijit",
        params[:splat].first
      )
    end

    # nls (i18n) files have to come from the built js
    get '/:os/:type/javascript/toura/nls/*' do
      content_type 'text/javascript'
      nls_file = mulberry_file_path(
        "js_builds",
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

    get '/:os/:type/javascript/toura/AppConfig.js' do
      content_type 'text/javascript'
      device_type = params[:type] || 'phone'
      os = params[:os] || 'ios'

      config_settings = @helper.config_settings.merge(
        {
          "id" => Mulberry.escape_single_quote(@mulberry_app.id),
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
        res = Mulberry::Http.fetch(ota_url)
        status res.code
        res.body
      rescue Errno::ECONNREFUSED
        status 503 # unavailable
      end
    end

    get '/:os/:type/javascript/toura/app/DevConfig.js' do
      content_type 'text/javascript'

      dev_config = app_file_path(
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
      send_file app_file_path(
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
          ota_enabled = @helper.build ? @helper.build.ota_enabled? : false
          TouraAPP::Generators.data(Mulberry::Data.new(@mulberry_app).generate(ota_enabled))
        when 'pagedefs.js'
          TouraAPP::Generators.page_defs(@helper.page_defs)
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
      send_file app_file_path(
        "www",
        params[:splat].first
      )
    end
  end
end
