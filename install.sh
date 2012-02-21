function prompt_to_continue() {

	cat install/$1/packages.txt
	read run_installer

	if [[ $run_installer == 'n' || $run_installer == 'N' ]]
	then
		echo -e "\n"
		echo "WARNING: You are choosing a manual installation. Proceed at your own risk!"
		echo "Read 'install/${1}/install.sh' to determine the steps for manual installation."
		exit 1
	fi
}

case "$(uname)" in
  Darwin)
		prompt_to_continue 'osx'
		. install/osx/install.sh
  ;;

	CYGWIN*)
		. install/windows/install.sh
	;;

  Linux|*)
		prompt_to_continue 'ubuntu'
    . install/ubuntu/install.sh
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

echo "Configuring builder/project_templates/android/local.properties"
android update project -p builder/project_templates/android/

echo "Please open README.md for steps to configure Android."
