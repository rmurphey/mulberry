$: << File.expand_path('../', __FILE__)
$: << File.expand_path('../..', __FILE__)

require 'rubygems'
require 'bundler/setup'
require 'yaml'
require 'json'
require 'fileutils'

require 'mulberry/data'
require 'mulberry/server'
require 'mulberry/build_helper'
require 'lib/builder'

module Mulberry
  class ConfigError < RuntimeError
  end

  VERSION   = '0.1'
  CONFIG    = 'config.yml'

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

  class App
    attr_reader         :name,
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

      @helper           = Mulberry::BuildHelper.new(self)

      @config['id']   ||= @name
      @id               = @config['id']
    end

    def config
      read_config
    end

    def self.scaffold(app_name, silent = false)
      raise "You must provide an app name" unless app_name

      mulberry_base = File.dirname(__FILE__)
      puts File.read File.join(mulberry_base, 'LICENSE.txt') unless silent

      base = File.expand_path(app_name)

      if File.exists? base
        raise "Can't create #{base} -- it already exists"
      end

      FileUtils.mkdir base

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

      asset_dirs = Dir.entries File.join(base, 'assets')

      [ 'audios', 'videos', 'images', 'locations' ].each do |asset_dir|
        FileUtils.mkdir_p File.join(base, 'assets', asset_dir, 'captions')
      end

      [ 'config.yml', 'sitemap.yml' ].each do |tmpl|
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

    def serve
      b = Builder::Build.new({
        :target => 'app_development',
        :log_level => -1,
        :force_js_build => false
      })

      b.build
      b.cleanup

      Mulberry::Server.run! :app => self
    end

    def generate(settings = {})
      tmp_dir = File.join(@source_dir, 'tmp')
      success = false
      msg = nil
      b = nil

      base_config = {
        :target           =>  settings[:test] ? 'mulberry_test' : 'mulberry',
        :tour             =>  self,
        :tmp_dir          =>  tmp_dir,
        :log_level        =>  -1,
        :force_js_build   =>  true,
        :build_helper     =>  @helper
      }

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

    def data
      @helper.data
    end

    private
    def supports_type?(type)
      @config['type'].include? type
    end

    def supports_os?(os)
      @config['os'].include? os
    end

    def read_config
      DEFAULTS.merge! YAML.load_file(File.join(@source_dir, CONFIG))
    end
  end
end
