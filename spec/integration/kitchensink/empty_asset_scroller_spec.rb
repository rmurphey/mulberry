require 'integration/kitchensink/spec_helper'

include CapybaraSpecHelper

describe "Empty Pages", :type => :request do
  it "an audios page with no audios should fully render" do
    DEVICES.each do |d|
      visit "/#{d[:os]}/#{d[:type]}/#/node/node-empty_audio_with_images"
      page.should have_css ".ad-tag"
    end
  end
end
