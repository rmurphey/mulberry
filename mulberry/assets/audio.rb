require 'mulberry/assets/base'

module Mulberry
  module Asset
    class Audio < Mulberry::Asset::Base
      protected
      def asset_type_dir
        'audios'
      end

      def asset_type
        'audio'
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
      end
    end
  end
end
