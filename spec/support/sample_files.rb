require 'fakeweb'

module SampleFiles
  def self.get_sample_image(file_name = 'white_pixel.jpg')
    File.join(FIXTURES_DIR, 'images', file_name)
  end

  def self.get_sample_image_url()
    'http://mulberry.toura.com/white_pixel.jpg'
  end

  def self.parent_assets_dir
    FIXTURES_DIR
  end
end

stream = File.open(SampleFiles.get_sample_image, 'rb')
file_data = stream.read

FakeWeb.register_uri(:get, SampleFiles.get_sample_image_url, :status => ["200", "OK"], :content_type => 'image/jpeg', :body => file_data)
