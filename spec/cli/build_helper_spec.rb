require 'spec_helper'
require 'fakeweb'
require 'cli/build_helper'

describe 'Mulberry build helper' do
  before :each do
    FileUtils.rm_rf 'testapp'
    Mulberry::App.scaffold('testapp', true)
    @app = Mulberry::App.new 'testapp'
    @build_helper = Mulberry::BuildHelper.new @app
  end

  after :each do
    FileUtils.rm_rf 'testapp'
  end

  describe 'config settings' do

    it 'should not output version_url and update_url with ota disabled' do
      @build_helper.build = Builder::Build.new({
        :target_config => {
          'build_type' => 'mulberry',
          'ota' => { 'enabled' => false }
        }
      })
      config_settings  = @build_helper.config_settings
      ['version_url', 'update_url'].each do |name|
        config_settings[name].should be_nil
      end
    end

    it 'should output correct version_url and update_url with ota enabled' do
      api_config = @app.config['toura_api'] = {
        'url' => 'https://myapi.com',
        'key' => 'some_key'
      }
      @app.config['ota'] = { 'enabled' => 'true' }
      @build_helper.build = Builder::Build.new({
        :target_config => {
          'build_type' => 'mulberry',
          'ota' => { 'enabled' => true }
        },
        :build_helper => @build_helper
      })
      config_settings  = @build_helper.config_settings
      {
        'version_url' => 'version_json',
        'update_url' => 'data_json'
      }.each do |name, path|
        config_settings[name].should match /^#{api_config['url']}\/applications\/#{api_config['key']}\/ota_service\/#{path}/
      end
    end

    it 'should raise exception if ota enabled but not configured' do
      @app.config['ota'] = { 'enabled' => 'true' }
      @build_helper.build = Builder::Build.new({
        :target_config => {
          'build_type' => 'mulberry',
          'ota' => { 'enabled' => true }
        },
        :build_helper => @build_helper
      })
      lambda { @build_helper.config_settings }.should raise_error Builder::ConfigurationError
    end

  end

end