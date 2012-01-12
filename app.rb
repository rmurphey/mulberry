require 'rubygems'
require 'haml'
require 'yaml'
require 'mustache'

module TouraAPP
  def self.version
    '4.1.0'
  end

  def self.dojo_version
    '1.6.0'
  end

  class Directories
    def self.root
      @root ||= File.expand_path(File.dirname(__FILE__))
    end

    def self.app
      File.join(@root, 'app')
    end

    def self.javascript
      self.app
    end

    def self.page_defs
      File.join(self.root, 'base_apps', 'toura', 'page_defs')
    end

    def self.data_fixtures
      File.join(self.app, 'data-fixtures')
    end

    def self.profiles
      File.join(self.root, 'builder', 'profiles')
    end

    def self.build_root
      File.join(self.app, 'tmp', 'build')
    end

    def self.dojo
      File.join(self.javascript, "dojo-release-#{TouraAPP.dojo_version}-src")
    end
  end

  class Templates
    def self.root
      @root ||= File.join(TouraAPP::Directories.root, 'cli', 'templates', 'app')
    end

    def self.index_html
      File.join(self.root, 'index.html.haml')
    end

    def self.config
      File.join(self.root, 'TouraConfig.js.mustache')
    end
  end

  class Generators
    def self.page_defs(page_defs)
      "toura.pagedefs = #{JSON.pretty_generate(page_defs)};"
    end

    def self.index_html(params = {})
      obj = Object.new
      tmpl = File.read(TouraAPP::Templates.index_html)
      haml = Haml::Engine.new(tmpl, :attr_wrapper => '"')

      haml.def_method(obj, :render, *params.keys)
      obj.render(params)
    end

    def self.config(os, device_type, binding = {})
      tmpl = File.read(TouraAPP::Templates.config)

      defaults = {
        'id'                  =>  12345,
        'build_date'          =>  Time.now.to_i.to_s,
        'force_streaming'     =>  false,
        'force_local'         =>  false,
        'skip_version_check'  =>  false,
        'local_data_url'      =>  false,
        'app_version'         =>  TouraAPP::version,
        'os'                  =>  os,
        'device_type'         =>  device_type,
        'debug'               =>  false,
        'force_local'         =>  false
      }

      settings = defaults.merge(binding)

      Mustache.render(tmpl, settings)
    end

    def self.data(data_object)
      "toura.data.local = #{JSON.pretty_generate(data_object)};"
    end
  end
end

# Setup load paths
$: << TouraAPP::Directories.root
$: << File.join(TouraAPP::Directories.root, 'lib')
