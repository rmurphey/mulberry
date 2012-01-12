module Mulberry
  module Command
    class Generate < Mulberry::Command::Base
      def initialize(args = [])

        @dir = Mulberry.get_app_dir args[0]
        @created_pages = false

        sitemap = YAML.load_file(File.join(@dir, Mulberry::SITEMAP))
        sitemap.each { |page| process_page page }

        if !@created_pages
          puts "All pages in the sitemap exist"
        end

        Dir.glob(File.join(@dir, 'page_defs', '*.yml')).each do |f|
          page_def = YAML.load_file(f).values.first
          raise "Page definition #{File.basename(f)} has no screens." unless page_def['screens']
          page_def['screens'].each do |screen|
            raise "Page definition #{File.basename(f)} has no regions on screen #{screen['name']}." unless screen['regions']
            screen['regions'].each(&method(:create_components))
          end
        end

        report @dir
      end

      private
      def create_components(region)
        if region['regions']
          region['regions'].each(&method(:create_components))
        end

        if region['components']
          region['components'].each do |c|
            Mulberry::CodeCreator.new(:component, @dir, component_basename(c)) unless component_exists? c
          end
        end
      end

      def component_exists?(component)
        if !component.match(/^custom\./)
          # assume all non-custom components exist
          true
        else
          File.exists?(File.join(@dir, 'javascript', 'components', "#{component_basename(component)}.js"))
        end
      end

      def component_basename(component)
        component.gsub(/^custom\./, '')
      end

      def process_page(page)
        if page.is_a? Hash
          page.values.first.each { |child| process_page child }
          create_page page.keys.first
        else
          create_page page
        end
      end

      def create_page(page_name)
        unless page_exists?(page_name)
          page = Mulberry::ContentCreator.new(:page, @dir, page_name)
          @created_pages = true
        end
      end

      def page_exists?(page_name)
        File.exists?(File.join(@dir, 'pages', "#{page_name}.md"))
      end
    end
  end
end
