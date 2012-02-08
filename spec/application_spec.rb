require 'spec_helper'
require 'app'

describe TouraAPP do
  describe "#version" do
    it "should return a period-delimited string" do
      TouraAPP.version.should be_period_delimited_string
    end
  end

  describe "#dojo_version" do
    it "should return a period-delimited string" do
      TouraAPP.dojo_version.should be_period_delimited_string
    end
  end

  describe TouraAPP::Directories do
    it "should point to important directories" do
      root = TouraAPP::Directories.root

      [ :javascript, :page_defs, :data_fixtures, :build_root, :dojo, :profiles, :themes ].each do |d|
        dir = TouraAPP::Directories.send(d.to_s)
        dir.should match root
      end
    end
  end

  describe TouraAPP::Templates do
    describe "#root" do
      it "should return the location of the toura_app templates directory" do
        TouraAPP::Templates.root.should match File.join(TouraAPP::Directories.root, 'cli', 'templates', 'app')
      end
    end

    describe "#index_html" do
      it "should return the location of the index.html template" do
        f = TouraAPP::Templates.index_html
        f.should match 'index.html'
        File.exists?(f).should be_true
      end
    end

    describe "#config" do
      it "should return the location of the toura._Config template" do
        f = TouraAPP::Templates.config
        f.should match 'AppConfig'
        File.exists?(f).should be_true
      end
    end
  end

  describe TouraAPP::Generators do
    describe "#page_defs" do
      it "should return a page defs JS string based on what it is provided" do
        str = TouraAPP::Generators.page_defs({ 'foo' => { 'bar' => 'baz' }})
        str.should include "toura.pageDef('foo'"
        str.should include 'bar'
        str.should include 'baz'
      end
    end

    describe "#index_html" do
      it "should return a document" do
        html = TouraAPP::Generators.index_html
        html.should match 'DOCTYPE'
      end

      {
        :include_phonegap     => 'phonegap.js',
        :include_jquery       => 'jquery.js',
        :include_dev_config   => 'DevConfig.js'
      }.each do |prop, file|
        it "should include #{file} when #{prop.to_s} is true" do
          [ true, false].each do |v|
            settings = {}
            settings[prop] = v

            html = TouraAPP::Generators.index_html settings

            if v
              html.should match file
            else
              html.should_not match file
            end
          end
        end
      end

      it "should set toura.features.disableBackButton if :disable_back_button is true" do
        html = TouraAPP::Generators.index_html :disable_back_button => true
        html.should match 'toura.features.disableBackButton = true;'
      end

      it "should include a title if one is provided" do
        html = TouraAPP::Generators.index_html({ :title => 'Overriding the Title' })
        html.should include 'Overriding the Title'
      end
    end

    describe "#data" do
      it "should return the contents for tour.json" do
        data = TouraAPP::Generators.data({})
        data.should include 'toura.data.local = '
      end
    end

    describe "#config" do
      it "should return a toura._Config file" do
        c = TouraAPP::Generators.config('ios', 'phone')
        c.should match /dojo\.provide\('toura\._Config'\);/
        c.should match "phone"
        c.should match "ios"
      end

      it "should allow enabling or disabling sibling nav" do
        c = TouraAPP::Generators.config('ios', 'phone', { 'sibling_nav' => false });
        c.should include 'siblingNav : false'

        c = TouraAPP::Generators.config('ios', 'phone', { 'sibling_nav' => true });
        c.should include 'siblingNav : true'
      end
    end
  end
end
