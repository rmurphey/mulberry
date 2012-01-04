# Mulberry 64-bit Windows 7 Installation Instructions

Note:
Windows, Linux, and OSX all have different installation methods. Please see the
platform-specific directories located in the `install` directory.

Mulberry tools are used to develop, debug, and test locally on your local browser.
These tools are written in ruby and are available via github or the Mulberry website.


### Compile/Test on Windows Mobile devices

You must install:

1. Microsoft VisualStudio 2010 SP1 or higher (the express edition works fine)
1. Windows Phone 7 SDK (7.1SDK or higher http://create.msdn.com/en-US/home/getting_started)


### Install Java

You must install a Java runtime to build some Mulberry components. Most people usually
have this installed already, but if you don't, you can usually find it at:

http://www.java.com/en/download/index.jsp


### Install cygwin

cygwin are a set of command-line tools ported from Unix-like systems to Windows;
Mulberry uses quite a few of them.

1. Visit http://www.cygwin.com/
1. Download "setup.exe"
1. Place it somewhere convenient
1. Open NotePad (Win-r -> notepad -> Ok)
1. Copy and paste the contents of [this batch file](https://raw.github.com/Toura/mulberry/master/install/windows/cygwin_setup.bat) into notepad
1. Save the file as "cygwin_setup.bat" and place it in the same folder as "setup.exe"
1. Double-click cygwin_setup.bat - this will install cygwin with the packages we need to run Mulberry.

Note that you *must run Mulberry from within a cygwin console*.
By default, this will be at Start -> All Programs -> Cygwin -> Cygwin Terminal

You will probably want to pin this to your Taskbar or copy it to your desktop.


### Download Mulberry

Within the cygwin console you have a virtual directory structure that
mimics Unix. You cannot use Windows file paths like C:\windows, and your Windows
"hard drive" is actually mounted at:

	/cygdrive/c

Many of the Mulberry tools *will not work* if your directory path has
a space in it. **Do not install/download Mulberry to a path that contains a space.**

Open a *Cygwin Console* and navigate to somewhere in your C drive to put Mulberry.
I tend to create a `src` dir off of `/cygdrive/c` and keep all of my source projects in there.


Remember: *do not install Mulberry to a path that has a space in it!*

	cd /cygdrive/c
    mkdir src
	cd src
	git clone git://github.com/Toura/mulberry.git


This will download the latest code from github to your computer. The code is viewable
in your `C:\src\mulberry` dir, or via `/cygdrive/c/src/mulberry` in cygwin.


### Install Mulberry Components

Open a *Cygwin Console* and `cd` to your mulberry installation location entered above.

If you followed the above instructions, mulberry is available at `/cygdrive/c/src/mulberry`

	cd /cygdrive/c/src/mulberry

From there, type:

	source ./install.sh

This will install the base Mulberry items, including Rubygems, Bundler, and runtime libraries.

WARNING: this will append your `~/.bash_profile` to add Mulberry to your path. For a new
install of cygwin only used for Mulberry, this is fine. If you use cygwin for other
projects, you may not wish for this to occur. Edit the script yourself to include
the path to `/cygdrive/c/src/mulberry/cli/bin`.


Installation complete! If you encounter any difficulties please [contact us](http://mulberry.toura.com).