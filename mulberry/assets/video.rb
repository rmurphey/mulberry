require 'mulberry/assets/base'

module Mulberry
  module Asset
    class Video < Mulberry::Asset::Base
      protected
      def asset_type_dir
        'videos'
      end

      def asset_type
        'video'
      end

      public
      def item
        {
          :type       =>  self.asset_type,
          :id         =>  id,
          :streamed   =>  false,
          :name       =>  @asset_name,
          :filename   =>  @filename,
        }

        # TODO: poster
      end
    end
  end
end
