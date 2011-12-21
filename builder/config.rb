require "builder/task_base"

module Builder
  class Config < Builder::TaskBase
    CONFIG_FILENAME = 'TouraConfig.js'

    public
    def build
      @destination = File.join(@location, CONFIG_FILENAME)
      File.open(@destination, 'w') { |f| f.write config }
      true
    end

    def report
      {
        :location   => @location,
        :files      => [ CONFIG_FILENAME ]
      }
    end

    private
    def config
      os = @target['device_os'] || 'ios'
      type = @target['device_type'] || 'phone'

      if @target['device_os'].nil? || @target['device_type'].nil?
        @build.log("Using default device types", 'warning')
      end

      settings = @build.build_helper.config_settings.merge({
        'debug' => !!@target['development']
      })

      TouraAPP::Generators.config(@target['device_os'], @target['device_type'], settings)
    end

  end

end
