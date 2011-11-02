require 'spec_helper'
require 'toura_app/application'

describe TouraAPP do
  describe "#version" do
    it "should return a period-delimited string" do
      v = TouraAPP.version
      v.is_a?(String).should be_true
      v.split('.').length.should be > 1
    end
  end

  describe "#dojo_version" do
    it "should return a period-delimited string" do
      v = TouraAPP.dojo_version
      v.is_a?(String).should be_true
      v.split('.').length.should be > 1
    end
  end

  describe "#root" do
    it "should return the location of the toura_app directory" do
      dir = TouraAPP.root
      dir.should match 'toura_app'
      File.exists?(File.join(dir, 'application.rb')).should be_true
    end
  end

  describe TouraAPP::Directories do
    it "should point to important directories" do
      [ :root, :javascript, :page_templates, :data_fixtures, :build_root ].each do |d|
        res = TouraAPP::Directories.send(d.to_s)
        res.should match TouraAPP.root
      end
    end
  end

  describe TouraAPP::Templates do
    describe "#root" do
      it "should return the location of the toura_app templates directory" do
        TouraAPP::Templates.root.should match TouraAPP.root
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
      it "should return the location of the TouraConfig template" do
        f = TouraAPP::Templates.config
        f.should match 'TouraConfig'
        File.exists?(f).should be_true
      end
    end
  end

  describe TouraAPP::Generators do
    describe "#page_templates" do
      it "should return a page templates object" do
        template_obj = TouraAPP::Generators.page_templates
        template_obj.keys.length.should be > 0

        Dir.glob(File.join(TouraAPP::Directories.page_templates, '*.yml')).each do |t|
          template_name = YAML.load_file(t).keys.first
          template_obj[template_name].should_not be_nil
        end
      end

      it "should accept an object containing additional templates" do
        template_obj = TouraAPP::Generators.page_templates({ 'foo' => 'bar' })
        template_obj['foo'].should == 'bar'
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
    end

    describe "#config" do
      it "should return a TouraConfig file" do
        c = TouraAPP::Generators.config('ios', 'phone')
        c.should match /dojo\.provide\('toura\.app\.TouraConfig'\);/
        c.should match "phone"
        c.should match "ios"
      end

      # TODO: how to test the actual contents of this file?
    end
  end
end
