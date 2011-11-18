require 'mulberry/commands/spec_helper.rb'

%w( content code template).each do |type|
  require "mulberry/#{type}_creator.rb"
end

describe Mulberry::Command::Create do
  include Mulberry::Command::SpecHelpers

  describe '#commands' do
    it "should support all commands" do
      should_commands = %w( page feed data location component template capability datasource)
      actual_commands = Mulberry::Command::Create.commands.collect{ |cmd| cmd[0].to_s}

     ((should_commands | actual_commands) - (should_commands & actual_commands)).should == []
    end
  end

  describe '#initialize' do
    before :each do
      Dir.chdir File.join(Mulberry.root, @app.name)
    end

    Mulberry::Command::Create.commands.each do |command|
      it "should create #{command[0].to_s}" do
        Mulberry::Command::Create.new([command[0].to_s, "foo"])
      end
    end

    after :each do
      Dir.chdir Mulberry.root
    end
  end
end