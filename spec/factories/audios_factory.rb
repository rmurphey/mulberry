require 'tmpdir'
require 'assets/image'

include Mulberry::Asset

FactoryGirl.define do
  factory :audio do
    asset "foo.mp3"
    parent_assets_dir Dir.mktmpdir
  end

  factory :audio_remote, :parent => :audio do
    asset "http://mulberry.com/foo.mp3"
  end

end