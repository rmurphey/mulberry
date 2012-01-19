# Toura FYI: if anything is added to this file, it will need to be added to MAP as well
source 'http://rubygems.org'

gem 'activesupport', '~> 3.0.9'
gem 'deep_merge'
gem 'haml', '3.1.2'
gem 'i18n' # activesupport dependency but need to specify manually: https://github.com/rails/rails/pull/235
gem 'imagesize'
gem 'json'
gem 'kramdown'
gem 'mustache'
gem 'sass', '3.1.4'
gem 'sinatra', '1.3.2'
gem 'guid'

group :development, :test do
  gem 'rake', '0.9.2'
end

group :development do
  gem 'linecache', '0.43', :platforms => :ruby_18, :require => false
  gem 'ruby-debug', :platforms => :ruby_18, :require => false
end

group :test do
  gem 'evergreen', :require => false
  gem 'factory_girl', :require => false
  gem 'fakefs', :require => false
  gem 'jshintrb', '1.1', :git => 'git://github.com/Toura/jshintrb.git', :require => false
  #gem 'racc' # For CYGWIN to compile nokogiri
  gem 'rspec', '2.6.0'
  gem 'fakeweb', :require => false
  gem 'webmock', :require => false
end
