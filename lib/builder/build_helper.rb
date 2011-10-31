module Builder
  module BuildHelper
    def self.included(base)
      base.send(:attr_accessor, :build)
    end

    %w(before_steps after_steps bundle_dir_name zip_name project_settings config_settings data).each do |method|
      module_eval %Q{
        def #{method}() raise "Must implement ##{method}"; end
      }
    end

    %w(assets css icons load_screens).each do |method|
      module_eval %Q{
        def #{method}(destination, report) raise "Must implement ##{method}(destination, report)"; end
      }
    end

    def app_id(device_os, device_type)
      raise "Must implement app_id(device_os, device_type)"
    end

    def custom_js_source
      nil
    end

    private
    def padded_id
      # id's in iOS must be at least 2 characters :/
      "%02d" % project_settings[:id]
    end
  end
end
