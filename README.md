# Mulberry

Mulberry takes content from your filesystem and turns it into a working mobile app
on Android and iOS. It also provides a local development server for testing
your app, and a framework for adding custom functionality and CSS.

## Support

Please email us at mulberry@toura.com, find us on IRC (irc.freenode.net) channel
\#touramulberry or visit our helpdesk at https://mulberry.tenderapp.com


## Install

- Clone this repository to a location of your choosing.

    `git clone git@github.com:Toura/mulberry.git`

- Add the full path to `mulberry/bin` to your path by editing your profile and
  adding the following:

    `export PATH=$PATH:/full/path/to/mulberry/mulberry/bin

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


## Setup

Mulberry currently supports the following mobile platforms:

- iOS4 and above on iPhone and iPad
- Android 2.2 and above on Phone only

Mulberry apps have been shown to run on WebOS, although not bug-free.

Mulberry apps do not support Windows Mobile or BlackBerry in any version.

Mulberry development tools are supported on the following platforms:

- OSX Snow Leopard and Lion

Mulberry development is not supported on Linux, but it might work. Please let
us know at mulberry@toura.com if you can get it working on a particular Linux distro.

We do not currently support running Mulberry on Windows or any other OS.


### Installing PhoneGap

Mulberry supports PhoneGap 1.0 (we will release 1.1 support as soon as we can).
Any other version will not work.

Go to [the PhoneGap download page](http://code.google.com/p/phonegap/downloads/list)
and download the 1.0 release. Extract it to a convenient directory.


#### Installing iOS Phonegap Library

In the extracted phonegap directory, go into iOS, and run the installer.
The xcode project will call the lib that is installed to your computer.


#### Installing Droidgap

You do not need to install droidgap as the Android project template included in
Mulberry already contains the compiled results.


### iOS Development

To build and run apps on iOS Simulator, you must:

- Own an Intel Mac running OSX Snow Leopard or Lion

- Download Xcode 4.1 or greater (preferably 4.2) from the
   [Mac App Store](http://itunes.apple.com/us/app/xcode/id448457090?mt=12)


In order to submit your apps to the Apple iOS App Store, you must
[sign up with Apple's iOS Developer Program](http://developer.apple.com/programs/ios/)

### Android Development

To build and run apps on Android Simulator, you must:

- Install Java SE 1.6 or above (running java -version should output "Java(TM) SE Runtime Environment")

- Ensure the `JAVA_HOME` environment variable is pointing to the Java directory

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


#### Creating an Android Virtual Device

Run the SDK manager by running `android` on the command line.

- On the "Virtual Devices" section click the "New..." button

- Name the device

- Select the Google APIs - API Level 8 (to test 2.2) as the target

- Make the SD card size 64 MB

- Click "Create AVD"

Now you can run the device by running `emulator @your-device-name -partition-size 128`

To rotate the device hit 7 or 9 on your numeric keypad. If you don't have one:
CTRL-F12 to rotate to landscape, CTRL-F11 to rotate back.


#### Installing to your Android Virtual Device

Start the emulator, then type:

	  adb install -r /path/to/your.apk


## Scaffold

Mulberry lets you quickly create the basic structure for an application at the
location you specify. Do not run this from within the Mulberry repo!

    mulberry scaffold myapp

## Configure

The scaffolding step will create a few files and directories. You'll need to
edit the file `config.yml` to provide some basic configuration information. See
the notes in the file for details.

## Construct

The scaffolding step also creates a `sitemap.yml` file. Edit this to describe
the structure of your application. Note that the home and about pages are
created for you automatically, and generally are the only two pages at the top
level of the sitemap; all other pages should be placed below the home page.

    - home:
      - schedule
      - speakers
      - points-of-interest
    - about

In order for your app to work, you'll need a Markdown file in the pages
directory for each page in the sitemap. These files also include some metadata
in the form of a YAML header. At a minimum, you need to specify the title to
display for the page, and the template you want to use. Make sure that the file
you create has the same name as the entry in the sitemap; for example, the home
page should be placed at `pages/home.md`:

    ---
    title: CapitolJS
    template: Home
    ---

    Good afternoon agent. Your mission, should you choose to accept it, involves
    the learning of the programming language JavaScript and how to use it properly
    and effectively. You will be joined by an intimate task force of elite members
    of the JavaScript community to assist you in this task. You may select to
    attend either or both of the evening social events occurring the night before
    and night of the event. This event is happening on September 18th, 2011 in
    Washington, DC at the [Hotel Palomar](http://www.hotelpalomar-arlington.com/).
    If you accept this mission, be sure to follow
    [@capitoljs](http://www.twitter.com/capitoljs) and register today, like all
    JSConf events - it will sell out. See you in Washington DC.

For more on creating pages, see the Creating Pages and Assets documentation.

## Customize

Mulberry allows extensive customization of your application. See the documentation
in the `docs` directory for details.

## Develop

For rapid iteration, you can run your app in a desktop WebKit browser and get
access to your standard development tools. Run the following from the root of
your project:

    mulberry serve

## Test

Generate test builds that you can run in a simulator or on a properly
provisioned device. Run the following from the root of your project:

    mulberry test

## Deploy

Create binaries for the various form factors and operating systems your app
supports. Run the following from the root of your project:

    mulberry deploy

# TODOs

- The repo should include a demo application. One is forthcoming.
- Presently, it's not straightforward to change the icons that the application
  uses in the default theme.
- Many built-in page templates use a legacy system for specifying the layout of
  the template rather than the system documented here. This will be addressed
  for the beta.
- The built-in tablet templates need improvement, and will be receiving a
  significant overhaul.
- Capabilities will only work with built-in components. This will be addressed
  for the beta or sooner.
- The command line tool should use OptionParser.
- Flurry and UrbanAirship integration should be documented.
- The Google Maps tagline is not being displayed on Google Maps pages; this may
  cause Apple to reject an app that uses Google Maps. A fix is coming very soon.
- Document how to create additional themes.
