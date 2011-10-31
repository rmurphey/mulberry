require 'mulberry/assets/media_asset'

module Mulberry
  module Asset
    class Video < Mulberry::Asset::MediaAsset
      def asset_type_dir
        'videos'
      end

      def asset_type
        'video'
      end

      def item
        media_asset_item
        # TODO: poster
      end
    end
  end
end
