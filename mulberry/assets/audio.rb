require 'mulberry/assets/base'

module Mulberry
  module Asset
    class Audio < Mulberry::Asset::Base
      protected
      def asset_type_dir
        'videos'
      end

      def asset_type
        'video'
      end

      public
      def reference
        ref = { :audio => { '_reference' => id } }

        if !@caption.nil?
          ref[:caption] = { '_reference' => @caption.id }
        end

        ref
      end

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
