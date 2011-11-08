require 'integration/twitter/spec_helper'

include CapybaraSpecHelper

describe "Twitter demo smoke test", :type => :request do
  it "should boot the twitter demo app" do
    visit '/'
    page.should have_css '.component.latest-tweet'
  end
end
