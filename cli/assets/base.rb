require 'yaml'

module Mulberry
  module Asset
    class Base
      attr_accessor :asset_name, :dir
      def initialize(asset=nil, parent_assets_dir=nil)
        self.asset = asset
        self.parent_assets_dir = parent_assets_dir
      end

      def asset=(asset)
        return unless asset
        if asset.is_a? Hash
          @asset_name = asset['name']
          @filename   = asset['filename']
        else
          @filename   = File.basename(URI.parse(asset).path)
          @asset_name = @filename.split('.').first
          @url        = asset if asset.match /^http/
        end
      end

      def parent_assets_dir=(parent_assets_dir)
        return unless parent_assets_dir
        @dir          = dirname(parent_assets_dir)
        @asset_file   = File.join(@dir, @filename)

        puts "No file at #{@dir}/#{@filename}" unless File.exists? @asset_file
      end

      def caption
        unless @caption_processed
          caption_file = File.join(
            @dir,
            'captions',
            "#{@asset_name}.md"
          )

          if File.exists?(caption_file)
            @caption = Mulberry::Asset::Text.new(File.read(caption_file), @asset_name)
          else
            data = load_data
            if data && data['caption']
              @caption = Mulberry::Asset::Text.new(data['caption'], data['name'] || @asset_name)
            end
          end
          @caption_processed = true
        end
        @caption
      end

      private
      def dirname(parent_assets_dir)
        File.join(parent_assets_dir, asset_type_dir)
      end

      protected
      def base_item
        {
          :type       =>  self.asset_type,
          :id         =>  id,
          :name       =>  @asset_name,
          :filename   =>  @filename
        }
      end

      public
      def reference
        ref = { asset_type.underscore.camelcase(:lower).to_sym => { '_reference' => id } }
        ref.merge!({ :caption => { '_reference' => @caption.id } }) unless caption.nil?
        ref
      end

      def load_data
        if File.exists?(@asset_file)
          if @filename.match(/\.yml$/) || @filename.match(/\.yaml$/)
            return YAML.load_file(@asset_file)
          end

          if @filename.match(/\.json$/) || @filename.match(/\.js$/)
            return JSON.parse(File.read(@asset_file))
          end

          File.read(@asset_file)
        end
      end

      def item
        raise "item method not implemented"
      end

      def id
        "#{asset_type}-#{@asset_name}"
      end

    end
  end
end
