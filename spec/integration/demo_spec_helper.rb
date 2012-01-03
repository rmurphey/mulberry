require 'spec_helper'
require 'active_support/inflector'

shared_examples_for "all demo apps" do
  describe "Demo app page smoke test", :type => :request do

    $app.should_not == nil
    $templates.should_not == nil

    # these are components that remove themselves if there is no data for them
    # TODO: we should be smarter about this
    @ignored_components = [ 'PageHeaderImage', 'ChildNodes' ]

    DEVICES.each do |d|
      $app.data[:items].each do |item|

        if item[:type] == 'node'
          node_page_controller = item[:pageController][d[:type]] || 'default'

          if node_page_controller != 'locations-map'
            components = []
            config = $templates[node_page_controller.to_s]

            raise "No config for #{node_page_controller}" unless config

            config['screens'].each do |s|
              s['regions'].each do |r|
                r['components'].each do |c|
                  components << c.gsub!('custom.', '') unless @ignored_components.map { |str| c.match(str) }.length
                end unless !r['components']
              end
            end

            it "should render node #{item[:id]} for #{d[:os]}/#{d[:type]}" do
              visit "/#{d[:os]}/#{d[:type]}/#/node/#{item[:id]}"

              page.should have_css ".page-#{item[:id]}"

              components.each do |c|
                puts "checking for #{c}"
                page.should have_css ".component.#{c.underscore.dasherize.downcase}"
              end
            end
          else
            puts "SKIPPING NODE #{item[:id]} - pageController = 'locations-map'"
          end
        end

      end
    end
  end
end
