require 'integration/kitchensink/spec_helper'

include CapybaraSpecHelper

describe "Kitchen Sink Smoke Test", :type => :request do
  it_should_behave_like "all demo apps"
end