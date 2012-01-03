require 'json'
require 'lib/http'

class OtaServiceApplication

  attr_accessor :url, :key, :secret

  def initialize(url, key, secret=nil)
    self.url = url
    self.key = key
    self.secret = secret
  end

  def version
    res = Mulberry::Http.wrap Mulberry::Http::ConnectionRefused => "Can't connect to #{url}",
                              "503" => "#{url} is not available.",
                              "default" => lambda {|res|
                                "Could not retrieve version from #{url} (#{res.code}).  Response: #{res.body}"
                              } do
      Mulberry::Http.fetch URI.join(url, "/applications/#{key}/ota_service/version_json").to_s
    end
    JSON.parse(res.body)['version']
  end

  def publish(data_json)
    uri = URI(File.join(url, "/applications/#{key}/ota_service/publish"))
    res = Mulberry::Http.wrap Mulberry::Http::ConnectionRefused => "Can't connect to ota server: #{url}.",
                    "400" => "Data json is malformed.",
                    "404" => "Application with key #{key} not found on #{url}.",
                    "503" => "#{url} currently unavailable.  Please try again later.",
                    "default" => lambda { |res|
                      "Problem publishing OTA. Response (#{res.code}): #{res.body}"
                    } do
      Net::HTTP.post_form(uri, 'secret' => secret, 'data_json' => data_json, 'format' => 'json')
    end
    JSON.parse(res.body)['version']
  end

end