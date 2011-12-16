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
          'built_in_props_page'
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
      'custom_prop_page'
    ].each do |f|
      FileUtils.cp(
        File.join(FIXTURES_DIR, "#{f}.md"),
        File.join(@source_dir, 'pages'),
        { :preserve => false }
      )
    end

    built_in_props_page = {
      'title'      =>  'Built-in props',
      'template'   =>  'default',
      'videos'     =>  [ 'video1.mp4' ],
      'audios'     =>  [ 'audio1.mp3' ],
      'images'     =>  [ 'image1.png' ],
      'data'       =>  [ 'data.yml' ],
      'feeds'      =>  [ 'feed.yml' ],
      'locations'  =>  [ 'location.yml' ],

      'featured_image'   =>  'featured_image.png',
      'background_image' =>  'background_image.png'
    }

    File.open(File.join(@source_dir, 'pages', 'built_in_props_page.md'), 'w') do |f|
      f.write built_in_props_page.to_yaml
      f.write "---\n"
    end

    %w{videos audios images}.each do |a|
      built_in_props_page[a].each { |f| FileUtils.touch File.join(@source_dir, 'assets', a.to_s, f) }
    end

    Factory.build :data, :asset => 'data.yml', :parent_assets_dir => File.join(@source_dir, 'assets')
    Factory.build :feed, :asset => 'feed.yml', :parent_assets_dir => File.join(@source_dir, 'assets')
    Factory.build :location, :asset => 'location.yml', :parent_assets_dir => File.join(@source_dir, 'assets')

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
    it "should have all the built-in properties on the node object" do
      page = @data[:items].select do |item|
        item[:id] == 'node-built_in_props_page'
      end.first

      page[:audios].should be_defined
    end
  end

end
