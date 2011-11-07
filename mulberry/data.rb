require 'mulberry/page'
require 'active_support/inflector'

module Mulberry
  class Data
    SITEMAP   = 'sitemap.yml'
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
      sitemap.each { |node| Mulberry::Asset::Page.new(node, self) }
    end

    def do_contexts
      text_assets = {}
      nodes = {}

      @items.each do |item|
        if item[:type] == 'text-asset'
          text_assets[item[:id]] = item
        end

        if item[:type] == 'node'
          nodes[item[:id]] = item
        end
      end

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

          if item[:body_text]
            text_asset = @items.find { |i| i[:id] == item[:body_text]['_reference'] }

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
