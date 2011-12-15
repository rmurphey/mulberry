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
        poster_filename = "#{@asset_name}.jpg"
        poster_url = File.exists?(File.join(@dir, 'posters', poster_filename)) ?  "media/#{asset_type_dir}/posters/#{asset_name}.jpg" : ""

          media_asset_item.merge({
            :poster => {
              :url => poster_url,
              :filename => poster_filename
            }
          })
      end
    end
  end
end
