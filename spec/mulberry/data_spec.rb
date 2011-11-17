require 'spec_helper'
require 'content_creator'

describe Mulberry::Data do
  before :each do
    @source_dir = 'testapp'

    Mulberry::App.scaffold(@source_dir, true)

    sitemap = [
      {
        'home' => [
          'foo',
          'bar',
          'featured_image_page',
          'no_text_page'
        ]
      },
      'about'
    ]

    @pages = sitemap.map do |item|
      if item.is_a?(Hash)
        [ item.keys, item.values ]
      else
        item
      end
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
end
