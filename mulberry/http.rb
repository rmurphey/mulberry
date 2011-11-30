module Mulberry
  module Http
    class Exception < StandardError; end

    [ 'NotFound', 'ServiceUnavailable', 'ConnectionRefused' ].each do |error_type|
      module_eval %Q{ class #{error_type} < Mulberry::Http::Exception; end}
    end

    def self.wrap(err_msgs)
      begin
        res = yield
      rescue Errno::ECONNREFUSED
        raise ConnectionRefused.new (err_msgs[ConnectionRefused] || "Can't connect to server.")
      end
      case res.code
      when "200"
        # do nothing
      when "404"
        msg = err_msgs["404"] || err_msgs[404] || err_msgs[NotFound] || "Resource not found."
        raise NotFound.new msg
      when "503"
        msg = err_msgs["503"] || err_msgs[503] || err_msgs[ServiceUnavailable] || "Resource unavailable."
        raise ServiceUnavailable.new msg
      else
        if err_msgs["default"]
          msg = err_msgs["default"].call(res)
        else
          msg = "Could not successfully complete http operation.  Response (#{res.code}): #{res.body}"
        end
        raise msg
      end
      res
    end

  end
end