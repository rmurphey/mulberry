require 'assets/background_image'

include Mulberry::Asset

FactoryGirl.define do
  factory :background_image do
    asset "foo.jpg"
    parent_assets_dir Dir.mktmpdir
  end
end

