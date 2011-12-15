require 'tmpdir'
require 'assets/video'

include Mulberry::Asset

FactoryGirl.define do
  factory :video do
    asset "foo.mp4"
    parent_assets_dir Dir.mktmpdir
  end

  factory :video_with_poster, :parent => :video do
    Dir.mktmpdir poster_dir
    FileUtils.touch File.join(poster_dir, poster_filename)
  end

  factory :video_remote, :parent => :video do
    asset "http://mulberry.com/foo.mp4"
  end

end
