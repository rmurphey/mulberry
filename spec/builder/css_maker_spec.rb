require 'spec_helper'
require "builder"

describe Builder::CSSMaker do
  before :each do
    @settings = {
      :css_dir => File.join(FIXTURES_DIR, 'css', 'mulberry-app-instance')
    }
  end

  it "should raise an error if no css path is provided" do
    @settings.delete(:css_dir)
    lambda {
      Builder::CSSMaker.new(@settings)
    }.should raise_error
  end

  it "should throw an error if there is no file at the provided in the css directory" do
    @settings[:css_dir] = 'fake'

    lambda {
      Builder::CSSMaker.new(@settings)
    }.should raise_error
  end

  describe "#render" do
    it "should properly render the css" do
      css = Builder::CSSMaker.new(@settings).render

      # test that the app css was loaded
      css.should include '#app-instance'
    end

    it "should render the css with overrides" do
      override = File.read(File.join(FIXTURES_DIR, 'css', 'overrides', 'settings.scss'))

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
