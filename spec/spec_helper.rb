$: << File.expand_path('../', __FILE__)
$: << File.expand_path('../..', __FILE__)

require 'cli/mulberry'
require 'builder'
require 'factory_girl'
require 'fakefs/spec_helpers'
require 'capybara/rspec'

FIXTURES_DIR = File.join(File.dirname(__FILE__), 'fixtures')

Dir[File.dirname(__FILE__) + "/support/**/*.rb"].each {|f| require f}
Dir.glob(File.dirname(__FILE__) + "/factories/*").each do |factory|
  begin
    require factory
  rescue
    nil
  end
end

# Allow us to specify fakefs: true in specs to automagically include the spec helpers
RSpec.configure do |config|
  config.include FakeFS::SpecHelpers, :fakefs => true
end

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
Capybara.default_driver   = :selenium
Capybara.default_selector = :css

def serve_demo(demo_name)
  $app = Mulberry::App.new("./demos/#{demo_name}")
  $page_defs = $app.helper.page_defs

  Mulberry::Server.set :app => $app, :logging => false
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

# credit for the below goes to http://rails-bestpractices.com/questions/1-test-stdin-stdout-in-rspec
require 'stringio'
def capture_io_streams(*streams)
  streams.map! { |stream| stream.to_s }
  begin
    result = StringIO.new
    streams.each { |stream| eval "$#{stream} = result" }
    yield
  ensure
    streams.each { |stream| eval("$#{stream} = #{stream.upcase}") }
  end
  result.string
end
