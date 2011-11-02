require "lib/builder/task_base"

module Builder
  class WWWIcons < Builder::TaskBase
    public
    def build
      FileUtils.cp_r(
        File.join(TouraAPP::Directories.root, 'www', 'icons', '.'),
        File.join(@location, 'icons')
      )

      true
    end

    def report
      {
        :location => @location,
        :files => [ File.join('icons', '.') ]
      }
    end
  end
end
