
module Builder
  class Data < Builder::TaskBase
    DATA_FILENAME = 'tour.js'

    public
    def build
      @destination = File.join(@location, DATA_FILENAME)
      @report = { :location => @location, :files => [ DATA_FILENAME ] }
      @build.build_helper.data(@destination, @report)
    end

  end
end
