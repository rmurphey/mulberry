require 'tmpdir'
require 'assets/image'
require 'fakeweb'

include Mulberry::Asset

FactoryGirl.define do
  factory :image do
    asset             SampleFiles.get_sample_image
    parent_assets_dir SampleFiles.parent_assets_dir
    after_build{
      require 'fakefs'
      FakeFS::FileSystem.clone(SampleFiles.get_sample_image)
    }
  end

  factory :image_remote, :parent => :image do
    asset SampleFiles.get_sample_image_url
    after_build{

      stream = File.open(SampleFiles.get_sample_image, 'rb')
      file_data = stream.read

      FakeWeb.register_uri(:get, SampleFiles.get_sample_image_url, :status => ["200", "OK"], :content_type => 'image/jpeg', :body => file_data)
    }
  end
end
