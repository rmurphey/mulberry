require 'mulberry/commands/spec_helper.rb'

describe Mulberry::Command::Create do
  include Mulberry::Command::SpecHelpers

  describe '#initialize' do
    it "should initalize" do
      Mulberry::Command::Data.new([@app.name])
    end
  end
end