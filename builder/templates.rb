require 'builder/task_base'

module Builder
  class Templates < Builder::TaskBase
    TEMPLATES_FILENAME = 'templates.js'

    public
    def build
      @destination = File.join(@location, TEMPLATES_FILENAME)
      File.open(@destination, 'w') { |f| f.write templates }
      true
    end

    def report
      {
        :location => @location,
        :files => [ TEMPLATES_FILENAME ]
      }
    end

    private
    def templates
      TouraAPP::Generators.page_templates(@build.build_helper.templates);
    end
  end
end
