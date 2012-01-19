require 'spec_helper'
require "builder"

describe Builder::CSSMaker do
  before :each do
    @settings = {
      :app_dir => File.join(FIXTURES_DIR, 'css', 'javascript'),
      :theme_dir => File.join(FIXTURES_DIR, 'css', 'theme')
    }
  end

  it "should raise an error if no theme path is provided" do
    @settings.delete(:theme_dir)
    lambda {
      Builder::CSSMaker.new(@settings)
    }.should raise_error
  end

  it "should throw an error if there is no file at the provided in the theme directory" do
    @settings[:theme_dir] = 'fake'

    lambda {
      Builder::CSSMaker.new(@settings)
    }.should raise_error
  end

  describe "#render" do
    it "should properly render the css" do
      css = Builder::CSSMaker.new(@settings).render

      # test that the toura css was loaded
      css.should include '#toura'

      # test that the theme css was loaded
      css.should include '#theme'

      #test that we loaded files from the provided load paths
      css.should include '#toura-imported'
    end

    it "should render the css with overrides" do
      override = File.read(File.join(FIXTURES_DIR, 'css', 'settings.scss'))

      css = Builder::CSSMaker.new(@settings.merge({
        :overrides => { :settings => override }
      })).render

      css.should include '#vars'
      css.should include '#000001'
    end

    it "should render the css with a postscript" do
      postscript = '#postscript { color: red; }'

      css = Builder::CSSMaker.new(@settings.merge({
        :postscript => postscript
      })).render

      css.should include '#postscript'
    end
  end
end
