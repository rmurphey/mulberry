require 'integration/phonegap_apis/spec_helper'

include CapybaraSpecHelper

describe "PhoneGap APIs Smoke Test", :type => :request do
  it_should_behave_like "all demo apps"
end
