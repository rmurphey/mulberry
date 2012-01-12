require 'spec_helper'
require "builder"

describe Builder::CSSMaker do
  before :each do
    @settings = {
      :app_dir => File.join(File.dirname(__FILE__), '..', 'fixtures', 'css', 'javascript'),
      :theme_dir => File.join('spec', 'fixtures', 'css', 'theme')
    }
  end

  it "should raise an error if no theme path is provided" do
    @settings.delete(:theme_dir)
    lambda {
      Builder::CSSMakeker.new(@settings)
    }.should raise_error
  end

  it "should throw an error if there is no file at the provided in the theme directory" do
    @settings[:theme_dir] = 'fake'

    lambda {
      Builder::CSSMaker.new(@settings)
    }.should raise_error
  end

  describe "#scss_data_from_vars_hash" do
    it "should return correctly formatted scss data" do
      scss_data = Builder::CSSMaker.scss_data_from_vars_hash({'foo' => 'bar'})
      scss_data.should == "$foo: bar;"
    end
  end

  describe "#render" do
    it "should properly render the css" do
      css = Builder::CSSMaker.new(@settings).render

      # test that the toura css was loaded
      css.should match '#toura'

      # test that the theme css was loaded
      css.should match '#theme'

      #test that we loaded files from the provided load paths
      css.should match '#toura-imported'
    end
  end
end
