require 'mulberry/assets/base'

module Mulberry
  module Asset
    class Location < Mulberry::Asset::Base
      def asset_type_dir
        'locations'
      end

      def asset_type
        'google-map-pin'
      end

      def item
        data = load_data
        base_item.merge(
          {
            :name           =>  data['name'],
            :address        =>  data['address'],
            :lon            =>  data['lon'],
            :lat            =>  data['lat'],
            :website        =>  data['website'],
            :phoneNumber    =>  data['phone_number']
          })
      end
    end
  end
end
