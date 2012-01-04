#!/bin/bash
# install.sh: Installation script for Windows

GEMFILE=$(which gem)
JAVAFILE=$(which java)
ANTFILE=$(which ant)


if [ "$GEMFILE" ]
then
    echo "Rubygems is installed..."
else
	echo "Installing Rubygems..."
	curl http://production.cf.rubygems.org/rubygems/rubygems-1.8.11.tgz --O rubygems-1.8.12.tgz

	tar -xzvf rubygems-1.8.11.tgz
	cd rubygems-1.8.11
	ruby setup.rb # install rubygems
	cd ..
	rm -rf rubygems*
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
	echo "Apache Ant is not installed. Please install Apache ant from http://ant.apache.org/manual/install.html"
	exit 1
fi

BUNDLERFILE=$(gem which bundler)

if [[ "$BUNDLERFILE" =~ /*ERROR*/ ]]
then
	echo "Installing bundler..."
	gem install bundler
else
	echo "Bundler is installed..."
fi