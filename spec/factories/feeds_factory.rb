require 'tmpdir'
require 'assets/feed'

include Mulberry::Asset

FactoryGirl.define do
  factory :feed do
    asset 'foo.yml'
    parent_assets_dir do
      parent_dir = nil
      FakeFS do
        parent_dir = Dir.mktmpdir
        feeds_dir = File.join(parent_dir, 'feeds')
        FileUtils.mkdir feeds_dir
        File.open File.join(feeds_dir, 'foo.yml'), 'w' do |f|
          f.write({
            'feed_url' => 'http://techcrunch.com/feed'
          }.to_yaml)
        end
      end
      parent_dir
    end
  end

end
