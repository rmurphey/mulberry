require 'mulberry/commands/spec_helper.rb'

describe Mulberry::Command::Generate do
  include Mulberry::Command::SpecHelpers
  before do
    @app_name = 'fooapp'

    Dir.chdir Mulberry::Directories.root
    FileUtils.rm_rf @app_name
    Mulberry::Command::Scaffold.new([@app_name])
  end

  it "should create any nonexistent pages in the sitemap" do
    Dir.chdir @app_name
    File.open('sitemap.yml', 'a') do |f|
      f.write "\n- fake_page"
    end
    Mulberry::Command::Generate.new
    File.exists?(File.join('pages', 'fake_page.md')).should be_true
  end

  it "should not create any pages that already exist" do
    Dir.chdir @app_name
    File.open('sitemap.yml', 'a') do |f|
      f.write "\n- existing_page"
    end
    File.open(File.join('pages', 'existing_page.md'), 'w') do |f|
      f.write 'existing page'
    end
    Mulberry::Command::Generate.new
    File.exists?(File.join('pages', 'existing_page.md')).should be_true
    File.read(File.join('pages', 'existing_page.md')).should include 'existing page'
  end

  it "should scaffold pages with full path" do
    File.open(File.join(@app_name, 'sitemap.yml'), 'a') do |f|
      f.write "\n- fake_page"
    end
    Mulberry::Command::Generate.new(["#{Dir.pwd}/#{@app_name}"])
    File.exists?(File.join(@app_name, 'pages', 'fake_page.md')).should be_true
  end
end

