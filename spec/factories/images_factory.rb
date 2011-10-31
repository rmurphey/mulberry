require 'tmpdir'
require 'assets/image'

include Mulberry::Asset

FactoryGirl.define do
  factory :image do
    asset "foo.jpg"
    parent_assets_dir Dir.mktmpdir
  end

end