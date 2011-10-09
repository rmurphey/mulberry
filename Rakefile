require 'rubygems'

begin
  require 'bundler'
rescue LoadError
  raise 'ERROR: You must `gem install bundler` and `bundle install` to run rake tasks'
end

require 'rake'

task :spec do
  require File.expand_path('../spec/spec_helper.rb', __FILE__)
  %x{rspec spec}
end

task :default => :spec
