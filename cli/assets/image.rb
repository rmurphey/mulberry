require 'cli/assets/media_asset'
require 'image_size'
require 'open-uri' # For remote images

module Mulberry
  module Asset
    class Image < Mulberry::Asset::MediaAsset
      attr_reader :asset_file

      IMAGE_TYPES = [ :featured, :featuredSmall, :gallery, :original ].freeze

      def asset_type_dir
        'images'
      end

      def asset_type
        'image'
      end

      def item
        item_data = media_asset_item

        IMAGE_TYPES.each do |image_type|
          override = "#{@asset_name}-#{image_type}.#{@filename.split('.').last}"

          item_data[image_type] = {
            :filename => File.exists?(File.join(@dir, override)) ? override : @filename
          }
          item_data[image_type][:url] = @url if @url

          begin
            open(@url || @asset_file, 'rb') do |fh|
              item_data[image_type][:width], item_data[image_type][:height] = ::ImageSize.new(fh.read).get_size
            end
          rescue
          end
        end

        item_data
      end
    end
  end
end
