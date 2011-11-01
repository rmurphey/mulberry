require 'rubygems'
require 'haml'
require 'yaml'
require 'mustache'

# Project-wide settings in ruby
class TouraAPP
  def self.version
    '3.0.4'
  end

  def self.root
    @root ||= File.expand_path(File.dirname(__FILE__))
  end

  class App
    def self.vars_scss_template
      File.join(TouraAPP.root, 'templates', 'vars.scss')
    end

    def self.base_scss
      File.join(TouraAPP.root, 'javascript', 'base.scss')
    end

    def self.client_customizations_dir(tour_id=nil)
      tour_id = nil if tour_id.respond_to?(:empty?) ? tour_id.empty? : !tour_id
      File.join(TouraAPP.root, 'javascript', 'client_customizations', (tour_id ? "tour-#{tour_id}" : ''))
    end

    def self.dojo_version
      '1.6.0'
    end
  end
end

module Mulberry
  class TouraAPP
    class Directories
      def self.root
        @root = File.expand_path(File.dirname(__FILE__))
      end

      def self.javascript
        File.join(self.root, 'javascript')
      end

      def self.page_templates
        File.join(self.javascript, 'page-templates')
      end

      def self.data_fixtures
        File.join(self.javascript, 'data-fixtures')
      end

      def self.build_root
        File.join(self.root, 'tmp', 'build')
      end
    end

    class Templates
      def self.root
        @root = File.join(Mulberry::TouraAPP::Directories.root, 'templates')
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
        page_templates_dir = Mulberry::TouraAPP::Directories.page_templates

        Dir.entries(page_templates_dir).each do |t|
          base_templates.merge! YAML.load_file(File.join(page_templates_dir, t)) unless !t.match /\.yml$/
        end

        base_templates.merge!(app_templates) if app_templates

        "toura.templates = #{JSON.pretty_generate(base_templates)};"
      end

      def self.index_html(params = {})
        obj = Object.new
        tmpl = File.read(Mulberry::TouraAPP::Templates.index_html)
        haml = Haml::Engine.new(tmpl, :attr_wrapper => '"')

        haml.def_method(obj, :render, *params.keys)
        obj.render(params)
      end

      def self.config(os, device_type, binding = {})
        tmpl = File.read(Mulberry::TouraPP::Templates.config)

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
end

# Setup load paths
$: << TouraAPP.root
$: << File.join(TouraAPP.root, 'lib')
