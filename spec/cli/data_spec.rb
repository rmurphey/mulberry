require 'fakeweb'
require 'spec_helper'
require 'content_creator'

describe Mulberry::Data do
  before :each do
    @source_dir = 'testapp'

    Mulberry::App.scaffold(@source_dir, true)

    sitemap = [
      {
        'home' => [
          { 'foo' => [ 'baz', 'bim' ] },
          'bar',
          'featured_image_page',
          'no_text_page',
          'custom_prop_page',
          'built_in_props_page',
          'no_page_def_page'
        ]
      },
      'about'
    ]

    @pages = []

    def process(item)
      if item.is_a?(Hash)
        item.values.first.map { |child| process child }
        @pages << item.keys.first
      else
        @pages << item
      end
    end

    sitemap.each do |item|
      process item
    end.flatten

    File.open File.join(@source_dir, 'sitemap.yml'), 'w' do |f|
      f.write sitemap.to_yaml
    end

    # Scaffold creates home and about for us automagically
    @pages.reject{|p| %w(home about).include? p}.each do |page|
      Mulberry::ContentCreator.new('page', @source_dir, page)
    end

    [
      'featured_image_page',
      'no_text_page',
      'custom_prop_page',
      'no_page_def_page'
    ].each do |f|
      FileUtils.cp(
        File.join(FIXTURES_DIR, "#{f}.md"),
        File.join(@source_dir, 'pages'),
        { :preserve => false }
      )
    end

    # /cli/assets/image.rb requires the image to exist on disk, so copy it in
    # featured_image_page has a hard-coded reference to the sample image
    FileUtils.cp(
      SampleFiles.get_sample_image,
      File.join(@source_dir, 'assets', 'images' )
    )

    @data = (Mulberry::Data.new Mulberry::App.new(@source_dir)).generate
  end

  after :each do
    FileUtils.rm_rf @source_dir
  end

  it "should generate a data object" do
    @data[:items].should_not be_nil
    @data[:app].should_not be_nil
  end

  it "should properly place the pages in the data" do
    @pages.each do |page|
      @data[:items].select { |item| item[:id] == "node-#{page}" }.length.should be 1
    end
  end

  it "should properly assign parents to pages" do
    @data[:items].select do |item|
      item[:id] == 'node-foo'
    end.first[:parent]['_reference'].should == 'node-home'

    @data[:items].select do |item|
      item[:id] == 'node-baz'
    end.first[:parent]['_reference'].should == 'node-foo'
  end

  it "should generate a page with a featured image" do
    @data[:items].select do |item|
      item[:id] == 'node-featured_image_page'
    end.length.should be 1
  end

  it "should generate a page with a custom property" do
    pg = @data[:items].select do |item|
      item[:id] == 'node-custom_prop_page'
    end

    pg.length.should be 1
    pg.first[:custom]['foo'].should == 'bar'
  end

  it "should create featured image nodes with the proper structure" do
    @data[:items].select do |item|
      item[:id] == 'node-featured_image_page'
    end.first[:featuredImage][:image]['_reference'].should_not be nil
  end

  it "should properly create contexts" do
    c = @data[:items].select do |item|
      item[:id] == 'text-asset-featured_image_page'
    end.first[:contexts]

    c.length.should be 1

    c.select do |item|
      item[:node] == 'node-featured_image_page'
    end.length.should be 1
  end

  it "should create api keys" do
    @data[:app].has_key?('facebookApiKey').should be_true
    @data[:app].has_key?('facebook_api_key').should be_false
    @data[:app].has_key?('twitterCustomerKey').should be_true
    @data[:app].has_key?('twitterCustomerSecret').should be_true
  end

  describe "page with built-in properties" do
    before :each do
      built_in_props_page = {
        'title'      =>  'Built-in props',
        'template'   =>  'default',
        'videos'     =>  [ 'video1.mp4' ],
        'audios'     =>  [ 'audio1.mp3' ],
        'images'     =>  [ 'image1.png' ],
        'data'       =>  [ 'data.yml' ],
        'feeds'      =>  [ 'feed.yml' ],
        'locations'  =>  [ 'location.yml' ],

        'featured_image'    =>  'featured_image.png',
        'background_image'  =>  'background_image.png',
        'header_image'      =>  'header_image.png'
      }

      File.open(File.join(@source_dir, 'pages', 'built_in_props_page.md'), 'w') do |f|
        f.write built_in_props_page.to_yaml
        f.write "---\n"
      end

      %w{videos audios images}.each do |a|
        built_in_props_page[a].each { |f| FileUtils.touch File.join(@source_dir, 'assets', a.to_s, f) }
      end

      # If the images don't exist, the image instantiation in Data will asplode
      %w{featured background header}.each do |i|
        FileUtils.touch File.join(@source_dir, 'assets', 'images', "#{i}_image.png")
      end

      Mulberry::ContentCreator.new 'feed', @source_dir, 'feed'
      Mulberry::ContentCreator.new 'location', @source_dir, 'location'
      Mulberry::ContentCreator.new 'data', @source_dir, 'data'

      @data = (Mulberry::Data.new Mulberry::App.new(@source_dir)).generate
    end

    it "should have all the built-in properties on the node object" do
      page = @data[:items].select do |item|
        item[:id] == 'node-built_in_props_page'
      end.first

      page[:audios].length.should == 1
      page[:videos].length.should == 1
      page[:images].length.should == 1
      page[:dataAssets].length.should == 1
      page['googleMapPins'.to_sym].length.should == 1
      page[:feeds].length.should == 1

      page[:featuredImage].should be_a Hash
      page[:phoneBackgroundImage].should be_a Hash
      page[:tabletBackgroundImage].should be_a Hash
      page[:phoneHeaderImage].should be_a Hash
      page[:tabletHeaderImage].should be_a Hash
    end

    it "should create references to objects for items assigned to built-in properties" do
      page = @data[:items].select do |item|
        item[:id] == 'node-built_in_props_page'
      end.first

      page[:audios].first[:audio]['_reference'].should == 'audio-audio1'
      page[:videos].first[:video]['_reference'].should == 'video-video1'
      page[:images].first[:image]['_reference'].should == 'image-image1'
      page[:dataAssets].first[:dataAsset]['_reference'].should == 'data-asset-data'
      page[:feeds].first[:feed]['_reference'].should == 'feed-feed'
      page['googleMapPins'.to_sym].first['googleMapPin'.to_sym]['_reference'].should == 'google-map-pin-location'

      page[:featuredImage][:image]['_reference'].should == 'image-featured_image'
      page[:phoneBackgroundImage]['_reference'].should == 'image-background_image'
      page[:tabletBackgroundImage]['_reference'].should == 'image-background_image'
      page[:phoneHeaderImage]['_reference'].should == 'image-header_image'
      page[:tabletHeaderImage]['_reference'].should == 'image-header_image'
    end

    it "should create the objects for items assigned to built-in properties" do
      %w{
        audio-audio1
        video-video1
        image-image1
        data-asset-data
        feed-feed
        image-featured_image
        image-background_image
        image-header_image
      }.each do |asset_id|
        @data[:items].select { |item| item[:id] == asset_id.strip }.length.should == 1
      end
    end
  end

  describe 'page without a page def' do
    it "should still have a pageController property in the data" do
      pc = @data[:items].select do |item|
        item[:id] == 'node-no_page_def_page'
      end.first[:pageController]

      pc['phone'].should == 'default'
      pc['tablet'].should == 'default'
    end
  end

  describe 'version handling' do
    before :each do
      @app = Mulberry::App.new(@source_dir)
      @app.config['toura_api'] = {
        'url' => 'http://myapi.com', 'key' => 'some_key'
      }
    end

    after :each do
      FakeWeb.clean_registry
    end

    it 'should not output a version unless told to' do
      @data = (Mulberry::Data.new @app).generate
      @data['version'].should be_nil
    end

    it 'should raise exception when trying to include version but ota server unavailable' do
      FakeWeb.register_uri(:get, //, :status => "503")
      lambda do
        @data = (Mulberry::Data.new @app).generate true
      end.should raise_error Mulberry::Http::ServiceUnavailable
    end

    it 'should include correct version when found on ota server' do
      existing_version = 10
      FakeWeb.register_uri(:get, //, :body => "{\"version\": #{existing_version}}")
      @app.config['toura_api'] = {
        'url' => 'http://myapi.com', 'key' => 'some_key'
      }
      @data = (Mulberry::Data.new @app).generate true
      @data['version'].should == existing_version + 1
    end

    it 'should raise exception if asked to include version but no toura api config' do
      @app.config.delete 'toura_api'
      lambda do
        (Mulberry::Data.new Mulberry::App.new(@source_dir)).generate true
      end.should raise_error Builder::ConfigurationError
    end

  end

end
