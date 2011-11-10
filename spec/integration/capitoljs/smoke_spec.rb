require 'integration/capitoljs/spec_helper'

include CapybaraSpecHelper

describe "Capitol JS Smoke Test", :type => :request do
  it_should_behave_like "all demo apps"
end