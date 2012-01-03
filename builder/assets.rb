require "builder/task_base"

module Builder
  class Assets < Builder::TaskBase
    public
    def build
      @dir = nil

      raise "We don't know how to build assets without a device type." unless @target['device_type']

      @report = { :location   => @location}
      @build.build_helper.assets(@location, @report)
    end
  end
end
