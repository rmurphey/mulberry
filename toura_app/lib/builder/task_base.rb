require 'fileutils'

module Builder
  class TaskBase
    attr_reader :report

    def initialize(build, task_name)
      @build = build

      @target = build.target
      @build_type = @target['build_type']
      @location = File.join(build.tmp_dir, task_name.to_s)
      @report = {}

      prep_dir
    end

    public
    def build
      raise "build method not defined"
    end

    private
    def prep_dir
      FileUtils.rm_rf(@location) if File.exists?(@location)
      FileUtils.mkdir_p(@location)
    end

    def build_required
      true
    end
  end
end
