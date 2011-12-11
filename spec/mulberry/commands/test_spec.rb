require 'mulberry/commands/spec_helper.rb'

describe Mulberry::Command::Test do
  include Mulberry::Command::SpecHelpers

  describe "#initialization" do
    it "should initalize" do
      Mulberry::Command::Test.new [@app.name], {:test => true, :quiet => true, :skip_js_build => true}
    end
  end
end