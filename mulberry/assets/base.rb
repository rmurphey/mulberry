require 'yaml'

module Mulberry
  module Asset
    class Base
      attr_reader :caption

      def initialize(asset, parent_assets_dir)
        if asset.is_a? Hash
          @asset_name = asset['name']
          @filename   = asset['filename']
        else
          @filename   = asset
          @asset_name = asset.split('.').first
        end

        @dir          = dirname(parent_assets_dir)
        @asset_file   = File.join(@dir, @filename)

        puts "No file at #{@dir}/#{@filename}" unless File.exists? @asset_file

        @caption      = process_caption
      end

      private
      def dirname(parent_assets_dir)
        File.join(parent_assets_dir, asset_type_dir)
      end

      def process_caption
        caption_file = File.join(
          @dir,
          'captions',
          "#{@asset_name}.md"
        )

        if File.exists?(caption_file)
          Mulberry::Asset::Text.new(File.read(caption_file), @asset_name)
        else
          nil
        end
      end

      def load_data
        if @filename.match(/\.yml$/) || @filename.match(/\.yaml$/)
          return YAML.load_file(@asset_file)
        end

        if @filename.match(/\.json$/) || @filename.match(/\.js$/)
          return JSON.parse(File.read(@asset_file))
        end

        File.read(@asset_file)
      end

      public
      def reference
        raise "reference method not implemented"
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
