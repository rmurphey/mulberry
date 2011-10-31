require 'mulberry/assets/base'

module Mulberry
  module Asset
    class Video < Mulberry::Asset::Base
      def asset_type_dir
        'videos'
      end

      def asset_type
        'video'
      end

      def item
        base_item.merge(
          {
            :streamed   =>  false,
          })

        # TODO: poster
      end
    end
  end
end
