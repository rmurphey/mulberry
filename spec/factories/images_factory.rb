require 'tmpdir'
require 'assets/image'

include Mulberry::Asset

FactoryGirl.define do
  factory :image do
    asset             SampleFiles.get_sample_image
    parent_assets_dir SampleFiles.parent_assets_dir
  end

  factory :image_remote, :parent => :image do
    asset SampleFiles.get_sample_image_url
  end
end
