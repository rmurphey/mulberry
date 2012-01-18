$: << File.expand_path('../', __FILE__)
$: << File.expand_path('../..', __FILE__)

require 'rubygems'
require 'bundler/setup'
require 'yaml'
require 'json'
require 'fileutils'
require 'pathname'
require 'deep_merge'
require 'socket'
require 'timeout'
require 'uri'
require 'net/http'

require 'lib/toura_api'
require 'lib/http'
require 'lib/ota_service_application'

require 'cli/directories'
require 'cli/env'
require 'cli/data'
require 'cli/server'
require 'cli/build_helper'
require 'cli/code_creator'
require 'cli/content_creator'
require 'cli/page_def_creator'

require 'builder'

module Mulberry
  class ConfigError < RuntimeError
  end

  VERSION     = '0.3'
  CONFIG      = 'config.yml'
  CONFIG_DEV  = 'config_dev.yml'
  SITEMAP     = 'sitemap.yml'

  FEATURES    = {
    :reporting    =>    true
  }

  DEFAULTS  = {
    'locale'            =>  'en-US',
    'homeNodeId'        =>  'node-home',
    'aboutNodeId'       =>  'node-about',
    'sharingUrl'        =>  'http://toura.com',
    'sharingText'       =>  '${name}',
    'aboutEnabled'      =>  true
  }

  SUPPORTED_DEVICES = {
    'android' =>  [ 'phone' ],
    'ios'     =>  [ 'phone', 'tablet' ]
  }

  def self.version
    VERSION
  end

  def self.get_app_dir(dir = nil)
    dir ||= Dir.pwd
    dir = File.expand_path(dir)

    # when we're at the root, these will be equal
    until File.split(dir)[0] == File.split(dir)[1]
      return dir if dir_is_app?(dir)
      dir = File.split(dir)[0]
    end

    raise "You must run this command from inside a valid Mulberry app." unless dir_is_app?(dir)

    dir
  end

  def self.dir_is_app?(dir)
    dir ||= ''
    File.exists?(dir) && File.exists?(File.join(dir, 'config.yml'))
  end

  def self.escape_single_quote(str)
    str.gsub(/[']/,"\\\\'")
  end

  class App
    attr_reader         :name,
                        :theme,
                        :assets_dir,
                        :source_dir,
                        :helper,
                        :id,
                        :config

    def initialize(source_dir)
      @source_dir       = File.expand_path(source_dir)
      @assets_dir       = File.join(@source_dir, 'assets')
      @js_dir           = File.join(@source_dir, 'javascript')

      @config           = read_config

      raise ConfigError, "You must provide a name for your app" unless @config['name']

      @name             = @config['name']
      @theme            = @config['theme']['name']

      @helper           = Mulberry::BuildHelper.new(self)

      @config['id']   ||= @name
      @id               = @config['id']
    end

    def config
      @config ||= read_config
    end

    def self.update_themes(to_dir)
      mulberry_base = File.dirname(__FILE__)
      from_dir = File.join(mulberry_base, 'themes')

      theme_names = Dir.glob(File.join(from_dir, "**")).map{ |dir|
        File.basename(dir)
      }.join(", ")

      puts "This will overwrite the following themes: [#{theme_names}]. Are you sure? (Y/n)"
      input = STDIN.gets.strip

      if input == "Y"
        puts "Overwriting #{to_dir}/themes."
        FileUtils.cp_r(from_dir, to_dir)
      else
        puts "OK. Nothing to do."
      end

    end

    def self.scaffold(app_name, silent = false)
      raise "You must provide an app name" unless app_name

      mulberry_base = File.dirname(__FILE__)

      base = File.expand_path(app_name)

      if File.exists? base
        raise "Can't create #{base} -- it already exists"
      end

      FileUtils.mkdir_p base

      dirs = {
        :assets => [
          'data',
          'audios',
          'videos',
          'images',
          'feeds',
          'locations'
        ],

        :javascript => [
          'components',
          'stores',
          'models',
          'capabilities'
        ],

        :page_defs => [],
        :pages => []
      }

      dirs.each do |dir, subdirs|
        dir = File.join(base, dir.to_s)
        FileUtils.mkdir dir
        subdirs.each { |d| FileUtils.mkdir File.join(dir, d) }
      end

      Mulberry::CodeCreator.new('base', base, 'base')
      Mulberry::CodeCreator.new('routes', base, 'routes')

      asset_dirs = Dir.entries File.join(base, 'assets')

      [ 'audios', 'videos', 'images', 'locations' ].each do |asset_dir|
        FileUtils.mkdir_p File.join(base, 'assets', asset_dir, 'captions')
      end

      [ CONFIG, SITEMAP ].each do |tmpl|
        FileUtils.cp(File.join(mulberry_base, 'templates', tmpl), base)
      end

      original_config = File.read File.join(base, 'config.yml')
      original_config.gsub!(/^name:.?$/, "name: #{app_name}")

      File.open(File.join(base, 'config.yml'), 'w') do |f|
        f.write original_config
      end

      [ 'home.md', 'about.md' ].each do |page|
        FileUtils.cp(
          File.join(mulberry_base, 'templates', 'pages', page),
          File.join(base, 'pages')
        )
      end

      FileUtils.cp_r(File.join(mulberry_base, 'themes'), base)

      puts "Scaffolded an app at #{base}" unless silent
    end

    def serve(args)
      if server_running?(args[:port])
        puts "The Mulberry server is already running on port #{args[:port]}. Specify a different port with the -p flag."
        return
      end

      b = Builder::Build.new({
        :target => 'app_development',
        :log_level => -1,
        :force_js_build => false,
        :build_helper => @helper
      })

      b.build
      b.cleanup

      require 'webrick'

      Mulberry::Server.set :app, self

      webrick_options = {:Port => args[:port], :app => Mulberry::Server}

      unless args[:verbose]
        logger = ::WEBrick::Log.new
        logger.level = 0

        webrick_options.merge!({ :AccessLog => [nil, nil],
                                 :Logger    => logger
                              })
      end

      puts "== mulberry has taken the stage on port #{args[:port]}. ^C to quit."

      Rack::Server.start( webrick_options )
    end

    def device_build(settings = nil)
      settings ||= {}

      build({
        :target           => settings[:test] ? 'mulberry_test' : 'mulberry',
        :tour             => self,
        :tmp_dir          => tmp_dir,
        :log_level        => -1,
        :force_js_build   => settings[:force_js_build] ||= true,
        :skip_js_build    => settings[:skip_js_build]  ||= false,
        :build_helper     => @helper,
        :quiet            => (settings[:quiet] || false),
        :toura_api_config =>  @config['toura_api'],
        :publish_ota      =>  settings[:publish_ota]
      })
    end

    def www_build(settings = nil)
      settings ||= {}

      b = nil

      [ 'phone', 'tablet' ].each do |type|
        if supports_type?(type)
          b = Builder::Build.new({
            :target         => 'www',
            :tour           => self,
            :tmp_dir        => tmp_dir,
            :log_level      => -1,
            :force_js_build => settings[:force_js_build] ||= true,
            :skip_js_build  => settings[:skip_js_build]  ||= false,
            :build_helper   => @helper,
            :device_os      => 'ios',
            :device_type    => type
          })

          b.build
        end
      end

      builds_location = b.completed_steps[:close][:bundle][:location]
      puts "Build(s) are at #{builds_location}"

      b.cleanup
    end

    def data
      @helper.data
    end

    def ota_version
      version = ota_service_application.version
      puts "Current version is #{version}."
      version
    end

    def publish_ota(data_json=nil)
      unless data_json
        data_json = JSON.pretty_generate(Mulberry::Data.new(self).generate(true))
      end
      version = ota_service_application.publish data_json
      puts "OTA published successfully.  Version is #{version}."
      version
    end

    private
    def tmp_dir
      File.join(@source_dir, 'tmp')
    end

    def build(base_config)
      success = false
      msg = nil
      b = nil

      SUPPORTED_DEVICES.each do |os, types|
        types.each do |type|
          if supports_type?(type) && supports_os?(os)
            b = Builder::Build.new(base_config.merge({
              :device_type => type,
              :device_os   => os
            }))

            b.build
          end
        end
      end

      handle_publish_ota b

      if b
        builds = File.join(@source_dir, 'builds')
        Dir.mkdir(builds) unless File.exists? builds

        builds_location = b.completed_steps[:close][:bundle][:location]
        puts "Build(s) are at #{builds_location}"

        b.cleanup
      else
        puts "Tour does not support any device type"
      end
    end

    def supports_type?(type)
      @config['type'].include? type
    end

    def supports_os?(os)
      @config['os'].include? os
    end

    def read_config
      conf = DEFAULTS.merge YAML.load_file(File.join(@source_dir, CONFIG))

      dev_config_path = File.join(@source_dir, CONFIG_DEV)

      if File.exists?(dev_config_path)
        conf.deep_merge! YAML.load_file(dev_config_path)
      end

      conf
    end

    def server_running?(port)
      begin
        Timeout::timeout(1) do
          begin
            s = TCPSocket.new('localhost', port)
            s.close
            return true
          rescue Errno::ECONNREFUSED, Errno::EHOSTUNREACH
            return false
          end
        end
      rescue Timeout::Error
      end

      return false
    end

    def ota_service_application
      unless @ota_service_application
        @toura_api_config = @config['toura_api']
        if @toura_api_config
          url = @toura_api_config['url'] || TouraApi::URL
          key, secret = @toura_api_config['key'], @toura_api_config['secret']
          @ota_service_application = OtaServiceApplication.new(url, key, secret)
        end
      end
      @ota_service_application
    end

    def handle_publish_ota(build)
      if build.ota_enabled? || build.settings[:publish_ota]
        toura_api_config = build.settings[:toura_api_config]
        ota_service_application = OtaServiceApplication.new(toura_api_config['url'],
                                                            toura_api_config['key'],
                                                            toura_api_config['secret'])
        version = nil
        begin
          version = ota_service_application.version
        rescue Mulberry::Http::NotFound
        end
        data_report = build.completed_steps[:gather][:data]
        json = File.read data_report[:tour_json_location]
        if not version or build.settings[:publish_ota]
          version = ota_service_application.publish json
          puts "Published OTA version #{version}."
        end
      end
    end

  end
end
