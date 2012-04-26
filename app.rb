require 'rubygems'
require 'haml'
require 'yaml'
require 'mustache'

module Mulberry
  module Framework
    def self.version
      '4.1.1'
    end

    def self.dojo_version
      '1.6.0'
    end

    class Directories
      def self.root
        @root ||= File.expand_path(File.dirname(__FILE__))
      end

      def self.app
        File.join(self.root, 'app')
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

      def self.js_builds
        File.join(self.root, 'js_builds')
      end

      def self.dojo
        File.join(self.app, "dojo-release-#{Mulberry::Framework.dojo_version}-src")
      end

      def self.project_templates
        File.join(self.root, 'builder', 'project_templates')
      end

      def self.cli
        File.join(self.root, 'cli')
      end

      def self.templates
        File.join(self.cli, 'templates')
      end
    end

    class Templates
      def self.root
        @root ||= File.join(Mulberry::Framework::Directories.root, 'cli', 'templates', 'app')
      end

      def self.index_html
        File.join(self.root, 'index.html.haml')
      end

      def self.config
        File.join(self.root, 'AppConfig.js.mustache')
      end
    end

    class Generators
      def self.page_defs(page_defs)
        str = ''

        page_defs.each do |page_def_name, config|
          str << "mulberry.pageDef('#{page_def_name}', #{JSON.pretty_generate(config)});\n\n"
        end

        str
      end

      def self.index_html(params = {})
        obj = Object.new
        tmpl = File.read(Mulberry::Framework::Templates.index_html)
        haml = Haml::Engine.new(tmpl, :attr_wrapper => '"')

        haml.def_method(obj, :render, *params.keys)
        obj.render(params)
      end

      def self.config(os, device_type, binding = {})
        tmpl = File.read(Mulberry::Framework::Templates.config)

        defaults = {
          'id'                      =>  12345,
          'build_date'              =>  Time.now.to_i.to_s,
          'force_streaming'         =>  false,
          'force_local'             =>  false,
          'skip_version_check'      =>  false,
          'app_version'             =>  Mulberry::Framework::version,
          'debug'                   =>  false,
          'force_local'             =>  false,
          'postscript'              =>  '',
          'locale'                  =>  'en-us',
          'ads'                     =>  false,
          'sibling_nav'             =>  true,
          'sharing'                 =>  true,
          'favorites'               =>  true,
          'font_size'               =>  true,
          'multi_line_child_nodes'  =>  false,
          'debug_page'              =>  true,
          'environment'             =>  'production'
        }

        settings = defaults.merge(binding)

        base_config = {
          'id'                  =>  settings['id'],
          'locale'              =>  settings['locale'],
          'buildDate'           =>  settings['build_date'],
          'appVersion'          =>  settings['app_version'],
          'updateUrl'           =>  settings['update_url'],
          'versionUrl'          =>  settings['version_url'],
        }

        unless os.nil? or device_type.nil?
          # only set device config if values were provided
          base_config['device'] = {
            'type'              =>  device_type,
            'os'                =>  os
          }
        end

        settings['base_config'] = JSON.pretty_generate(base_config)

        Mustache.render(tmpl, settings)
      end

      def self.data(data_object)
        "toura.data.local = #{JSON.pretty_generate(data_object)};"
      end
    end
  end
end

# Setup load paths
$: << Mulberry::Framework::Directories.root
$: << File.join(Mulberry::Framework::Directories.root, 'lib')
