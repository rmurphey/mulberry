require 'mulberry/assets/base'

module Mulberry
  module Asset
    class MediaAsset < Mulberry::Asset::Base
      def media_asset_item
        item = base_item.merge(
          {
            :streamed   =>  @url ? true : false,
          })
        item[:url] = @url if @url
        item
      end

      def item
        media_asset_item
      end
    end
  end
end
