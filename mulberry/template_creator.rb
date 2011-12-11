require 'active_support/inflector'
require 'mulberry/code_creator'

module Mulberry
  class TemplateCreator
    def initialize(code_type, destination_dir, filename)
      template_dir = File.join(destination_dir, 'templates')
      capability_name = "Page#{filename.gsub('-', '_').camelize}"
      FileUtils.mkdir_p template_dir unless File.exists? template_dir
      template_filename = File.join(template_dir, "#{filename}.yml")

      if File.exists? template_filename
        raise "Template #{template_filename} already exists"
      end

      template_template = File.read(File.join(Mulberry::Directories.templates, 'template.yml'))

      File.open(template_filename, 'w') do |f|
        f.write template_template.gsub('{{template_name}}', filename).gsub('{{capability_name}}', capability_name)
      end

      Mulberry::CodeCreator.new('capability', destination_dir, capability_name)

      puts "Created template at #{template_filename}"
    end
  end
end
