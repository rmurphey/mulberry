# Mulberry

Mulberry takes content from your filesystem and turns it into a working mobile app
on Android and iOS. It also provides a local development server for testing
your app, and a framework for adding custom functionality and CSS.

## Support

- [Google Group](https://groups.google.com/forum/#!forum/toura-mulberry)
- #touramulberry on irc.freenode.net: A live chat room with Mulberry users and
  developers. Use your own IRC client or [use Freenode's webchat](http://webchat.freenode.net/)

# Installation

- Clone this repository to a location of your choosing.

    `git clone git@github.com:Toura/mulberry.git`

- Add the full path to `mulberry/bin` to your path by editing your profile and
  adding the following:

	`export PATH=$PATH:/full/path/to/mulberry/mulberry/bin`

For example, if you cloned the repository to `~/projects/mulberry`, you
would add the following to your `.profile` file.

    export PATH=$PATH:/Users/yourusername/projects/mulberry/mulberry/bin

- Install bundler if it is not already installed (note that you will need to
   have [rubygems](http://docs.rubygems.org/read/chapter/3) installed; it is
   installed by default on OSX):

    `gem install bundler`

- From the *root directory of the repository*, run the following command:

    `bundle install`

- You're done! You should now be able to run mulberry from any directory.


# Setup

Mulberry currently supports the following mobile platforms:

- iOS4 and above on iPhone and iPad
- Android 2.2 and above on Phone only

Mulberry apps have been shown to run on WebOS, although not bug-free.

Mulberry apps do not support Windows Mobile or BlackBerry in any version.

Mulberry development tools are supported on the following platforms:

- OSX Snow Leopard and Lion

Mulberry development is not supported on Linux, but it might work. Please let
us know at mulberry@toura.com if you can get it working on a particular Linux distro.

We do not currently support running Mulberry on Windows or any other OS;
however, some work has been done to get it working on Windows -- additional
pull requests welcome!


## Installing PhoneGap

Mulberry supports PhoneGap 1.1. Any other version will not work.

Go to [the PhoneGap download page](https://github.com/callback/phonegap/zipball/1.1.0)
and download the 1.1.0 release. Extract it to a convenient directory.


### Installing iOS Phonegap Library

In the extracted phonegap directory, go into iOS, and run the installer.
The xcode project will call the lib that is installed to your computer.


### Installing Droidgap

You do not need to install droidgap as the Android project template included in
Mulberry already contains the compiled results.


## iOS Development

To build and run apps on iOS Simulator, you must:

- Own an Intel Mac running OSX Snow Leopard or Lion

- Download Xcode 4.1 or greater (preferably 4.2) from the
   [Mac App Store](http://itunes.apple.com/us/app/xcode/id448457090?mt=12)


In order to submit your apps to the Apple iOS App Store, you must
[sign up with Apple's iOS Developer Program](http://developer.apple.com/programs/ios/)

## Android Development

To build and run apps on Android Simulator, you must:

- Install Java JDK 1.6 or above. This should install the java compiler (javac -version should return 1.6.x)

- Ensure the `JAVA_HOME` environment variable is pointing to the Java directory

- You may have to install Apache ant (`which ant`). We develop with ant 1.8.x (ant -version)
   http://ant.apache.org

- Download [Android SDK package](http://developer.android.com/sdk/index.html) for your platform

- On OSX, extract it to `/Developer/SDKs/android-sdk-mac_x86/`. If you do not
   place it in this directory, Mulberry _should_ detect the location of it, but
   this is the preferred location.

- Edit your shell's loading files (`.bashrc` or `.bash\_profile` for bash and
   `.zshrc` for zsh) and add a line similar to:

	  `export PATH=$PATH:/Developer/SDKs/android-sdk-mac_x86/tools:/Developer/SDKs/android-sdk-mac_x86/platform-tools`

- Open a new teminal and run the SDK manager:

	  `android`

- Click "Available packages"

- Expand "Android Repository"

  You should install:

  - "Android SDK Tools" (latest revision)
  - "Android SDK Platform-tools" (latest revision)
  - SDK Platform Android 2.2, 2.3.x, 2.n (up to latest revision)
  - SDK Platform Android 3.x

  Expand "Third party Add-ons", then install:

  - Google APIs 8, 9 (up to latest revision)

  Be careful, as some tools require certain revisions, so if you see
  "Skipping 'X'; it depends on 'Y'" you'll have to go back and choose X again.

  Keep doing this until you've installed everything.

- You do not need, but may choose, to install the Samples and Documentation.
It's pretty useless and just takes up space.


### Creating an Android Virtual Device

Run the SDK manager by running `android` on the command line.

- On the "Virtual Devices" section click the "New..." button

- Name the device

- Select the Google APIs - API Level 8 (to test 2.2) as the target

- Make the SD card size 64 MB

- Click "Create AVD"

Now you can run the device by running `emulator @your-device-name -partition-size 128`

To rotate the device hit 7 or 9 on your numeric keypad. If you don't have one:
CTRL-F12 to rotate to landscape, CTRL-F11 to rotate back.


### Installing to your Android Virtual Device

Start the emulator, then type:

	  adb install -r /path/to/your.apk

# TODOs

See the github issues list https://github.com/Toura/mulberry/issues/

# Running the tests

To run the tests, simply run `rake` from the root of the repository. You can
also run individual suites:

    rake spec             # run the ruby tests
    rake evergreen:run    # run the javascript tests
    rake evergreen:serve  # serve the javascript tests for manual testing
    rake jshint           # run jshint on the js code and js tests

## Installing chromedriver

You will need chromedriver in order to run the JavaScript tests. You can
[download chromedriver](http://code.google.com/p/chromium/downloads/list)
if you do not already have it installed; make sure you install it somewhere in your $PATH.

