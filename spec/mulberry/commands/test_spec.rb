require 'mulberry/commands/spec_helper.rb'

describe Mulberry::Command::Test do
  include Mulberry::Command::SpecHelpers

  describe "#initialization" do
    it "should initalize" do
      @app.device_build(:test => true)
    end
  end
end