require 'tmpdir'

FactoryGirl.define do
  factory :video, :class => Mulberry::Asset::Video do
    asset "foo.mp4"
    parent_assets_dir Dir.mktmpdir
  end

  factory :video_with_poster, :parent => :video do
    parent_assets_dir do
      parent_dir = nil
      parent_dir = Dir.mktmpdir

      poster_dir = File.join(parent_dir, 'videos', 'posters')

      FileUtils.mkdir_p poster_dir
      FileUtils.touch File.join(poster_dir, "foo.jpg")
      parent_dir
    end
  end

  factory :video_remote, :parent => :video do
    asset "http://mulberry.com/foo.mp4"
  end

end
