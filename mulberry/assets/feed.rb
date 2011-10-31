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
      def item
        data = load_data
        base_item.merge(
          {
            :feedUrl   =>  data['feed_url']
          })
      end
    end
  end
end


