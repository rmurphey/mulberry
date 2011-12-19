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
      @root ||= File.join(File.expand_path(File.dirname(__FILE__)))
    end

    def self.javascript
      File.join(self.root, 'toura_app', 'javascript')
    end

    def self.page_templates
      File.join(self.javascript, 'page-templates')
    end

    def self.data_fixtures
      File.join(self.javascript, 'data-fixtures')
    end

    def self.profiles
      File.join(self.root, 'toura_app', 'profiles')
    end

    def self.build_root
      File.join(self.root, 'toura_app', 'tmp', 'build')
    end

    def self.app_specs
      File.join(self.root, 'toura_app', 'spec')
    end

    # TODO: remove this?
    def self.client_customizations(tour_id=nil)
      tour_id = nil if tour_id.respond_to?(:empty?) ? tour_id.empty? : !tour_id
      File.join(self.javascript, 'client_customizations', (tour_id ? "tour-#{tour_id}" : ''))
    end
  end

  class Templates
    def self.root
      @root ||= File.join(File.expand_path(File.dirname(__FILE__)), 'cli', 'templates', 'app')
    end

    def self.index_html
      File.join(self.root, 'index.html.haml')
    end

    def self.config
      File.join(self.root, 'TouraConfig.js.mustache')
    end
  end

  class Generators
    def self.page_templates(app_templates = nil)
      base_templates = {}
      page_templates_dir = TouraAPP::Directories.page_templates

      Dir.glob(File.join(page_templates_dir, '*.yml')).each do |t|
        base_templates.merge! YAML.load_file(t)
      end

      base_templates.merge!(app_templates) if app_templates
      base_templates
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

  end
end

# Setup load paths
$: << TouraAPP::Directories.root
$: << File.join(TouraAPP::Directories.root, 'lib')
