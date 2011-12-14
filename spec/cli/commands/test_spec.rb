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
    
    it "should correctly set the app name in config plist" do
      plist_file = File.join(Mulberry::Directories.root, @app.name, "builds", "iphone", "Toura", "Toura-Info.plist")
      doc = Nokogiri::XML(open(plist_file))
      app_name = doc.xpath("/plist/dict/key[contains(., 'CFBundleName')]")[0].next.next.text
      app_name.should == "command's_test_app"
    end
  end
end
