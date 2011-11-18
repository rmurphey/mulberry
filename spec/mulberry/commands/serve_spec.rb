require 'mulberry/commands/spec_helper.rb'

describe Mulberry::Command::Test do
  include Mulberry::Command::SpecHelpers

  describe "#initialization" do
    it "should initalize" do
      Mulberry::Command::Serve.new([@app.name], :dontserve => true)
    end

    it "should support changing the port" do
      ARGV = ["-p", "3002"]

      Mulberry::Command::Serve.new([@app.name], :dontserve => true)
    end

    it "should support verbose mode" do
      ARGV = ["-v"]

      Mulberry::Command::Serve.new([@app.name], :dontserve => true)
    end
  end
end