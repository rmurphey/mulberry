require 'cli/commands/spec_helper.rb'

describe Mulberry::Command::Test do
  include Mulberry::Command::SpecHelpers

  def exec_simple_init_example
    Mulberry::Command::Test.new [@app.name], {:test => true, :quiet => true, :skip_js_build => true}
  end

  it_should_behave_like "all commands"

  describe "#initialization" do
    it "should initalize" do
      exec_simple_init_example
    end

    it "should support skipping JS builds" do
      ARGV = ['-s']
      Mulberry::Command::Test.new [@app.name], {:test => true, :quiet => true}
    end

    describe "an app with a single quote in its name" do
      before(:each) do
        @quote_app = scaffold_app("foo's canoes")
        @quote_app.should_not be_nil
      end

      it "should correctly set the app name in config files" do
        Mulberry::Command::Test.new [@quote_app.name], {:test => true, :quiet => true, :skip_js_build => true}

        #ios
        plist_file = File.join(Mulberry::Directories.root, @quote_app.name, "builds", "iphone", "Toura", "Toura-Info.plist")
        test_str = "<string>#{@quote_app.name}"
        File.read(plist_file).include?(test_str).should be_true

        #android
        build_file = File.join(Mulberry::Directories.root, @quote_app.name, "builds", "android", "build.xml")
        safe_name = @quote_app.name.split(%r{[^\w]+}).join
        test_str = "<project name=\"#{safe_name}\""
        File.read(build_file).include?(test_str).should be_true

        strings_file = File.join(Mulberry::Directories.root, @quote_app.name, "builds", "android", "res", "values", "strings.xml")
        test_str = "<string name=\"app_name\">\"#{@quote_app.name}\""
        File.read(strings_file).include?(test_str).should be_true
      end

      after(:each) do
        Dir.chdir Mulberry::Directories.root

        FileUtils.rm_rf File.join(Mulberry::Directories.root, @quote_app.name)
      end
    end
  end
end
