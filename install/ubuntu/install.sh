sudo apt-get update
sudo apt-get install build-essential git git-core curl zlib1g zlib1g-dev libxml2-dev libxslt-dev

bash < <(curl -s https://rvm.beginrescueend.com/install/rvm)
echo '[[ -s "$HOME/.rvm/scripts/rvm" ]] && source "$HOME/.rvm/scripts/rvm"' >> ~/.bashrc
rvm pkg install zlib
rvm install 1.9.3

# rubygems stuff goes here

gem install bundler