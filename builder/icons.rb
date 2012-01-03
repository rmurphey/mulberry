require "builder/task_base"

module Builder
  class Icons < Builder::TaskBase
    public
    def build
      @files = []

      raise "Icons task requires device type" unless @target['device_type']

      @report = { :location   =>  @location }
      @build.build_helper.icons(@location, @report)
    end
  end
end
