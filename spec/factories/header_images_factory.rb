require 'assets/header_image'

include Mulberry::Asset

FactoryGirl.define do
  factory :header_image do
    asset "foo.jpg"
    parent_assets_dir Dir.mktmpdir
  end
end
