require 'rubygems'

begin
  require 'bundler'
rescue LoadError
  raise 'ERROR: You must `gem install bundler` and `bundle install` to run rake tasks'
end

require 'rake'

task :spec do
  exec %{rspec --color --format doc spec}
end

task :default => :spec
