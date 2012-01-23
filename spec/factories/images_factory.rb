require 'tmpdir'

FactoryGirl.define do
  factory :image, :class => Mulberry::Asset::Image do
    asset             SampleFiles.get_sample_image
    parent_assets_dir SampleFiles.parent_assets_dir
    after_build{
      require 'fakefs'
      FakeFS::FileSystem.clone(SampleFiles.get_sample_image)
    }
  end

  factory :image_remote, :parent => :image do
    asset do
      # This require fails if added to 'after_build', so we need to do this here...
      require 'fakeweb'
      SampleFiles.get_sample_image_url
    end
    after_build {

      stream = File.open(SampleFiles.get_sample_image, 'rb')
      file_data = stream.read

      FakeWeb.register_uri(:get, SampleFiles.get_sample_image_url, :status => ["200", "OK"], :content_type => 'image/jpeg', :body => file_data)
    }
  end
end
