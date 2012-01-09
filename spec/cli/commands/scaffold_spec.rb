require 'cli/commands/spec_helper.rb'

describe Mulberry::Command::Create do
  include Mulberry::Command::SpecHelpers

  it_should_behave_like "all commands"

  before :each do
    @app_name = 'fooapp'

    Dir.chdir Mulberry::Directories.root
    FileUtils.rm_rf @app_name
  end

  after :each do
    FileUtils.rm_rf @app_name
  end

  it "should initalize" do
    Mulberry::Command::Scaffold.new([@app_name], { :reporting_enabled => true })
  end

  it "should initalize with full path" do
    Mulberry::Command::Scaffold.new(["#{Dir.pwd}/#{@app_name}"], { :reporting_enabled => true })
  end

  it "should create the .mulberry file" do
    old_val = Mulberry::FEATURES[:reporting]
    Mulberry::FEATURES[:reporting] = true

    Mulberry::Command::Scaffold.new([@app_name], :reporting_enabled => true)
    File.exists?(File.join(@app_name, '.mulberry')).should be_true

    Mulberry::FEATURES[:reporting] = old_val
  end
end
