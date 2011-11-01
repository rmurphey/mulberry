$: << File.expand_path('../', __FILE__)
$: << File.expand_path('../..', __FILE__)

require 'mulberry/mulberry'
require 'lib/builder'
require 'factory_girl'

Dir.glob(File.dirname(__FILE__) + "/factories/*").each do |factory|
  begin
    require factory
  rescue
    nil
  end
end