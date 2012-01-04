case "$(uname)" in
	Darwin)
      . install/osx/install.sh
      ;;

    CYGWIN*)
      . install/windows/install.sh
      ;;

    Linux|*)
	  echo "Linux is not yet supported; please open install/ubuntu/README.md for more information."
      # TODO: . install/ubuntu/install.sh
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


echo "Please open README.md for steps to install and configure Android."