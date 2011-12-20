require 'spec_helper'

shared_examples_for "all demo apps" do
  describe "Demo app page smoke test", :type => :request do

    $app.should_not == nil
    $templates.should_not == nil
    p $templates

    DEVICES.each do |d|
      $app.data[:items].each do |item|

        if item[:type] == 'node'
          node_page_controller = item[:pageController][d[:type]]

          if node_page_controller != 'locations-map'
            config = $templates[node_page_controller.to_s]
            # p config

            it "should render node #{item[:id]} for #{d[:os]}/#{d[:type]}" do
              visit "/#{d[:os]}/#{d[:type]}/#/node/#{item[:id]}"

              page.should have_css ".page-#{item[:id]}"
            end
          else
            puts "SKIPPING NODE #{item[:id]} - pageController = 'locations-map'"
          end
        end

      end
    end
  end
end
