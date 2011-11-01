require 'active_support/inflector'

module Mulberry
  class CodeCreator
    def initialize(code_type, destination_dir, filename)
      dirnames = {
        'component'   =>  'components',
        'capability'  =>  'capabilities',
        'datasource'  =>  'data'
      }

      raise "Don't know how to create code type #{code_type}" unless dirnames[code_type]

      code_templates_dir = File.expand_path('../templates/code', __FILE__)
      template = File.read(File.join(code_templates_dir, "#{code_type}.js"))

      js_dir = File.join(destination_dir, 'javascript')
      code_dir = File.join(js_dir, dirnames[code_type])

      code_filename = File.join(code_dir, "#{filename}.js")

      if File.exists? code_filename
        raise "The file #{code_filename} already exists"
      end

      FileUtils.mkdir_p(code_dir) unless File.exists?(code_dir)

      # write the basic file for the requested code
      File.open(File.join(code_dir, "#{filename}.js"), 'w') do |f|
        f.write template.gsub('{{name}}', filename)
      end

      # add the dependency
      File.open(File.join(js_dir, 'base.js'), 'a') do |f|
        f.write "dojo.require('client.#{dirnames[code_type]}.#{filename}');\n"
      end

      puts "Created #{code_type} at #{code_filename}"

      # handle any special needs for the requested type of code
      if code_type === 'component'
        # create the resource dir for the component
        component_resource_dir = File.join(code_dir, filename)
        FileUtils.mkdir_p(component_resource_dir) unless File.exists? component_resource_dir

        # create the basic haml template for the component
        File.open(File.join(component_resource_dir, "#{filename}.haml"), 'w') do |f|
          f.write ".component.#{filename.underscore.dasherize.downcase} (This is the #{filename} component)\n"
        end

        puts "Template is at #{File.join(component_resource_dir, "#{filename}.haml")}"
      end
    end
  end
end
