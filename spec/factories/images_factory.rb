require 'tmpdir'
require 'assets/image'

include Mulberry::Asset

FactoryGirl.define do
  factory :image do
    asset "foo.jpg"
    parent_assets_dir Dir.mktmpdir
  end

  factory :image_remote, :parent => :image do
    asset "http://mulberry.com/foo.jpg"
  end

end