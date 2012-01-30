require 'tmpdir'

FactoryGirl.define do
  factory :feed, :class => Mulberry::Asset::Feed do
    asset 'foo.yml'
    parent_assets_dir do
      parent_dir = nil
      parent_dir = Dir.mktmpdir
      feeds_dir = File.join(parent_dir, 'feeds')
      FileUtils.mkdir feeds_dir
      File.open File.join(feeds_dir, 'foo.yml'), 'w' do |f|
        f.write({
          'feed_url' => 'http://techcrunch.com/feed'
        }.to_yaml)
      end
      parent_dir
    end
  end

end
