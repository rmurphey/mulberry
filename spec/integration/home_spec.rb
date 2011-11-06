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

  describe "smoke test" do
    pages = [
      "Audio List",
      "Image Gallery",
      "Fullscreen Image Gallery",
      "Feed List",
      "Locations Page",
      "Location Map",
      "Videos Page",
      "Grid"
    ]

    it "should display links to its child pages" do
      visit '/'
      pages.each { |title| page.should have_content title }
    end

    it "should allow navigation to each of its child pages" do
      pages.each do |title|
        visit '/'
        click_link title
        page.should have_content title
      end
    end
  end
end
