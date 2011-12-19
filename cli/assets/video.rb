require 'cli/assets/media_asset'

module Mulberry
  module Asset
    class Video < Mulberry::Asset::MediaAsset
      def asset_type_dir
        'videos'
      end

      def asset_type
        'video'
      end

      def poster_dir(base_dir=@dir)
        File.join(base_dir, 'posters')
      end

      def poster_filename
        "#{@asset_name}.jpg"
      end

      def poster_url
        File.exists?(File.join(poster_dir, poster_filename)) ? "media/#{asset_type_dir}/posters/#{poster_filename}" : ""
      end

      def item
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
