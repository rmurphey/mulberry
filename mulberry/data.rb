require 'mulberry/page'

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
      sitemap = YAML.load_file(File.join(@source_dir, SITEMAP))
      sitemap.each { |node| Mulberry::Asset::Page.new(node, self) }
    end

    def do_contexts
      text_assets = {}

      @items.each do |item|
        if item[:type] == 'text-asset'
          text_assets[item[:id]] = item
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
          else
            puts "no body text for #{item}"
          end

          [
            :image, :video, :audio, :google_map_pin
          ].each do |asset_type|
            asset_group = "#{asset_type.to_s}s".to_sym
            if !item[asset_group].is_a? Array
              next
            end

            item[asset_group].each do |a|
              if a[:caption]
                text_asset = find_caption a
                text_asset[:contexts] << context_makers[asset_type].call(
                  a[asset_type]['_reference'],
                  item[:id]
                )
              end
            end
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
