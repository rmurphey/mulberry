require 'cli/commands/spec_helper.rb'

describe Mulberry::Command::Test do
  include Mulberry::Command::SpecHelpers

  describe "#initialization" do
    it "should initalize" do
      Mulberry::Command::Test.new [@app.name], {:test => true, :quiet => true, :skip_js_build => true}
    end

    it "should support skipping JS builds" do
      ARGV = ['-s']
      Mulberry::Command::Test.new [@app.name], {:test => true, :quiet => true}
    end
    
    describe "an app with a single quote in its name" do
      before(:each) do
        @name = "foo's canoes"
      end
      
      it "should correctly set the app name in config files" do
        Mulberry::Command::Test.new [@name], {:test => true, :quiet => true, :skip_js_build => true}
        
        #ios
        plist_file = File.join(Mulberry::Directories.root, @app.name, "builds", "iphone", "Toura", "Toura-Info.plist")
        doc = Nokogiri::XML(open(plist_file))
        app_name = doc.xpath("/plist/dict/key[contains(., 'CFBundleName')]")[0].next.next.text
        app_name.should == @name
        
        #android
        build_file = File.join(Mulberry::Directories.root, @app.name, "builds", "android", "build.xml")
        doc = Nokogiri::XML(open(build_file))
        app_name = doc.xpath("/project").attr("name").text
        app_name.should == @name
        
        strings_file = File.join(Mulberry::Directories.root, @app.name, "builds", "android", "res", "values", "build.xml")
        doc = Nokogiri::XML(open(strings_file))
        app_name = doc.xpath("/resources/string[@name=app_name]").text
        app_name.should == @name
      end
    end
  end
end
