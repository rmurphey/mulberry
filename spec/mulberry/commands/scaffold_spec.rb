require 'mulberry/commands/spec_helper.rb'

describe Mulberry::Command::Create do
  include Mulberry::Command::SpecHelpers

  describe '#initialize' do
    it "should initalize" do
      begin
        FileUtils.rm_rf 'fooapp'
        Mulberry::Command::Scaffold.new(['fooapp'])
      ensure
        FileUtils.rm_rf 'fooapp'
      end
    end
  end
end