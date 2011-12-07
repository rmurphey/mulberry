require 'mulberry/commands/spec_helper.rb'

describe Mulberry::Command::Create do
  include Mulberry::Command::SpecHelpers

  before :each do
    @app_name = 'fooapp'

    Dir.chdir Mulberry::Directories.root
    FileUtils.rm_rf @app_name
  end

  after :each do
    FileUtils.rm_rf @app_name
  end

  it "should initalize" do
    Mulberry::Command::Scaffold.new([@app_name])
  end

  it "should initalize with full path" do
    Mulberry::Command::Scaffold.new(["#{Dir.pwd}/#{@app_name}"])
  end
end
