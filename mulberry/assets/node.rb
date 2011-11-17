require 'mulberry/assets/base'

module Mulberry
  module Asset
    class Node < Mulberry::Asset::Base
      def initialize(page_data = nil)
        self.asset = page_data
      end

      def asset=(asset)
        return unless asset
        @page_data = asset
        @asset_name = asset[:page_name]
      end

      def asset_type_dir
        File.join('..', 'pages')
      end

      def asset_type
        'node'
      end

      def item
        base_item.merge(@page_data)
      end

      def reference
        { '_reference' => id }
      end
    end
  end
end
