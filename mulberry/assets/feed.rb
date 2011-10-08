require 'mulberry/assets/base'

module Mulberry
  module Asset
    class Feed < Mulberry::Asset::Base
      protected
      def asset_type_dir
        'feeds'
      end

      def asset_type
        'feed'
      end

      public
      def reference
        { :feed => { '_reference' => id } }
      end

      def item
        data = load_data

        {
          :type       =>  self.asset_type,
          :id         =>  id,
          :name       =>  @asset_name,
          :feedUrl   =>  data['feed_url']
        }
      end
    end
  end
end


