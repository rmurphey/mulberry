require 'active_support/inflector'
require 'pathname'

module Mulberry
  class CodeCreator
    DIRNAMES = {
      'component'   =>  'components',
      'capability'  =>  'capabilities',
      'store'       =>  'stores',
      'model'       =>  'models',
      'base'        =>  '.',
      'routes'      =>  '.',
      'route'       =>  '.'
    }

    def initialize(code_type, destination_dir, filename)
      code_type = code_type.to_s
      raise "Don't know how to create code type #{code_type}" unless DIRNAMES[code_type]

      @destination_dir      = destination_dir
      @code_type            = code_type
      @filename             = filename
      @js_dir               = File.join(@destination_dir, 'javascript')
      @code_dir             = File.join(@js_dir, DIRNAMES[@code_type])
      @code_templates_dir   = File.join(Mulberry::Directories.templates, 'code')

      template = File.read(File.join(@code_templates_dir, "#{@code_type}.js"))
      code_filename = File.join(@code_dir, "#{@filename}.js")

      if File.exists? code_filename
        raise "The file #{code_filename} already exists"
      end

      FileUtils.mkdir_p(@code_dir) unless File.exists?(@code_dir)

      if @code_type == 'route'
        path_matcher = @filename
        routes_file = File.join(@js_dir, 'routes.js')

        # routes just get added to the routes file
        File.open(routes_file, 'a') do |f|
          f.write "\n"
          f.write template.gsub('{{path_matcher}}', path_matcher)
          f.write "\n"
        end

        puts "Added route #{path_matcher} to #{routes_file}"
      else
        # add the dependency
        File.open(File.join(@js_dir, 'base.js'), 'a') do |f|
          f.write "dojo.require('#{js_dependency_path}');\n"
        end unless @code_type == 'base'

        # write the basic file for the requested code
        File.open(File.join(@code_dir, "#{@filename}.js"), 'w') do |f|
          f.write template.gsub('{{name}}', @filename)
        end

        puts "Created #{@code_type} at #{code_filename}"
      end


      if @code_type === 'component'
        create_component_files
      end
    end

    private
    def js_dependency_path
      path = [ 'client' ]
      dir = DIRNAMES[@code_type]
      path << dir unless dir == '.'
      path << @filename
      path.join('.')
    end

    def create_component_files
      theme_cssfile = "base.scss"

      # create the resource dir for the component
      component_resource_dir = File.join(@code_dir, @filename)
      FileUtils.mkdir_p(component_resource_dir) unless File.exists? component_resource_dir

      # get file templates
      haml_template = File.read(File.join(@code_templates_dir, "#{@code_type}.haml"))
      scss_template = File.read(File.join(@code_templates_dir, "#{@code_type}.scss"))

      # create the basic haml template for the component
      File.open(File.join(component_resource_dir, "#{@filename}.haml"), 'w') do |f|
        f.write haml_template.gsub('{{name}}', @filename).gsub('{{dashname}}', @filename.underscore.dasherize.downcase)
      end

      # create the SCSS file for the component
      File.open(File.join(component_resource_dir, "_#{@filename.underscore.dasherize.downcase}.scss"), 'w') do |f|
        f.write scss_template.gsub('{{name}}', @filename).gsub('{{dashname}}', @filename.underscore.dasherize.downcase)
      end

      # add the import statement to the theme css file
      themes_dir = File.join(@destination_dir, 'themes', Mulberry::App.new(@destination_dir).theme)

      FileUtils.mkdir_p themes_dir unless File.exists? themes_dir

      File.open(File.join(themes_dir, theme_cssfile), 'a') do |f|
        pathstring = Pathname.new("#{@code_dir}/#{@filename}/#{@filename.underscore.dasherize.downcase}").relative_path_from(Pathname.new(themes_dir))
        f.write "@import '#{pathstring}';\n"
      end

      puts "Template is at #{File.join(component_resource_dir, "#{@filename}.haml")}"
      puts "Styles are at #{File.join(component_resource_dir, "_#{@filename.underscore.dasherize.downcase}.scss")}"
    end
  end
end
