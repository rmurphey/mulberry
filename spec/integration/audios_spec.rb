require 'spec_helper'

include CapybaraSpecHelper

describe "Audios", :type => :request do
  DEVICES.each do |d|
    it "should have the required components for #{d[:os]}/#{d[:type]}" do
      visit "/#{d[:os]}/#{d[:type]}/#/node/node-audio_list"

      %w{
        page-nav
        image-gallery
        audio-player
        audio-list
        child-nodes
        audio-caption
        image-caption
        body-text
        detail-title
        zoomable-image-gallery
      }.each do |component|
        page.should have_css ".component.#{component}"
      end
    end
  end

end

