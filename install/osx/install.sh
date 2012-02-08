# install.sh: Installation script for OSX
PACKAGES='git chromedriver android-sdk'

XCODEFILE=$(which xed)
RVMFILE=$(which rvm)
BREWFILE=$(which brew)
GEMFILE=$(which gem)
JAVAFILE=$(which java)
ANTFILE=$(which ant)
ANDROIDFILE=$(which android)

function check_or_install_brew_pkg() {
	FILELOCATION=$(which $1)
	if [ "$FILELOCATION" ]
	then
		echo "$1 is installed..."
	else
		echo "Installing $1..."
		brew install $1
	fi
}

# Due to bug in xcode install xed may not be in path
# ref http://stackoverflow.com/questions/7317785/terminal-xed-command-missing-after-new-xcode-install
if [ "$XCODEFILE" ] || [ -x "/Developer/usr/bin/xed" ]
then
	echo "XCode is installed..."
else
	echo "XCode is not installed. Please install XCode 4.3+ from http://itunes.apple.com/us/app/xcode/id448457090?mt=12"
	exit 1
fi

if [ "$RVMFILE" ]
then
	echo "RVM is installed..."
else
	echo "Installing RVM..."
	bash < <(curl -s https://raw.github.com/wayneeseguin/rvm/master/binscripts/rvm-installer )
fi


if [ "$GEMFILE" ]
then
    echo "Rubygems is installed..."
else
	echo "Installing Rubygems..."
	cd tmp
	curl http://production.cf.rubygems.org/rubygems/rubygems-1.8.11.tgz --O rubygems-1.8.12.tgz

	tar -xzvf rubygems-1.8.11.tgz
	cd rubygems-1.8.11
	ruby setup.rb # install rubygems
	cd ..
	rm -rf rubygems*
	cd ..
fi


RVMRUBIES=$(rvm list strings)

if [[ $RVMRUBIES =~ '1.9.3' ]]
then
	echo "Ruby 1.9.3 is installed..."
else
	echo "Installing Ruby 1.9.3 via RVM..."
	rvm install 1.9.3
fi

RVMGEMSETS=$(rvm gemset list strings)

if [[ $RVMGEMSETS =~ 'mulberry' ]]
then
	echo "Mulberry gemset exists..."
else
	echo "Creating Mulberry gemset..."
	rvm use 1.9.3
	rvm gemset create 'mulberry'
fi

rvm use 1.9.3@mulberry


if [ "$BREWFILE" ]
then
	echo "Homebrew is installed..."
else
	echo "Installing Homebrew..."
	ruby -e "$(curl -fsSL https://raw.github.com/gist/323731)"
fi


if [ "$JAVAFILE" ]
then
	echo "Java is installed..."
else
	echo "Java is not installed. Please install java from http://www.java.com/en/download/index.jsp"
	exit 1
fi


if [ "$ANTFILE" ]
then
	echo "Apache ant is installed..."
else
	brew install https://raw.github.com/adamv/homebrew-alt/master/duplicates/ant.rb
fi


BUNDLERFILE=$(gem which bundler)

if [[ "$BUNDLERFILE" =~ /*ERROR*/ ]]
then
	echo "Installing bundler..."
	gem install bundler
else
	echo "Bundler is installed..."
fi

for package in $PACKAGES
do
	check_or_install_brew_pkg $package
done


if [ "$ANDROIDFILE" ]
then
	echo "Android is installed..."
else
	echo "Installing android"
	brew install android-sdk
fi

if [[ $(cat ~/Documents/PhoneGapLib/VERSION ) =~ '1.3.0' ]]
then
	echo "PhoneGap 1.3.0 is installed."
else
	echo "Downloading PhoneGap 1.3.0 to tmp/callback-phonegap-b81151f..."

	cd tmp
	curl https://nodeload.github.com/callback/phonegap/zipball/1.3.0 --O phonegap.1.3.0.zip

	unzip -q phonegap.1.3.0.zip
	cd ..

	hdiutil mount tmp/callback-phonegap-b81151f/iOS/PhoneGap-1.3.0.dmg

	open /Volumes/PhoneGap-1.3.0/PhoneGap-1.3.0.pkg
fi
