require 'mulberry/assets/base'

module Mulberry
  module Asset
    class Location < Mulberry::Asset::Base
      protected
      def asset_type_dir
        'locations'
      end

      def asset_type
        'google-map-pin'
      end

      public
      def reference
        ref = { :googleMapPin => { '_reference' => id } }

        data = load_data

        if @caption.nil? && data['caption']
          @caption = Mulberry::Asset::Text.new(data['caption'], data['name'] || @asset_name)
        end

        ref.merge!({ :caption => { '_reference' => @caption.id } }) unless @caption.nil?

        ref
      end

      def item
        data = load_data

        {
          :type           =>  self.asset_type,
          :id             =>  id,
          :name           =>  data['name'],
          :address        =>  data['address'],
          :lon            =>  data['lon'],
          :lat            =>  data['lat'],
          :website        =>  data['website'],
          :phoneNumber    =>  data['phone_number']
        }
      end
    end
  end
end
