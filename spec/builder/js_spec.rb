require 'spec_helper'
require "builder"

describe Builder::JavaScript do

  describe "#base_profile" do
    before(:each) do
      @b = Builder::Build.new(
        :skip_js_build => false,
        :target_config => {
          'build_type' => 'fake',
          'build' => {
            'javascript' => [ 'toura' ]
          }
        }
      )

    end

    it "should return a relative path for copyright file" do

      js = Builder::JavaScript.new @b, 'dojo'

      js.send(:base_profile)[:layers].each do |layer|
        layer[:copyrightFile].should == Pathname.new(Builder::JavaScript::COPYRIGHT_FILE).relative_path_from(Pathname.new(Builder::JavaScript::BUILDSCRIPTS_DIR)).to_s
        layer[:copyrightFile].should match /^\.\..+/
      end
    end
  end
end