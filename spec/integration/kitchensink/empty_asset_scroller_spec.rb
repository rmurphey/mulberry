require 'integration/kitchensink/spec_helper'

include CapybaraSpecHelper

describe "Empty Pages", :type => :request do
  it "should be able to navigate to a videos page with no videos" do
    DEVICES.each do |d|
      visit "/#{d[:os]}/#{d[:type]}/#/node/node-empty_videos"
      page.should have_content "page body"
    end
  end

  it "an audios page with no audios should fully render" do
    DEVICES.each do |d|
      visit "/#{d[:os]}/#{d[:type]}/#/node/node-empty_audio_with_images"
      page.should_not have_css "div.spinner"
    end
  end
end
