module Mulberry
  class ContentCreator
    DESTINATIONS = {
      :page       => 'pages',
      :feed       => [ 'assets', 'feeds' ],
      :data       => [ 'assets', 'data' ],
      :location   => [ 'assets', 'locations' ]
    }

    EXTENSIONS = {
      # default is 'yml'
      :page       => 'md'
    }

    def initialize(content_type, destination_dir, filename)
      if !DESTINATIONS.keys.include? content_type.to_sym
        raise "Unknown content type #{content_type}"
      end

      templates_dir = File.join(Mulberry::Directories.templates, 'content')
      extension = EXTENSIONS[content_type.to_sym] || 'yml'
      dest = File.join(destination_dir, DESTINATIONS[content_type.to_sym], "#{filename}.#{extension}")

      raise "File #{dest} already exists" unless !File.exists?(dest)

      FileUtils.cp_r(
        File.join(templates_dir, "#{content_type}.yml"),
        dest
      )

      puts "Created #{dest}"
    end
  end
end
