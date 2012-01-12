require 'cli/commands/spec_helper.rb'

describe Mulberry::Command::Generate do
  include Mulberry::Command::SpecHelpers

  it_should_behave_like "all commands"

  before :each do
    @app_name = 'fooapp'
    FileUtils.rm_rf @app_name
    Mulberry::Command::Scaffold.new([@app_name], { :reporting_enabled => true })
  end

  after :each do
    Dir.chdir Mulberry::Directories.root
    FileUtils.rm_rf @app_name
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

  it "should scaffold pages from anywhere inside a project" do
    FileUtils.mkdir_p File.join(@app_name, 'foo', 'bar')

    File.open(File.join(@app_name, 'sitemap.yml'), 'a') do |f|
      f.write "\n- fake_page"
    end

    Dir.chdir File.join(@app_name, 'foo', 'bar')

    Mulberry::Command::Generate.new
    Dir.chdir Mulberry::Directories.root

    File.exists?(File.join(@app_name, 'pages', 'fake_page.md')).should be_true
  end

  describe "component creation" do
    before :each do
      FileUtils.cp_r(
        File.join(FIXTURES_DIR, 'page_def.yml'),
        File.join(@app_name, 'page_defs')
      )

      FileUtils.touch File.join(@app_name, 'javascript', 'components', 'AlreadyExists.js')

      Dir.chdir @app_name
      Mulberry::Command::Generate.new
    end

    it "should create nonexistent components" do
      [ 'NonexistentComponent', 'ComponentInSubregion' ].each do |c|
        puts "Checking for #{c}"
        created_component = File.join('javascript', 'components', "#{c}.js")

        File.exists?(created_component).should be_true
        File.read(created_component).should include 'mulberry.component'
        File.read(created_component).should include c
      end
    end

    it "should not re-create an already existing component" do
      existing = File.join('javascript', 'components', 'AlreadyExists.js')
      File.exists?(existing).should be_true
      File.read(existing).should_not include 'mulberry.component'
    end

    it "should not create non-custom components" do
      File.exists?(File.join('javascript', 'components', 'BuiltInComponent.js')).should_not be_true
    end
  end

end
