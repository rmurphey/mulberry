require 'spec_helper'

shared_examples_for "all demo apps" do
  describe "Demo app page smoke test", :type => :request do

    $app.should_not == nil

    DEVICES.each do |d|
      $app.data[:items].each do |item|

        it "should render node #{item[:id]} for #{d[:os]}/#{d[:type]}" do
          visit "/#{d[:os]}/#{d[:type]}/#/node/#{item[:id]}"

          page.should have_css ".page-#{item[:id]}"
        end if item[:type] == 'node'

      end
    end
  end
end