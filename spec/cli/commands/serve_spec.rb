require 'cli/commands/spec_helper.rb'

describe Mulberry::Command::Test do
  include Mulberry::Command::SpecHelpers

  describe "#initialization" do

    def serve
      Mulberry::Command::Serve.new([@app.name], :running_under_test => true)
    end

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
