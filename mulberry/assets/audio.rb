require 'mulberry/assets/base'

module Mulberry
  module Asset
    class Audio < Mulberry::Asset::Base
      def asset_type_dir
        'audios'
      end

      def asset_type
        'audio'
      end

      def item
        base_item.merge(
          {
            :streamed   =>  false,
          })
      end
    end
  end
end
