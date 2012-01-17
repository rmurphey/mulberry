# Mulberry OSX Installation Instructions

Note:
Windows, Linux, and OSX all have different installation methods. Please see the
platform-specific directories located in the `install` directory.

Mulberry tools are used to develop, debug, and test locally on your local browser.
These tools are written in ruby and are available via github or the Mulberry website.


### Install Java

You must install a Java runtime to build some Mulberry components. Most people usually
have this installed already, but if you don't, you can usually find it at:

http://www.java.com/en/download/index.jsp


### Install git

Download and install the OSX version of git from [git-scm.com](http://git-scm.com/).


### Install Mulberry

After installing Git, open a Terminal window. The following will copy the latest
Mulberry source code to your computer.

	mkdir src
    git clone git://github.com/Toura/mulberry.git src/mulberry


Then run the installation script:

	cd src/mulberry
	source ./install.sh

- You're done! You should now be able to run mulberry from any directory.