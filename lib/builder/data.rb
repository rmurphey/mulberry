
module Builder
  class Data < Builder::TaskBase
    DATA_FILENAME = 'tour.js'

    public
    def build
      @destination = File.join(@location, DATA_FILENAME)
      @report = { :location => @location, :files => [ DATA_FILENAME ] }
      json = JSON.pretty_generate(@build.build_helper.data)
      File.open(@destination, 'w') do |f|
        f.write "toura.data.local = #{json};"
      end
      if @target['ota'] and @target['ota']['enabled']
        @report[:tour_json_location] = File.join(@location, "tour.json")
        File.open(@report[:tour_json_location], 'w') do |f|
          f.write json
        end
      end
    end

  end
end
