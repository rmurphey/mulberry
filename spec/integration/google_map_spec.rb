require 'spec_helper'

include CapybaraSpecHelper

describe "Google Map", :type => :request do
  DEVICES.each do |d|
    it "should have the required components for #{d[:os]}/#{d[:type]}" do
      visit "/#{d[:os]}/#{d[:type]}/#/node/node-location_map"

      %w{
        page-nav
        google-map
        pin-info
      }.each do |component|
        page.should have_css ".component.#{component}"
      end
    end
  end

end

