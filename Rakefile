require 'rubygems'

begin
  require 'bundler/setup'
rescue LoadError
  raise 'ERROR: You must `gem install bundler` and `bundle install` to run rake tasks'
end

$: << File.expand_path('../', __FILE__)
$: << File.expand_path('../..', __FILE__)

require 'app'

Dir.glob('lib/tasks/**/*.rake').each{|f| load f }
