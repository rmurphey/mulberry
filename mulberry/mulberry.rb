$: << File.expand_path('../', __FILE__)
$: << File.expand_path('../..', __FILE__)

require 'rubygems'
require 'bundler/setup'
require 'yaml'
require 'json'
require 'fileutils'
require 'pathname'
require 'rbconfig'
require 'deep_merge'
require 'uri'
require 'net/http'

require 'mulberry/data'
require 'mulberry/server'
require 'mulberry/build_helper'
require 'mulberry/code_creator'
require 'mulberry/http'

require 'lib/builder'

module Mulberry
  class ConfigError < RuntimeError
  end

  VERSION     = '0.2'
  CONFIG      = 'config.yml'
  CONFIG_DEV  = 'config_dev.yml'
  SITEMAP     = 'sitemap.yml'

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
    raise "You must run this command from inside a valid Mulberry app." unless dir_is_app?(dir)
    dir
  end

  def self.dir_is_app?(dir)
    dir ||= ''
    File.exists?(dir) && File.exists?(File.join(dir, 'config.yml'))
  end

  class Env
    def self.host_os
      case Config::CONFIG['host_os']
        when /mswin|windows/i
          :windows
        when /linux/i
          :linux
        when /darwin/i
          :macos
        else
          :unknown
      end
    end
  end

  class Directories
    def self.root
      find_root_with_flag
    end

    def self.templates
      File.join(root, 'mulberry', 'templates')
    end

    private
    # Taken from http://apidock.com/rails/Rails/Engine/find_root_with_flag
    def self.find_root_with_flag(flag = 'LICENSE.txt', default=nil)
      root_path = File.expand_path(File.dirname(__FILE__))

      # Minor change here: the tests will actually create a path that is wrong since __FILE__
      # is relative to the including file, e.g. /Users/mattrogish/src/mulberry/testapp/mulberry/mulberry.rb"
      # so we go up a dir by checking the parent, File.directory?(File.dirname(root_path)) => /Users/mattrogish/src/mulberry/testapp/
      while root_path && (File.directory?(root_path) || File.directory?(File.dirname(root_path)) ) && !File.exist?("#{root_path}/#{flag}")
        parent = File.dirname(root_path)
        root_path = parent != root_path && parent
      end

      root = File.exist?(File.join(root_path, flag)) ? root_path : default
      raise "Could not find root path for #{self}" unless root

      Mulberry::Env.host_os == :windows ? Pathname.new(root).expand_path : Pathname.new(root).realpath
    end
  end


  class App
    attr_reader         :name,
                        :theme,
                        :assets_dir,
                        :source_dir,
                        :helper,
                        :id

    def initialize(source_dir)
      @source_dir       = File.expand_path(source_dir)
      @assets_dir       = File.join(@source_dir, 'assets')
      @js_dir           = File.join(@source_dir, 'javascript')

      @config           = read_config

      raise ConfigError, "You must provide a name for your app" unless @config['name']

      @name             = @config['name'].gsub(/'/, "\\\\'")
      @theme            = @config['theme']['name']

      @helper           = Mulberry::BuildHelper.new(self)

      @config['id']   ||= @name
      @id               = @config['id']
    end

    def config
      read_config
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
          'components'
        ],

        :templates => [],
        :pages => []
      }

      dirs.each do |dir, subdirs|
        dir = File.join(base, dir.to_s)
        FileUtils.mkdir dir
        subdirs.each { |d| FileUtils.mkdir File.join(dir, d) }
      end

      Mulberry::CodeCreator.new('base', base, 'base')

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
      b = Builder::Build.new({
        :target => 'app_development',
        :log_level => -1,
        :force_js_build => false
      })

      b.build
      b.cleanup

      require 'webrick'

      webrick_options = {:Port => args[:port]}

      webrick_options.merge!({ :AccessLog => [nil, nil],
                               :Logger    => ::WEBrick::Log.new("/dev/null")
                            }) unless args[:verbose]
      @helper.build = b
      Mulberry::Server.set :app, self

      Rack::Handler::WEBrick.run Mulberry::Server, webrick_options do |server|
        [:INT, :TERM].each { |sig| trap(sig) { server.stop } }
        Mulberry::Server.set :running, true
        puts "== mulberry has taken the stage on port #{args[:port]}. ^C to quit."
      end

    end

    def device_build(settings = {})
      build({
        :target           =>  settings[:test] ? 'mulberry_test' : 'mulberry',
        :tour             =>  self,
        :tmp_dir          =>  tmp_dir,
        :log_level        =>  -1,
        :force_js_build   =>  true,
        :skip_js_build    =>  settings[:skip_js_build],
        :build_helper     =>  @helper
      })
    end

    def www_build(settings = {})
      b = nil

      [ 'phone', 'tablet' ].each do |type|
        if supports_type?(type)
          b = Builder::Build.new({
            :target           =>  'www',
            :tour             =>  self,
            :tmp_dir          =>  tmp_dir,
            :log_level        =>  -1,
            :force_js_build   =>  true,
            :build_helper     =>  @helper,
            :device_os        =>  'ios',
            :device_type      =>  type
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

    def publish_ota(data_json)
      host = @config['toura_api']['host'] || 'api.toura.com'
      key, secret = @config['toura_api']['key'], @config['toura_api']['secret']
      unless data_json
        data_json = JSON.pretty_generate(Mulberry::Data.new(self).generate(true))
      end
      uri = URI("http://#{host}/applications/#{key}/ota_service/publish")
      res = Http.wrap Mulberry::Http::ConnectionRefused => "Can't connect to ota server: #{host}.",
                      "404" => "Application with key #{key} not found on #{host}.",
                      "503" => "#{host} currently unavailable.  Please try again later.",
                      "default" => lambda { |res|
                        "Problem publishing OTA. Response (#{res.code}): #{res.body}"
                      } do
        Net::HTTP.post_form(uri, 'secret' => secret, 'data_json' => data_json, 'format' => 'json')
      end
      puts "OTA published successfully.  Version is #{JSON.parse(res.body)['version']}."
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
              :device_type  => type,
              :device_os    =>  os
            }))

            b.build
          end
        end
      end

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
      DEFAULTS.merge! YAML.load_file(File.join(@source_dir, CONFIG))

      dev_config_path = File.join(@source_dir, CONFIG_DEV)

      if File.exists?(dev_config_path)
        DEFAULTS.deep_merge! YAML.load_file(dev_config_path)
      end

      DEFAULTS
    end

  end
end
