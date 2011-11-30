require 'spec_helper'
require 'content_creator'
require 'fakeweb'

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
          'no_text_page'
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

    @pages.each do |page|
      Mulberry::ContentCreator.new('page', @source_dir, page)
    end

    [
      'featured_image_page',
      'no_text_page'
    ].each do |f|
      FileUtils.cp(
        File.join(FIXTURES_DIR, "#{f}.md"),
        File.join(@source_dir, 'pages'),
        { :preserve => false }
      )
    end

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

  describe 'version handling' do
    after :each do
      FakeWeb.clean_registry
    end

    it 'should not output a version unless told to' do
      @data = (Mulberry::Data.new Mulberry::App.new(@source_dir)).generate
      @data['version'].should be_nil
    end

    it 'should raise exception when trying to include version but ota server unavailable' do
      FakeWeb.register_uri(:get, //, :status => "503")
      lambda do
        @data = (Mulberry::Data.new Mulberry::App.new(@source_dir)).generate true
      end.should raise_error Mulberry::Http::ServiceUnavailable
    end

    it 'should include default version when not found on ota server' do
      FakeWeb.register_uri(:get, //, :status => "404")
      default_version = 1
      @data = (Mulberry::Data.new Mulberry::App.new(@source_dir)).generate true, default_version
      @data['version'].should == default_version
    end

    it 'should include correct version when found on ota server' do
      existing_version = 10
      FakeWeb.register_uri(:get, //, :body => "{\"version\": #{existing_version}}")
      @data = (Mulberry::Data.new Mulberry::App.new(@source_dir)).generate true
      @data['version'].should == existing_version + 1
    end
  end

end
