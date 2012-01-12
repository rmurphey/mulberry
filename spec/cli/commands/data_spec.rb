require 'cli/commands/spec_helper.rb'

describe Mulberry::Command::Data do
  include Mulberry::Command::SpecHelpers

  it_should_behave_like "all commands"

  describe '#initialize' do
    it "should initalize" do
      Mulberry::Command::Data.new([@app.name])
    end
  end
end
