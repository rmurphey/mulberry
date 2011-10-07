require 'rubygems'
require 'sinatra/base'

require 'toura_app/lib/builder/css_maker'
require 'toura_app/application'

module Mulberry
  class Server < Sinatra::Base

    def initialize
      super

      @app = settings.app
      @helper = @app.helper

      @index_template = 'index.html'.to_sym
      @iframe_template = 'iframe.html'.to_sym
      @source_dir = app.source_dir
      @js_build_name = 'dev'
    end

    private

    #####################
    # Helpers
    #####################
    def self.file_path(*args)
      File.join(File.dirname(__FILE__), '..', 'toura_app', *args)
    end

    def file_path(*args)
      Mulberry::Server.file_path(*args);
    end

    #####################
    # Settings
    #####################

    # disable :logging

    set :raise_errors => true
    set :root, file_path('.')
    set :public, file_path('www')
    set :views, file_path('templates')
    set :host, 'localhost'
    set :port, '3001'

    #####################
    # Tours
    #####################
    get '/' do
      haml @index_template, :locals => {
        :body_onload        => "readyFn()",
        :include_jquery     => @app.config['jQuery'] || @app.config['jquery'],
        :include_dev_config => true,
        :device_type        => params[:device_type] || 'phone'
      }
    end

    get '/develop.html' do
      haml @iframe_template
    end

    #####################
    # CSS
    #####################
    get '/css/base.css' do
      content_type 'text/css'
      @helper.create_css
    end

    #####################
    # JavaScript
    #####################

    # dojo files have to come from the built js
    get '/javascript/dojo/*' do
      content_type 'text/javascript'
      send_file file_path(
        "javascript",
        @js_build_name,
        "dojo",
        params[:splat].first
      )
    end

    get '/javascript/dijit/*' do
      content_type 'text/javascript'
      send_file file_path(
        "javascript",
        @js_build_name,
        "dijit",
        params[:splat].first
      )
    end

    # nls (i18n) files have to come from the built js
    get '/javascript/toura/nls/*' do
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

    get '/javascript/toura/app/TouraConfig.js' do
      content_type 'text/javascript'
      device_type = params[:device_type] || 'phone'

      TouraAPP::App.create_config 'ios', device_type,
        {
          "id" => @app.id,
          "build" => Time.now.to_i,
          "force_local" => true,
          "skip_version_check" => true,
          'debug' => true
        }
    end

    get '/javascript/toura/app/DevConfig.js' do
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

    get '/javascript/client/*' do
      content_type 'text/javascript'
      send_file File.join(
        @source_dir,
        'javascript',
        params[:splat].first
      )
    end

    get '/javascript/*' do
      content_type 'text/javascript'
      send_file file_path(
        "javascript",
        params[:splat].first
      )
    end

    #####################
    # Data
    #####################
    get '/data/*' do
      content_type "text/javascript"

      case params[:splat].first
      when 'tour.js'
        @helper.create_data
      when 'templates.js'
        TouraAPP::App.generate_page_templates(@helper.templates)
      end
    end

    #####################
    # Media
    #####################
    get '/media/manifest.js' do
      "toura.app.manifest = {};"
    end

    get '/media/*' do
      send_file File.join(
        @source_dir,
        "assets",
        params[:splat].first
      )
    end

    #####################
    # Resources
    #####################
    get '/*' do
      send_file file_path(
        "www",
        params[:splat].first
      )
    end
  end
end
