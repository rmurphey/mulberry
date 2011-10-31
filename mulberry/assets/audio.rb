require 'mulberry/assets/media_asset'

module Mulberry
  module Asset
    class Audio < Mulberry::Asset::MediaAsset
      def asset_type_dir
        'audios'
      end

      def asset_type
        'audio'
      end
    end
  end
end
