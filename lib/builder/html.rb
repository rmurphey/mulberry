require "lib/builder/task_base"

module Builder
  class HTML < Builder::TaskBase
    HTML_FILENAME = 'index.html'

    public
    def build
      @destination = File.join(@location, HTML_FILENAME)

      if build_required
        File.open(@destination, 'w') { |f| f.write html }
        @files = [ HTML_FILENAME ]
        true
      else
        false
      end
    end

    def report
      {
        :location => @location,
        :files => @files
      }
    end

    private
    def html
      TouraAPP::Generators.index_html(template_vars)
    end

    def build_required
      !File.exists? @destination
    end

    def template_vars
      vars = {
        :device_type          =>  @target['device_type'] || nil,
        :include_phonegap     =>  true
      }

      if @build.build_helper.respond_to? 'html_vars'
        vars.merge! @build.build_helper.html_vars
      end

      vars
    end
  end
end
