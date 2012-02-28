require 'spec_helper'
require 'app'

describe Mulberry::Framework do
  describe "#version" do
    it "should return a period-delimited string" do
      Mulberry::Framework.version.should be_period_delimited_string
    end
  end

  describe "#dojo_version" do
    it "should return a period-delimited string" do
      Mulberry::Framework.dojo_version.should be_period_delimited_string
    end
  end

  describe Mulberry::Framework::Directories do
    it "should point to important directories" do
      root = Mulberry::Framework::Directories.root

      [ :javascript, :page_defs, :data_fixtures, :build_root, :dojo, :profiles, :themes, :project_templates ].each do |d|
        dir = Mulberry::Framework::Directories.send(d.to_s)
        dir.should match root
      end
    end
  end

  describe Mulberry::Framework::Templates do
    describe "#root" do
      it "should return the location of the toura_app templates directory" do
        Mulberry::Framework::Templates.root.should match File.join(Mulberry::Framework::Directories.root, 'cli', 'templates', 'app')
      end
    end

    describe "#index_html" do
      it "should return the location of the index.html template" do
        f = Mulberry::Framework::Templates.index_html
        f.should match 'index.html'
        File.exists?(f).should be_true
      end
    end

    describe "#config" do
      it "should return the location of the toura._Config template" do
        f = Mulberry::Framework::Templates.config
        f.should match 'AppConfig'
        File.exists?(f).should be_true
      end
    end
  end

  describe Mulberry::Framework::Generators do
    describe "#page_defs" do
      it "should return a page defs JS string based on what it is provided" do
        str = Mulberry::Framework::Generators.page_defs({ 'foo' => { 'bar' => 'baz' }})
        str.should include "mulberry.pageDef('foo'"
        str.should include 'bar'
        str.should include 'baz'
      end
    end

    describe "#index_html" do
      it "should return a document" do
        html = Mulberry::Framework::Generators.index_html
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

            html = Mulberry::Framework::Generators.index_html settings

            if v
              html.should match file
            else
              html.should_not match file
            end
          end
        end
      end

      it "should set toura.features.disableBackButton if :disable_back_button is true" do
        html = Mulberry::Framework::Generators.index_html :disable_back_button => true
        html.should match 'mulberry.features.disableBackButton = true;'
      end

      it "should include a title if one is provided" do
        html = Mulberry::Framework::Generators.index_html({ :title => 'Overriding the Title' })
        html.should include 'Overriding the Title'
      end

      it "should include a data file if a data filename is provided" do
        html = Mulberry::Framework::Generators.index_html({ :data_filename => 'data/tour.js' })
        html.should include 'data/tour.js'
      end
    end

    describe "#data" do
      it "should return the contents for tour.json" do
        data = Mulberry::Framework::Generators.data({})
        data.should include 'toura.data.local = '
      end
    end

    describe "#config" do
      it "should return a toura.AppConfig file" do
        c = Mulberry::Framework::Generators.config('ios', 'phone')
        c.should include "mulberry._Config"
        c.should include "phone"
        c.should include "ios"
      end

      it "should allow enabling or disabling feature flags" do
        [
          'siblingNav',
          'ads',
          'sharing',
          'favorites',
          'fontSize',
          'multiLineChildNodes',
          'debugPage'
        ].each do |feature|
          [ true, false ].each do |val|
            c = Mulberry::Framework::Generators.config('ios', 'phone', {
              feature.underscore => val
            })

            c.should include "#{feature} : #{val.to_s}"
          end
        end
      end
    end
  end
end
