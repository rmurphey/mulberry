require 'mulberry/commands/spec_helper.rb'
require 'fakeweb'

describe Mulberry::Command::PublishOta do
  include Mulberry::Command::SpecHelpers

  describe '#initialize' do

    after :each do
      FakeWeb.clean_registry
    end

    it "should print error messages in a friendly manner" do
      ["404", "503"].each do |status|
        FakeWeb.register_uri(:post, //, :status => status)
        stdout = capture_io_streams(:stdout) do
          lambda { Mulberry::Command::PublishOta.new([@app.name]) }.should_not raise_error
        end
        stdout.should match /error/i
      end
    end
  end
end