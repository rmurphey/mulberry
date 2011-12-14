require 'mulberry/ota_service_application'

module Builder
  class Data < Builder::TaskBase
    DATA_FILENAME = 'tour.js'

    public
    def build
      @destination = File.join(@location, DATA_FILENAME)
      @report = { :location => @location, :files => [ DATA_FILENAME ] }
      json = JSON.pretty_generate(@build.build_helper.data)
      if @build.ota_enabled?
        toura_api_config = @build.settings[:toura_api_config]
        ota_service_application = OtaServiceApplication.new(toura_api_config['url'],
                                                            toura_api_config['key'],
                                                            toura_api_config['secret'])
        begin
          ota_service_application.version
        rescue Mulberry::Http::NotFound
          ota_service_application.publish json
        end
      end
      File.open(@destination, 'w') do |f|
        f.write "toura.data.local = #{json};"
      end
      if @build.ota_enabled?
        @report[:tour_json_location] = File.join(@location, "tour.json")
        File.open(@report[:tour_json_location], 'w') do |f|
          f.write json
        end
      end
      true
    end

  end
end
