# Getting Started

*Mulberry is supported on OSX Snow Leopard and Lion, and on Windows 7 64-bit
via Cygwin. You should read the relevant README for your operating system in
the `install` directory. Ubuntu is not officially supported, but it is reported
to work by following the instructions in the Ubuntu installation README.*

## Installation

1. Read `install/<your_operating_system>/README.md` for details on dependencies
  for your operating system. The installation process takes care of as much of
  this as possible, but **some dependencies may need to be installed manually
  before the installation scripts will work**.
2. Download the [latest release](https://github.com/Toura/mulberry/tags), or
  clone the repository into a directory of your choosing:

    `git clone git@github.com:Toura/mulberry.git`

3. Once you have the code, `cd` to the `mulberry` directory, and run the following
command:

    `source ./install.sh`

## Uninstallation

Mulberry uses rvm and bundler to install all the necessary components into the
Mulberry directory itself. To uninstall, simply `rm -rf` the mulberry directory
then run `rvm implode` to remove rvm (unless you wish to keep it, of course).

You'll also need to edit your shell profile (typically `~/.bash_profile`) to remove
the $PATH entry that the installer added.


# Developing Apps

## Supported Mobile Platforms

Mulberry currently supports the following mobile platforms:

- iOS4 and above on iPhone and iPad
- Android 2.2 and above on Phone only

Mulberry apps have been shown to run on WebOS, although not bug-free.

Mulberry does not currently support Windows Mobile or BlackBerry in any version.

There are additional requirements for each platform:

- [iOS Application Development Requirements](https://github.com/Toura/mulberry/wiki/Requirements-for-Developing-iOS-Apps)
- [Android Application Development Requirements](https://github.com/Toura/mulberry/wiki/Requirements-for-Developing-Android-Apps)

# Running the Tests

Note that if you've been following along, you have not installed the libraries
to do testing. Run `bundle install` to install the test/development libraries necessary
for testing.

To run the tests, run `rake` from the root of the repository.

You can also run individual suites:

    rake                  # run all of the tests & jshint. Alised of rake ci
    rake spec             # run the ruby unit tests
    rake integration      # run the javascript integration tests
    rake evergreen:run    # run the javascript unit tests
    rake evergreen:serve  # serve the javascript tests for manual testing
    rake jshint           # run jshint on the js code and js tests

## Installing chromedriver

You will need chromedriver in order to run the JavaScript tests. You can
[download chromedriver](http://code.google.com/p/chromium/downloads/list)
if you do not already have it installed; make sure you install it somewhere in your $PATH.

This is automatically installed for you by the OSX installer, other platforms
will need to install it by hand.

# Getting Support

- [Documentation](https://github.com/toura/mulberry/wiki)
- [Google Group](https://groups.google.com/forum/#!forum/toura-mulberry)
- #touramulberry on irc.freenode.net: A live chat room with Mulberry users and
  developers. Use your own IRC client or [use Freenode's webchat](http://webchat.freenode.net/)

