require 'mulberry/assets/base'

module Mulberry
  module Asset
    class Data < Mulberry::Asset::Base
      def asset_type_dir
        'data'
      end

      def asset_type
        'data-asset'
      end

      def item
        data = load_data
        data_type = (data.is_a? Hash) ? data['type'] : nil
        base_item.merge(
          {
            :dataType   =>  data_type,
            :value      =>  JSON.generate(data)
          })
      end
    end
  end
end

