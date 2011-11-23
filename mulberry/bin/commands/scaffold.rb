require 'content_creator'

module Mulberry
  module Command
    class Scaffold
      def initialize(args = [])
        dir = args[0]

        if dir.nil?
          @dir = Mulberry.get_app_dir
          sitemap = YAML.load_file(File.join(@dir, Mulberry::SITEMAP))
          sitemap.each { |page| process_page page }
        else
          dir = dir.gsub(File.join(Dir.pwd, ""), "")
          Mulberry::App.scaffold(dir)
        end
      end

      private
      def process_page(page)
        if page.is_a? Hash
          create_page page.keys.first
          page.values.first.each { |child| process_page child }
        else
          create_page page
        end
      end

      def create_page(page_name)
        Mulberry::ContentCreator.new(:page, @dir, page_name) unless page_exists(page_name)
      end

      def page_exists(page_name)
        File.exists?(File.join(@dir, 'pages', "#{page_name}.md"))
      end
    end
  end
end
