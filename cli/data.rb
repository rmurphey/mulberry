require 'active_support/inflector'

require 'lib/toura_api'

require 'cli/assets/audio'
require 'cli/assets/background_image'
require 'cli/assets/data'
require 'cli/assets/feed'
require 'cli/assets/header_image'
require 'cli/assets/image'
require 'cli/assets/location'
require 'cli/assets/node'
require 'cli/assets/text'
require 'cli/assets/video'

require 'lib/http'

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

      process_api_keys
      read_sitemap
    end

    public
    def generate(include_version=false)
      do_contexts unless @contexts_complete
      result = {
        :items       =>  @items,
        :app         =>  @config,
        :appVersion  =>  TouraAPP.version

      }
      if (include_version)
        unless @config['toura_api']
          raise Builder::ConfigurationError.new "Need toura_api configuration to include version in data json."
        end
        url = @config['toura_api']['url'] || TouraApi::URL
        key = @config['toura_api']['key']
        begin
          version = OtaServiceApplication.new(url, key).version
        rescue Mulberry::Http::NotFound
        end
        new_version = (version || 0 ) + 1
        puts "Retrieved current version from #{url}: #{version ? version : '(not published yet)'}. Setting version for this to #{new_version}."
        result['version'] = new_version
      end
      result
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
      sitemap.each { |page| process_page page }
    end

    def process_page(page)
      if page.is_a? Hash
        load_data_for_page(
          page.keys.first,
          page.values.first.map { |child| process_page(child).reference }
        )
      else
        load_data_for_page(page)
      end
    end

    def process_api_keys
      api_keys = @config.select { |k,v| /(.+api_key$)|(^twitter_customer_(key|secret))$/ =~ k }

      api_keys.each do |api_key|
        camel_key = api_key[0].to_s.underscore.camelize(:lower)
        @config[camel_key] = api_key[1]
        @config.delete api_key[0]
      end
    end

    def load_data_for_page(page_name, children = [])
      default_node_props = %w{
        title
        page_def
        header_image
        featured_image
      } + ASSETS.keys

      page_file = File.join(@source_dir, 'pages', "#{page_name}.md")
      raise "Can't find #{page_name}.md in pages directory (#{page_file})" unless File.exists? page_file

      frontmatter, content = File.read(page_file).split('---').delete_if { |p| p.empty? }
      content ||= ''
      config = YAML.load(frontmatter)

      node_props = {
        :node_name          =>  page_name,
        :name               =>  config['title'] || page_name,
        :pageController     =>  config['page_def'] || { 'phone' => 'default', 'tablet' => 'default' },
        :children           =>  children,
        :custom             =>  ({}.merge(config)).delete_if { |k, v| default_node_props.include? k }
      }

      node = Mulberry::Asset::Node.new node_props

      body_text = Mulberry::Asset::Text.new(content, page_name)

      add_asset body_text
      node.add_asset body_text, :body_text

      {
        :header_image       =>  Mulberry::Asset::HeaderImage,
        :featured_image     =>  Mulberry::Asset::Image,
        :background_image   =>  Mulberry::Asset::BackgroundImage
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
          assets = config[asset_group]

          (assets.is_a?(String) ? [assets] : assets).each do |asset|
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
