require 'mulberry/commands/spec_helper.rb'

%w( content code template).each do |type|
  require "mulberry/#{type}_creator.rb"
end

describe Mulberry::Command::Create do
  include Mulberry::Command::SpecHelpers

  describe '#initialize' do
    before :each do
      Dir.chdir File.join(Mulberry.root, @app.name)
    end

    %w( page feed data location component template capability datasource).each do |command|
      it "should create #{command}" do
        Mulberry::Command::Create.new([command, "foo"])
      end
    end

    after :each do
      Dir.chdir Mulberry.root
    end
  end
end