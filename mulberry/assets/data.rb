require 'mulberry/assets/base'

module Mulberry
  module Asset
    class Data < Mulberry::Asset::Base
      protected
      def asset_type_dir
        'data'
      end

      def asset_type
        'data-asset'
      end

      public
      def reference
        { :data_asset => { '_reference' => id } }
      end

      def item
        data = load_data
        data_type = (data.is_a? Hash) ? data['type'] : nil

        {
          :type       =>  self.asset_type,
          :data_type  =>  data_type,
          :id         =>  id,
          :name       =>  @asset_name,
          :value      =>  JSON.generate(data)
        }
      end
    end
  end
end

