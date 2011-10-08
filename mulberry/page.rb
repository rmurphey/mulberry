require 'mulberry/assets/text'

require 'mulberry/assets/image'
require 'mulberry/assets/video'
require 'mulberry/assets/audio'
require 'mulberry/assets/data'
require 'mulberry/assets/location'
require 'mulberry/assets/feed'
require 'mulberry/assets/header_image'

module Mulberry
  module Asset
    class Page
      ASSET_TYPE = 'node'

      ASSETS = {
        'images'      =>  Mulberry::Asset::Image,
        'audios'      =>  Mulberry::Asset::Audio,
        'videos'      =>  Mulberry::Asset::Video,
        'data'        =>  Mulberry::Asset::Data,
        'locations'   =>  Mulberry::Asset::Location,
        'feeds'       =>  Mulberry::Asset::Feed
      }

      DATA_NAME_MAP = {
        'locations'   => :googleMapPins,
        'data'        => :dataAssets
      }

      def initialize(node, app_items)
        @app_items = app_items
        @source_dir = app_items.source_dir
        @assets_dir = app_items.assets_dir
        process node
      end

      private
      def process(node)
        if node.is_a? Hash
          node.each do |parent, children|
            parse(parent, children)
            children.each { |child| process child }
          end
        else
          parse(node)
        end
      end

      def read(node)
        file = File.join(@source_dir, 'pages', "#{node}.md")
        raise "Can't find #{node}.md in pages/ (#{file})" unless File.exists? file
        File.read(file)
      end

      def parse(node, children = [])
        pieces = (read node).split('---').delete_if { |piece| piece.empty? }
        frontmatter = pieces.first
        content = pieces.last
        config = YAML.load(frontmatter)

        body_text = Mulberry::Asset::Text.new(content, node)
        @app_items << body_text.item

        page_data = {
          :type               => ASSET_TYPE,
          :id                 => "#{ASSET_TYPE}-#{node}",
          :name               => config['title'],
          :pageController     => config['template'],
          :bodyText           => body_text.reference
        }

        if config['header_image']
          header_image = Mulberry::Asset::HeaderImage.new(config['header_image'], @assets_dir)
          page_data[:phoneHeaderImage] = header_image.reference
          page_data[:tabletHeaderImage] = header_image.reference
          @app_items << header_image.item
        end

        if !children.empty?
          page_data[:children] = []
          children.each do |child|
            page_data[:children] << { '_reference' => "#{ASSET_TYPE}-#{child}" }
          end
        end

        ASSETS.each do |asset_group, asset_class|
          if config[asset_group]
            group = DATA_NAME_MAP[asset_group] || asset_group.to_sym
            page_data[group] = []

            config[asset_group].each do |asset|
              a = asset_class.new(asset, @assets_dir)
              page_data[group] << a.reference

              @app_items << a.item
              @app_items << a.caption.item if a.caption
            end
          end
        end

        @app_items << page_data
      end

    end
  end
end
