$: << File.expand_path('../', __FILE__)
$: << File.expand_path('../..', __FILE__)

require 'mulberry/mulberry'
require 'lib/builder'
require 'factory_girl'

Dir[File.dirname(__FILE__) + "/support/**/*.rb"].each {|f| require f}

Dir.glob(File.dirname(__FILE__) + "/factories/*").each do |factory|
  begin
    require factory
  rescue
    nil
  end
end

require 'capybara/rspec'

b = Builder::Build.new({
  :target => 'app_development',
  :log_level => -1,
  :force_js_build => false
})
b.build
b.cleanup

# Swap to chrome
Capybara.register_driver :selenium do |app|
  Capybara::Selenium::Driver.new(app, :browser => :chrome)
end

# setup capybara on selenium
Capybara.default_driver = :selenium
Capybara.default_selector = :css

def serve_demo(demo_name)
  Mulberry::Server.set :app => Mulberry::App.new("./demos/#{demo_name}"), :logging => false
  Capybara.app = Mulberry::Server
end

module CapybaraSpecHelper
  def pause
    print "Press Return to continue..."
    STDIN.getc
  end
end

DEVICES = [
  { :type => 'phone', :os => 'ios' },
  { :type => 'phone', :os => 'android' },
  { :type => 'tablet', :os => 'ios' }
]
