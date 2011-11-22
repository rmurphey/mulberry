require "lib/builder/task_base"

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

      add_ota_settings settings

      TouraAPP::Generators.config(@target['device_os'], @target['device_type'], settings)
    end

    def add_ota_settings(settings)
      config = @target['tour'].config
      if @target['ota'] and @target['ota']['enabled']
        @build.log "Adding ota settings to #{CONFIG_FILENAME}"
        if config['version_url']
          settings.merge!(
            'update_url'  =>  config['version_url'],
            'version_url' =>  config['update_url']
          )
        elsif config['toura_api']
          host = config['toura_api']['host'] || 'api.toura.com'
          url_base = "http://#{host}"
          key = config['toura_api']['key']
          settings.merge!(
            'update_url'  =>  File.join(url_base, "/applications/#{key}/ota_service/data_json"),
            'version_url' =>  File.join(url_base, "/applications/#{key}/ota_service/version_json")
          )
        else
          raise "Must configure toura_api credentials or version_url and update_url manually."
        end
      end
    end

  end

end
