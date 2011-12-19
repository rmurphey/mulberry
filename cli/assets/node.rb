require 'cli/assets/base'

module Mulberry
  module Asset
    class Node < Mulberry::Asset::Base
      def initialize(page = nil)
        self.asset = page
      end

      def asset=(asset)
        return unless asset
        @page = asset
        @asset_name = asset[:node_name]
      end

      def asset_type_dir
        File.join('..', 'pages')
      end

      def asset_type
        'node'
      end

      def item
        base_item.merge(@page)
      end

      def reference
        { '_reference' => id }
      end

      def add_asset(asset, type)
        ref = asset.reference

        case type
        when :header_image
          [ :phoneHeaderImage, :tabletHeaderImage ].each { |k| @page[k] = ref }
        when :background_image
          [ :phoneBackgroundImage, :tabletBackgroundImage ].each { |k| @page[k] = ref }
        when :featured_image
          @page[:featuredImage] = ref
        when :body_text
          @page[:bodyText] = ref
        when :locations
          # ugh
          @page[:googleMapPins] ||= []
          @page[:googleMapPins] << ref
        else
          @page[type] ||= []
          @page[type] << ref
        end
      end
    end
  end
end
