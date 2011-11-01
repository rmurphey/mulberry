
module Builder
  class Data < Builder::TaskBase
    DATA_FILENAME = 'tour.js'

    public
    def build
      @destination = File.join(@location, DATA_FILENAME)
      @report = { :location => @location, :files => [ DATA_FILENAME ] }
      File.open(@destination, 'w') do |f|
        f.write "toura.data.local = #{JSON.pretty_generate(@build.build_helper.data)};"
      end
    end

  end
end
