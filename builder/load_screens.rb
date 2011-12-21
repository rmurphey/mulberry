require "builder/task_base"

module Builder
  class LoadScreens < Builder::TaskBase
    public
    def build
      @files = []
      @report = { :location   =>  @location }
      @build.build_helper.load_screens(@location, @report)
    end
  end
end
