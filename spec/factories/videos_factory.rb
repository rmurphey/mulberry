require 'tmpdir'
require 'assets/image'

include Mulberry::Asset

FactoryGirl.define do
  factory :video do
    asset "foo.mp4"
    parent_assets_dir Dir.mktmpdir
  end

  factory :video_remote, :parent => :video do
    asset "http://mulberry.com/foo.mp4"
  end

end