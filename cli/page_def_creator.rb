require 'active_support/inflector'

module Mulberry
  class PageDefCreator
    def initialize(code_type, destination_dir, filename)
      page_def_dir = File.join(destination_dir, 'page_defs')
      capability_name = "Page#{filename.gsub('-', '_').camelize}"
      FileUtils.mkdir_p page_def_dir unless File.exists? page_def_dir
      page_def_filename = File.join(page_def_dir, "#{filename}.yml")

      if File.exists? page_def_filename
        raise "Page definition #{page_def_filename} already exists"
      end

      page_def_template = File.read(File.join(Mulberry::Directories.templates, 'page_def.yml'))

      File.open(page_def_filename, 'w') do |f|
        f.write page_def_template.gsub('{{page_def_name}}', filename).gsub('{{capability_name}}', capability_name)
      end

      Mulberry::CodeCreator.new('capability', destination_dir, capability_name)

      puts "Created template at #{page_def_filename}"
    end
  end
end
