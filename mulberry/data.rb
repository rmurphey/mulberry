require 'active_support/inflector'

require 'mulberry/assets/page'
require 'mulberry/assets/text'
require 'mulberry/assets/image'
require 'mulberry/assets/video'
require 'mulberry/assets/audio'
require 'mulberry/assets/data'
require 'mulberry/assets/location'
require 'mulberry/assets/feed'
require 'mulberry/assets/header_image'

module Mulberry
  class Data
    SITEMAP   = 'sitemap.yml'

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

    attr_reader :source_dir, :assets_dir

    def initialize(app)
      @config     = app.config
      @source_dir = app.source_dir
      @assets_dir = app.assets_dir
      @items      = []
      @item_ids   = []

      @config['facebookApiKey'] = @config['facebook_api_key']
      @config['twitterCustomerKey'] = @config['twitter_customer_key']
      @config['twitterCustomerSecret'] = @config['twitter_customer_secret']

      read_sitemap
    end

    public
    def generate
      do_contexts unless @contexts_complete

      {
        :items    =>  @items,
        :app      =>  @config
      }
    end

    def <<(item)
      unless @item_ids.include? item[:id]
        @item_ids << item[:id]
        @items << item
      end
    end

    private
    def read_sitemap
      f = File.join(@source_dir, SITEMAP)
      sitemap = (File.exists?(f) && YAML.load_file(f)) || []
      sitemap.each do |node|
        process_node node
      end
    end

    def process_node(node)
      if node.is_a? Hash
        node.each do |parent, children|
          parse_node(parent, children)
          children.each { |child| process_node child }
        end
      else
        parse_node(node)
      end
    end

    def parse_node(node, children = [])
      file = File.join(@source_dir, 'pages', "#{node}.md")
      raise "Can't find #{node}.md in pages directory (#{file})" unless File.exists? file
      node_data = File.read(file)

      pieces = node_data.split('---').delete_if { |piece| piece.empty? }
      frontmatter = pieces.first
      content = pieces.length > 1 ? pieces.last : ''
      config = YAML.load(frontmatter)

      body_text = Mulberry::Asset::Text.new(content, node)
      self << body_text.item

      page_data = {
        :name               => config['title'] || node,
        :pageController     => config['template'],
        :bodyText           => body_text.reference
      }

      if config['header_image']
        header_image = Mulberry::Asset::HeaderImage.new(config['header_image'], @assets_dir)
        page_data[:phoneHeaderImage] = header_image.reference
        page_data[:tabletHeaderImage] = header_image.reference
        self << header_image.item
      end

      if config['featured_image']
        featured_image = Mulberry::Asset::Image.new(config['featured_image'], @assets_dir)
        page_data[:featuredImage] = featured_image.reference
        self << featured_image.item
      end

      ASSETS.each do |asset_group, asset_class|
        if config[asset_group]
          group = DATA_NAME_MAP[asset_group] || asset_group.to_sym
          page_data[group] = []

          config[asset_group].each do |asset|
            a = asset_class.new(asset, @assets_dir)
            page_data[group] << a.reference

            self << a.item
            self << a.caption.item if a.caption
          end
        end
      end

      page = Mulberry::Asset::Page.new(node, page_data)

      if !children.empty?
        children.each do |child|
          page.add_child(child.is_a?(Hash) ? child.keys.first : child)
        end
      end

      self << page.item
    end

    def do_contexts
      context_makers = {}

      [ :image, :audio, :video, 'google-map-pin'.to_sym ].each do |asset_type|
        context_makers[asset_type] = lambda do |asset_ref, node_id|
          {
            :type     => asset_type.to_s,
            :id       => asset_ref,
            :node     => node_id
          }
        end
      end

      @items.each do |item|
        if item[:type] == 'node'

          if item[:bodyText]
            text_asset = @items.find { |i| i[:id] == item[:bodyText]['_reference'] }

            text_asset[:contexts] << {
              :type       => 'node',
              :node       => item[:id]
            }
          end

          [ :image, :video, :audio, 'google-map-pin'.to_sym ].each do |asset_type|
            asset_group = asset_type.to_s.underscore.camelize(:lower).pluralize.to_sym
            if !item[asset_group].is_a? Array
              next
            end

            item[asset_group].each do |a|
              if a[:caption]
                text_asset = find_caption a
                text_asset[:contexts] << context_makers[asset_type].call(
                  a[asset_type.to_s.underscore.camelize(:lower).to_sym]['_reference'],
                  item[:id]
                )
              end
            end
          end

        end
      end

      @items.each do |item|
        if item[:type] == 'node' && item[:children] && item[:children].length
          item[:children].each do |child|
            child_id = child['_reference']
            @items.select { |i| i[:id] == child_id }[0][:parent] = { '_reference' => item[:id] }
          end
        end
      end

      @contexts_complete = true
    end

    def find_caption(asset_caption_object)
      id = asset_caption_object[:caption]['_reference']
      @items.find { |i| i[:id] == id }
    end
  end
end
