require 'mulberry/commands/spec_helper.rb'

%w( content code template).each do |type|
  require "mulberry/#{type}_creator.rb"
end

describe Mulberry::Command::Create do
  include Mulberry::Command::SpecHelpers

  describe '#initialize' do
    before :each do
      Dir.chdir 'testapp'
    end

    %w( page feed data location component template capability datasource).each do |command|
      it "should create #{command}" do
        Mulberry::Command::Create.new([command, "foo"])
      end
    end

    after :each do
      Dir.chdir '..'
    end
  end
end