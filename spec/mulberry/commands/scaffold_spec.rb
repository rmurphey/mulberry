require 'mulberry/commands/spec_helper.rb'

describe Mulberry::Command::Create do
  include Mulberry::Command::SpecHelpers

  describe '#initialize' do
    before :each do
      @app_name = 'fooapp'

      Dir.chdir Mulberry::Directories.root
      FileUtils.rm_rf @app_name
    end

    after :each do
      FileUtils.rm_rf @app_name
    end

    it "should initalize" do
      Mulberry::Command::Scaffold.new([@app_name])
    end

    it "should initalize with full path" do
      Mulberry::Command::Scaffold.new(["#{Dir.pwd}/#{@app_name}"])
    end

    it "should create any nonexistent pages in the sitemap" do
      Mulberry::Command::Scaffold.new([@app_name])
      Dir.chdir @app_name
      File.open('sitemap.yml', 'a') do |f|
        f.write "\n- fake_page"
      end
      Mulberry::Command::Scaffold.new
      File.exists?(File.join('pages', 'fake_page.md')).should be_true
    end

    it "should not create any pages that already exist" do
      Mulberry::Command::Scaffold.new([@app_name])
      Dir.chdir @app_name
      File.open('sitemap.yml', 'a') do |f|
        f.write "\n- existing_page"
      end
      File.open(File.join('pages', 'existing_page.md'), 'w') do |f|
        f.write 'existing page'
      end
      Mulberry::Command::Scaffold.new
      File.exists?(File.join('pages', 'existing_page.md')).should be_true
      File.read(File.join('pages', 'existing_page.md')).should include 'existing page'
    end
  end
end
