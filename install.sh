case "$(uname)" in
	Darwin)
#      . install/osx/install.sh
      ;;

    CYGWIN*)
      . install/windows/install.sh
      ;;

    Linux|*)
      . install/linux/install.sh
      ;;
esac


echo "Installing gems..."
bundle install --without test development


echo "Setting PATH..."
# Get installation dir
DIR="$( pwd )"

# Cram it in our bash_profile
echo -e "\n\nexport PATH=\$PATH:${DIR}/cli/bin" >> ~/.bash_profile

# Set it for this console session
export PATH=$PATH:$DIR/cli/bin


echo "Downloading PhoneGap to tmp/callback-phonegap-c81c02b..."

cd tmp
curl https://nodeload.github.com/callback/phonegap/zipball/1.1.0 --O phonegap.1.1.0.zip

unzip phonegap.1.1.0.zip
cd ..

if [[ "$(uname)" == "Darwin" ]]
then
	open tmp/callback-phonegap-c81c02b/iOS/PhoneGap-1.1.0.dmg
fi


echo "Configuring android..."
android