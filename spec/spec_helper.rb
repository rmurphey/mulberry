$: << File.expand_path('../', __FILE__)
$: << File.expand_path('../..', __FILE__)

require 'mulberry/mulberry'
require 'lib/builder'
require 'factory_girl'

Dir.glob(File.dirname(__FILE__) + "/factories/*").each do |factory|
  begin
    require factory
  rescue
    nil
  end
end

require 'capybara/rspec'

# Swap to chrome
Capybara.register_driver :selenium do |app|
  Capybara::Selenium::Driver.new(app, :browser => :chrome)
end

# setup capybara on selenium
Capybara.default_driver = :selenium
Capybara.default_selector = :css

b = Builder::Build.new({
  :target => 'app_development',
  :log_level => -1,
  :force_js_build => false
})
b.build
b.cleanup

Mulberry::Server.set :app => Mulberry::App.new("./demos/kitchensink")
Capybara.app = Mulberry::Server

module CapybaraSpecHelper
  def pause
    print "Press Return to continue..."
    STDIN.getc
  end
end