require "builder/task_base"
require "builder/css_maker"

module Builder
  class CSS < Builder::TaskBase
    CSS_FILENAME = 'base.css'

    def build
      @destination = File.join(@location, CSS_FILENAME)
      @report = { :location => @location,  :files => [ CSS_FILENAME ] }
      @build.build_helper.css(@destination, @report) if build_required
      @build.build_helper.css_resources(@location, @report)
    end

    private
    def build_required
      !File.exists? @destination
    end
  end
end
