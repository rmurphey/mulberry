require 'cli/commands/spec_helper.rb'
require 'fakeweb'

describe Mulberry::Command::PublishOta do
  include Mulberry::Command::SpecHelpers

  describe '#initialize' do

    after :each do
      FakeWeb.clean_registry
    end

    it "should print error messages in a friendly manner" do
      config_path = File.join(Dir.pwd, @app.name, "config.yml")
      config = YAML::load( File.open(config_path) )
      config['ota'] = { 'enabled' => true }
      config['toura_api'] = {
        'url' => 'https://myapi.com',
        'key' => 'some_key'
      }
      File.open(config_path, 'w') { |f| f.write(config.to_yaml) }

      ["404", "503"].each do |status|
        [:get, :post].each do |method|
          FakeWeb.register_uri(method, //, :status => status)
        end
        FakeWeb.register_uri(:post, //, :status => status)
        stdout = capture_io_streams(:stdout) do
          lambda { Mulberry::Command::PublishOta.new([@app.name]) }.should_not raise_error
        end
        stdout.should match /error/i
      end
    end
  end
end