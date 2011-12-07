require 'mulberry/commands/spec_helper.rb'

describe Mulberry::Command::Deploy do
  include Mulberry::Command::SpecHelpers

  describe '#initialize' do
    it "should initalize" do
      Mulberry::Command::Deploy.new [@app.name, {:test => true, :skip_js_build => true}]
    end
  end
end