require 'cli/commands/spec_helper.rb'

describe Mulberry::Command::Deploy do
  include Mulberry::Command::SpecHelpers

  def exec_simple_init_example
    Mulberry::Command::Deploy.new [@app.name], {:test => true, :quiet => true, :skip_js_build => true}
  end

  it_should_behave_like "all commands"

  describe '#initialize' do
    it "should initalize" do
      exec_simple_init_example
    end
  end
end
