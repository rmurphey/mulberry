require 'toura_app/application'
require 'builder/build_helper'

# WARNING: This file is for internal Toura development needs and it will go
# away eventually.

module Builder
  class FilesystemBuildHelper
    include BuildHelper

    attr_reader :id, :name, :db_version, :version_json_url, :data_json_url

    def initialize(settings)
      @id = settings[:tour_id] || 72
      @name = settings[:name] || 'A Tour From the Filesystem'
      @db_version = settings[:db_version] || Time.now.to_i
      @data_json_url = settings[:data_json_url] || 'nonexistent'
      @version_json_url = settings[:version_json_url] || 'nonexistent'
    end

    def after_steps() end

    def before_steps() end

    def project_settings
      {
        :id           =>  @id,
        :version      =>  @db_version,
        :name         =>  @name,
        :bundle       =>  TouraAPP::Build.root,
        :config_dir   =>  File.join(TouraAPP::Build.root, 'config', 'builds')
      }
    end

    def config_settings
      {
        'id'                  =>  @id,
        'update_url'          =>  @data_json_url,
        'version_url'         =>  @version_json_url
      }
    end

    def icons(destination, report)
      false
    end

    def load_screens(destination, report)
      false
    end

    def assets(destination, report)
      false
    end

    def data
      client_custom = File.join(
        TouraAPP::App.client_customizations_dir(@id),
        'data',
        'tour.js'
      )

      data_file = (File.exists?(client_custom)) ?
        client_custom :
        File.join(TouraAPP.root, 'javascript', 'data-fixtures', 'tour.js')

      JSON.parse(File.read(data_file).
        gsub('toura.data.local = ', '').
        gsub(/\};$/, '}'))
    end

    def css(destination, report)
      begin
        custom_dir = File.join(
          TouraAPP::App.client_customizations_dir(@id),
          'sass'
        )

        vars_path = File.join(custom_dir, 'vars.scss')
        custom_base_path = File.join(custom_dir, 'base.scss')

       css = Builder::CSSMaker.new(
          :vars_path => (File.exists? vars_path) ?
            vars_path :
            File.join(TouraAPP::Test.fixtures, 'client_customizations', 'vars.scss'),
          :toura_base_path => TouraAPP::App.base_scss,
          :custom_base_path => (custom_base_path if File.exists? custom_base_path),
          :load_paths => [ TouraAPP::App.js_dir, custom_dir ]
        ).render
        File.open(destination, 'w') { |f| f.write css }
      rescue Sass::SyntaxError => err
        puts err.to_s
      end
    end

    def app_id(device_os, device_type)
      case device_os
      when 'android'
        "com.toura.app2_#{project_settings[:id]}"
      when 'ios'
        type = {
          :phone => 'iphone',
          :tablet => 'ipad'
        }
        "com.toura.app2.#{padded_id}.#{type[device_type.to_sym]}"
      end
    end
  end
end
