require 'integration/kitchensink/spec_helper'

include CapybaraSpecHelper

describe "Background Images", :type => :request do
  it "should show the background image on the home page" do
    DEVICES.each do |d|
      visit "/#{d[:os]}/#{d[:type]}/#/home"
      find('.screen.index')['style'].should include "/#{d[:os]}/#{d[:type]}/media/images/bangs.jpg"
    end
  end
end
