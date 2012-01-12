require 'cli/commands/spec_helper.rb'

describe Mulberry::Command::Serve do
  include Mulberry::Command::SpecHelpers

  it_should_behave_like "all commands"

  def serve
    Mulberry::Command::Serve.new([@app.name], :running_under_test => true)
  end

  def exec_simple_init_example
    serve
  end

  describe "#initialization" do

    it "should initalize" do
      serve
    end

    it "should support changing the port" do
      ARGV = ["-p", "3002"]
      serve
    end

    it "should support verbose mode" do
      ARGV = ["-v"]
      serve
    end
  end
end
