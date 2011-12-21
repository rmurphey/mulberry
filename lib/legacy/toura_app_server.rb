require 'sinatra/base'
require 'builder/css_maker'
require 'app'

# WARNING: This file is for Toura internal use and will be removed.

class TouraAPPServer < Sinatra::Base

  def initialize
    super

    @default_tour = 'dev'
    @js_build_name = 'dev'
    @index_template = 'index.html'.to_sym
  end

  private

  #####################
  # Helpers
  #####################
  def self.file_path(*args)
    File.join(File.dirname(__FILE__), '..', *args)
  end

  def file_path(*args)
    TouraAPPServer.file_path(*args);
  end

  def custom_dir(tour_id)
    TouraAPP::Directories.client_customizations(tour_id)
  end

  #####################
  # Settings
  #####################

  disable :logging

  set :raise_errors => true
  set :root, file_path('.')
  set :public_folder, file_path('www')
  set :views, file_path('templates')

  #####################
  # Tours
  #####################
  get '/' do
    redirect "/ios/phone/tours/#{@default_tour}/"
  end

  get '/:os/:device_type/tours/:tour_id/' do
    haml @index_template, :locals => {
      :body_onload        => "readyFn()",
      :include_dev_config => true,
      :device_type        => params[:device_type]
    }
  end

  #####################
  # CSS
  #####################
  get '/:os/:device_type/tours/:tour_id/css/base.css' do
    content_type 'text/css'

    tour_id = params[:tour_id]
    theme_dir = File.join(custom_dir(tour_id), "sass")
    vars_path = File.join(theme_dir, "vars.scss")

    if !File.exists? vars_path
      vars_path = File.join(
        TouraAPP::Directories.data_fixtures,
        'client_customizations',
        'vars.scss'
      )
    end


    begin
      Builder::CSSMaker.new(
        :vars_path => vars_path,
        :theme_dir => theme_dir
      ).render
    rescue Sass::SyntaxError => err
      puts err.to_s
    end
  end

  #####################
  # JavaScript
  #####################
  get '/:os/:device_type/tours/:tour_id/javascript/client/*' do
    send_file File.join(
      custom_dir(params[:tour_id]),
      "javascript",
      "client",
      params[:splat].first
    )
  end

  # dojo files have to come from the built js
  get '/:os/:device_type/tours/:tour_id/javascript/dojo/*' do
    send_file file_path(
      '..',
      "js_builds",
      @js_build_name,
      "dojo",
      params[:splat].first
    )
  end

  get '/:os/:device_type/tours/:tour_id/javascript/dijit/*' do
    send_file file_path(
      '..',
      "js_builds",
      @js_build_name,
      "dijit",
      params[:splat].first
    )
  end

  # nls (i18n) files have to come from the built js
  get '/:os/:device_type/tours/:tour_id/javascript/toura/nls/*' do
    send_file file_path(
      '..',
      "js_builds",
      @js_build_name,
      "toura",
      "nls",
      params[:splat].first
    )
  end


  # re-route TouraConfig request to tour-specific file
  get '/:os/:device_type/tours/:tour_id/javascript/toura/app/TouraConfig.js' do
    content_type 'text/javascript'

    TouraAPP::Generators.config params[:os], params[:device_type], {
      "id"                  =>  params[:tour_id],
      "build"               =>  Time.now.to_i,
      "force_streaming"     =>  false,
      "skip_version_check"  =>  false,
      "debug"               =>  true
    }
  end

  get '/:os/:device_type/tours/:tour_id/javascript/*' do
    send_file file_path(
      "javascript",
      params[:splat].first
    )
  end

  #####################
  # Data
  #####################
  get '/:os/:device_type/tours/:tour_id/data/templates.js' do
    content_type "text/javascript"
    "toura.templates = #{JSON.pretty_generate(TouraAPP::Generators.page_templates)};"
  end

  get '/:os/:device_type/tours/:tour_id/data/*' do
    content_type "text/javascript"

    custom_file = File.join(
      custom_dir(params[:tour_id]),
      "data",
      params[:splat].first
    )

    if !File.exists?(custom_file)
      custom_file = "#{custom_file}.jet"
    end

    if File.exists?(custom_file)
      send_file custom_file
    else
      send_file file_path(
        "javascript",
        "data-fixtures",
        params[:splat].first
      )
    end
  end

  #####################
  # Media
  #####################
  get '/:os/:device_type/tours/:tour_id/media/manifest.js' do
    manifest_file = File.join(
      custom_dir(params[:tour_id]),
      "media",
      "manifest.js"
    )

    if File.exists? manifest_file
      send_file manifest_file
    else
      content_type "text/javascript"
      "toura.app.manifest = {};"
    end
  end

  get '/:os/:device_type/tours/:tour_id/media/*' do
    send_file File.join(
      custom_dir(params[:tour_id]),
      "media",
      params[:splat].first
    )
  end

  #####################
  # Resources
  #####################
  get '/:os/:device_type/tours/:tour_id/map/*' do
    # app dev only; should be eliminated
    send_file file_path(
      'javascript',
      'data-fixtures',
      params[:splat].first
    )
  end

  get '/:os/:device_type/tours/:tour_id/*' do
    send_file file_path(
      "www",
      params[:splat].first
    )
  end
end
