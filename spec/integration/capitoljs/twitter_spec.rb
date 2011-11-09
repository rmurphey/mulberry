require 'integration/capitoljs/spec_helper'

include CapybaraSpecHelper

describe "Twitter", :type => :request do
  DEVICES.each do |d|
    it "should have the required components for #{d[:os]}/#{d[:type]}" do
      visit "/#{d[:os]}/#{d[:type]}/#/node/node-twitter"

      %w{
        page-nav
        twitter
      }.each do |component|
        page.should have_css ".component.#{component}"
      end
    end
  end

end

