require 'cli/commands/spec_helper.rb'

describe Mulberry::Command::WwwBuild do
  include Mulberry::Command::SpecHelpers

  def exec_simple_init_example
    Mulberry::Command::WwwBuild.new([@app.name], :skip_js_build => true)
  end

  it_should_behave_like "all commands"
end

