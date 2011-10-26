require 'lib/builder/task_base'

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
      build_templates = nil

      if @build.build_helper.respond_to? 'templates'
        build_templates = @build.build_helper.templates
      end

      TouraAPP::App.generate_page_templates(build_templates)
    end
  end
end
