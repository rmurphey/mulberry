require 'spec_helper'
require 'fakeweb'
require 'mulberry/build_helper'

describe 'Mulberry build helper' do
  before :each do
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
          'ota' => { 'enabled' => false}
        }
      })
      config_settings  = @build_helper.config_settings
      ['version_url', 'update_url'].each do |name|
        config_settings[name].should be_nil
      end
    end

    it 'should not output version_url and update_url with ota disabled' do
      @build_helper.build = Builder::Build.new({
        :target_config => {
          'build_type' => 'mulberry',
          'ota' => { 'enabled' => true }
        }
      })
      config_settings  = @build_helper.config_settings
      ['version_url', 'update_url'].each do |name|
        config_settings[name].should match /^http/
      end
    end

  end

end