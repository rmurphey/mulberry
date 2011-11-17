require 'mulberry/assets/base'

module Mulberry
  module Asset
    class Page < Mulberry::Asset::Base
      def initialize(asset_name, page_data)
        @asset_name = asset_name
        @page = page_data
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

      def add_child(child_name)
        @page[:children] ||= []
        @page[:children] << { '_reference' => "#{asset_type}-#{child_name}" }
      end
    end
  end
end
