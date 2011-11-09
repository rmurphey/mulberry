require 'integration/capitoljs/spec_helper'

include CapybaraSpecHelper

describe "Home Capitol JS", :type => :request do
  DEVICES.each do |d|
    it "should have the required components for #{d[:os]}/#{d[:type]}" do
      visit "/#{d[:os]}/#{d[:type]}/#/home"

      %w{
        body-text
        child-nodes
        app-nav
      }.each do |component|
        page.should have_css ".component.#{component}"
      end
    end
  end

end

