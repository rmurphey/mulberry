require 'lib/ota_service_application'

module Builder
  class Data < Builder::TaskBase
    DATA_FILENAME = 'tour.js'

    public
    def build
      @destination = File.join(@location, DATA_FILENAME)
      @report = { :location => @location, :files => [ DATA_FILENAME ] }
      json = JSON.pretty_generate(@build.build_helper.data)
      File.open(@destination, 'w') do |f|
        f.write TouraAPP::Generators.data(@build.build_helper.data)
      end
      if @build.ota_enabled? || @build.settings[:publish_ota]
        @report[:tour_json_location] = File.join(@location, "tour.json")
        File.open(@report[:tour_json_location], 'w') do |f|
          f.write json
        end
      end
      true
    end

  end
end
