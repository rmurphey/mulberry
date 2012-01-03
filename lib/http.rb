require 'net/http'

module Mulberry
  module Http
    class Exception < StandardError; end

    [ 'ConnectionRefused', 'NotFound', 'ServiceUnavailable', 'BadRequest' ].each do |error_type|
      module_eval %Q{ class #{error_type} < Mulberry::Http::Exception; end}
    end

    def self.fetch(uri_str, limit = 10, warn_on_redirect=false)
      raise 'too many HTTP redirects' if limit == 0

      response = Net::HTTP.get_response(URI(uri_str))

      case response
      when Net::HTTPRedirection then
        location = response['location']
        warn "redirected to #{location}" if warn_on_redirect
        fetch(location, limit - 1)
      else
        response
      end
    end

    def self.wrap(err_msgs)
      begin
        res = yield
      rescue Errno::ECONNREFUSED
        raise ConnectionRefused.new(err_msgs[ConnectionRefused] || "Can't connect to server.")
      end
      case res.code
      when "200"
        # do nothing
      when "400"
        msg = err_msgs["400"] || err_msgs[400] || err_msgs[BadRequest] || "Bad request."
        raise NotFound.new msg
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