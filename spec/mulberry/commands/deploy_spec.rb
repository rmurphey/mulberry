require 'mulberry/commands/spec_helper.rb'

describe Mulberry::Command::Create do
  include Mulberry::Command::SpecHelpers

  describe '#initialize' do
    it "should initalize" do
      @app.device_build
    end
  end
end