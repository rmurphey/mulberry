require 'spec_helper'

include CapybaraSpecHelper

describe "Home", :type => :request do
  it "should have child node links" do
    visit '/'

    [
      :audio_list, :image_gallery, :fullscreen_images, :feed_list, :locations,
      :location_map, :videos, :grid
    ].each do |child_link|
      page.should have_css "li a[href$=#{child_link}]"
    end

    click_link "Audio List"
    page.should have_css ".audio-player audio[src*='media/audios']"
  end
end