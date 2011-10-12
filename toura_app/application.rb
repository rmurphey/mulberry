require 'haml'
require 'yaml'
require 'mustache'

# Project-wide settings in ruby
class TouraAPP
  def self.root
    @root ||= File.expand_path(File.dirname(__FILE__))
  end

  def self.deploy_root
    File.dirname(__FILE__)
  end

  def self.templates_dir
    "templates"
  end

  class Test
    def self.fixtures
      File.join(TouraAPP.root, 'javascript', 'data-fixtures')
    end

    def self.app
      File.join(TouraAPP.root, 'javascript', 'toura', 'app')
    end

    # Defined in browser_testing_profile js file, so we can't easily interrogate it
    def self.browser_test
      File.join(TouraAPP.root, 'javascript', 'browserTesting')
    end
  end

  def self.version
    '3.0'
  end

  class App
    def self.vars_scss_template
      File.join(TouraAPP.root, 'templates', 'vars.scss')
    end

    def self.base_scss
      File.join(TouraAPP.root, 'javascript', 'base.scss')
    end

    def self.js_dir
      File.join(TouraAPP.root, 'javascript')
    end

    def self.client_customizations_dir(tour_id=nil)
      tour_id = nil if tour_id.respond_to?(:empty?) ? tour_id.empty? : !tour_id
      File.join(TouraAPP.root, 'javascript', 'client_customizations', (tour_id ? "tour-#{tour_id}" : ''))
    end

    def self.deploy_client_customizations_dir
      File.join(TouraAPP.deploy_root, 'javascript', 'client_customizations')
    end

    def self.dojo_version
      '1.6.0'
    end

    def self.page_templates_dir
      File.join(TouraAPP.root, 'javascript', 'page-templates')
    end

    def self.create_config(os, device_type, binding={})
      tmpl = File.read(File.join(TouraAPP.root, 'templates', 'TouraConfig.js.mustache'))

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

    def self.generate_index_html(params = {})
      obj = Object.new
      template = File.read(File.join(TouraAPP.root, 'templates', 'index.html.haml'))
      haml = Haml::Engine.new(template, :attr_wrapper => '"')
      haml.def_method(obj, :render, *params.keys)
      obj.render(params)
    end

    def self.generate_page_templates(build_templates = nil)
      base_templates = {}

      Dir.entries(TouraAPP::App.page_templates_dir).each do |t|
        base_templates.merge! YAML.load_file(File.join(TouraAPP::App.page_templates_dir, t)) unless !t.match /\.yml$/
      end

      base_templates.merge!(build_templates) if build_templates

      "toura.templates = #{JSON.pretty_generate(base_templates)};"
    end
  end

  class Build
    def self.root
      ENV['BUILD_PATH'] || File.join(TouraAPP.root, 'tmp', 'build')
    end

    def self.javascript
      File.join(TouraAPP::Build.root, 'javascript')
    end

    def self.escape_quotes_for_system_call(s)
      # These will have single quotes in em, and bash doesn't escape in a string
      # We need to convert 'This ain't fun' ==> 'This ain'\''t fun'
      safe_tour_name = s.gsub( "'", "'\\\\''" )
    end
  end
end

# Setup load paths
$: << TouraAPP.root
$: << File.join(TouraAPP.root, 'lib')
