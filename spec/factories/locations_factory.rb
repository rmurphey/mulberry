require 'assets/location'
require 'yaml'
require 'fakefs/safe'

include Mulberry::Asset

FactoryGirl.define do
  factory :location do
    asset "foo.yml"
    parent_assets_dir do
      parent_dir = nil
      FakeFS do
        parent_dir = Dir.mktmpdir
        locations_dir = File.join(parent_dir, 'locations')
        FileUtils.mkdir locations_dir
        File.open File.join(locations_dir, 'foo.yml'), 'w' do |f|
          f.write({
            'name' => 'Cafe Asia',
            'lat' => 38.894448,
            'lon' => -77.076119,
            'address' => '1500 Wilson Blvd. #100, Arlington, VA',
            'caption' => 'Closing party'
          }.to_yaml)
        end
      end
      parent_dir
    end
  end

end