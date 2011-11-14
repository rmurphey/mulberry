require 'integration/twitter/spec_helper'

include CapybaraSpecHelper

describe "Twitter Smoke Test", :type => :request do
  it_should_behave_like "all demo apps"
end

describe "Twitter demo smoke test", :type => :request do
  DEVICES.each do |d|
    it "should boot the twitter demo app" do
      visit "/#{d[:os]}/#{d[:type]}/#/home"
      page.should have_css '.component.latest-tweet'
    end

    it "should display the dynamic page" do
      visit "/#{d[:os]}/#{d[:type]}/#/twitter/touradev"
      page.should have_content 'touradev'
      page.should have_css '.component.tweets'
    end
  end
end
