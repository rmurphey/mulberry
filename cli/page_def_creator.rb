require 'active_support/inflector'

module Mulberry
  class PageDefCreator
    def initialize(code_type, destination_dir, filename)
      @filename = filename.dasherize
      @destination_dir = destination_dir
      @capability_name = "Page#{@filename.gsub('-', '_').camelize}"

      create_page_def_yaml
      create_capability
      create_page_def_scss
    end

    private
    def create_page_def_yaml
      page_def_dir = File.join(@destination_dir, 'page_defs')
      FileUtils.mkdir_p page_def_dir unless File.exists? page_def_dir

      page_def_filename = File.join(page_def_dir, "#{@filename}.yml")

      if File.exists? page_def_filename
        raise "Page definition #{page_def_filename} already exists"
      end

      page_def_template = File.read(File.join(Mulberry::Directories.templates, 'page_def.yml'))

      File.open(page_def_filename, 'w') do |f|
        f.write page_def_template.gsub('{{page_def_name}}', @filename).gsub('{{capability_name}}', @capability_name)
      end

      puts "Created page_def at #{page_def_filename}"
    end

    def create_page_def_scss
      theme = Mulberry::App.new(@destination_dir).theme
      theme_page_def_dir = File.join(@destination_dir, 'themes', theme, 'page_defs')

      scss_filename = File.join(theme_page_def_dir, "_#{@filename}.scss")
      theme_page_def_base_filename = File.join(theme_page_def_dir, '_base.scss')

      page_def_scss_tpl = File.read(File.join(Mulberry::Directories.templates, 'code', 'page_def.scss'))

      if File.exists? scss_filename
        raise "Page definition scss #{scss_filename} already exists"
      end

      File.open(scss_filename, 'w') do |f|
        f.write page_def_scss_tpl.gsub('{{page_def_name}}', @filename)
      end

      puts "Created page_def scss at #{scss_filename}"

      File.open(theme_page_def_base_filename, 'a') do |f|
        f.write "@import '#{@filename}';\n"
      end

      puts "Added @import directive to #{theme_page_def_base_filename}"
    end

    def create_capability
      Mulberry::CodeCreator.new('capability', @destination_dir, @capability_name)
    end

  end
end
