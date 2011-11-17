require 'active_support/inflector'

require 'mulberry/assets/node'
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
      sitemap.each { |item| process_sitemap_item item }
    end

    def process_sitemap_item(item)
      if item.is_a? Hash
        load_data_for_item(
          item.keys.first,
          item.values.first.map { |child| process_sitemap_item(child).reference }
        )
      else
        load_data_for_item(item)
      end
    end

    def load_data_for_item(item_name, children = [])
      item_file = File.join(@source_dir, 'pages', "#{item_name}.md")
      raise "Can't find #{item_name}.md in pages directory (#{item_file})" unless File.exists? item_file

      frontmatter, content = File.read(item_file).split('---').delete_if { |p| p.empty? }
      content ||= ''
      config = YAML.load(frontmatter)

      node = Mulberry::Asset::Node.new({
        :page_name          =>  item_name,
        :name               =>  config['title'] || item_name,
        :pageController     =>  config['template'],
        :children           =>  children
      })

      body_text = Mulberry::Asset::Text.new(content, item_name)

      add_asset body_text
      node.add_asset body_text, :body_text

      {
        :header_image   =>  Mulberry::Asset::HeaderImage,
        :featured_image =>  Mulberry::Asset::Image
      }.each do |k, klass|
        if config[k.to_s]
          a = klass.new(config[k.to_s], @assets_dir)
          node.add_asset a, k
          add_asset a
        end
      end

      ASSETS.each do |asset_group, asset_class|
        if config[asset_group]
          group = DATA_NAME_MAP[asset_group] || asset_group.to_sym

          config[asset_group].each do |asset|
            a = asset_class.new(asset, @assets_dir)

            node.add_asset a, group

            add_asset a
            add_asset a.caption if a.caption
          end
        end
      end

      add_asset node
    end

    def add_asset(asset)
      return unless asset
      self << asset.item
      asset
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
        if item[:type] == 'node' && item[:children]
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
