$: << File.expand_path('../', __FILE__)
$: << File.expand_path('../..', __FILE__)

require 'mulberry/mulberry'
require 'lib/builder'
require 'factory_girl'
FactoryGirl.find_definitions
