require 'cli/commands/spec_helper.rb'

describe Mulberry::Command::Deploy do
  include Mulberry::Command::SpecHelpers

  it_should_behave_like "all commands"

  describe '#initialize' do
    it "should initalize" do
      Mulberry::Command::Deploy.new [@app.name], {:test => true, :quiet => true, :skip_js_build => true}
    end
  end
end
