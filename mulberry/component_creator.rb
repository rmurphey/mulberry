module Mulberry
  class ComponentCreator
    def initialize(code_type, destination_dir, filename)
      js_dir = File.join(destination_dir, 'javascript')
      component_dir = File.join(js_dir, 'components');
      component_resource_dir = File.join(component_dir, filename)
      component_filename = File.join(component_dir, "#{filename}.js")

      if File.exists? component_filename
        raise "Component #{component_filename} already exists"
      end

      templates_dir = File.expand_path('../templates/code', __FILE__)
      template = File.read(File.join(templates_dir, "#{code_type}.js"))

      FileUtils.mkdir_p(component_resource_dir) unless File.exists? component_resource_dir
      File.open(File.join(component_resource_dir, "#{filename}.haml"), 'w') do |f|
        f.write ".component.#{filename.downcase}\n"
      end

      File.open(File.join(component_dir, "#{filename}.js"), 'w') do |f|
        f.write template.gsub('{{component_name}}', filename)
      end

      File.open(File.join(js_dir, 'base.js'), 'a') do |f|
        f.write "dojo.require('client.components.#{filename}');\n"
      end

      puts "Created component at #{File.join(component_dir, "#{filename}.js")}"
      puts "Template is at #{File.join(component_resource_dir, "#{filename}.haml")}"
    end
  end
end
