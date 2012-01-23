require 'tmpdir'

FactoryGirl.define do
  factory :audio, :class => Mulberry::Asset::Audio do
    asset "foo.mp3"
    parent_assets_dir Dir.mktmpdir
  end

  factory :audio_remote, :parent => :audio do
    asset "http://mulberry.com/foo.mp3"
  end

end