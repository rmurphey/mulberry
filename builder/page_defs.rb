require 'builder/task_base'

module Builder
  class PageDefs < Builder::TaskBase
    PAGE_DEFS_FILENAME = 'pagedefs.js'

    public
    def build
      @destination = File.join(@location, PAGE_DEFS_FILENAME)
      File.open(@destination, 'w') { |f| f.write page_defs }
      true
    end

    def report
      {
        :location => @location,
        :files => [ PAGE_DEFS_FILENAME ]
      }
    end

    private
    def page_defs
      TouraAPP::Generators.page_defs(@build.build_helper.page_defs);
    end
  end
end
