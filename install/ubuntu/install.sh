sudo apt-get update
sudo apt-get install build-essential git git-core curl zlib1g zlib1g-dev libxml2-dev libxslt-dev openjdk-6-jdk xvfb unzip

bash -s stable < <(curl -s https://raw.github.com/wayneeseguin/rvm/master/binscripts/rvm-installer)

echo '[[ -s "$HOME/.rvm/scripts/rvm" ]] && source "$HOME/.rvm/scripts/rvm"' >> ~/.bashrc
rvm pkg install zlib
rvm pkg install openssl
rvm pkg install iconv
rvm install 1.9.3
rvm use 1.9.3
rvm gemset create 'mulberry'
rvm use 1.9.3@mulberry

# rubygems stuff goes here
gem install bundler

bundle install
