## Installation notes on Ubuntu (64-bit 11.04)

Note: Instructions assume you want to put all the necessary files into `~/dev.` Change this if you like/need to.

### Install Ruby

Here are the commands needed to install ruby, rails, git. ruby comes with Ubuntu 11.04 but its outdated. This method will install the RVM package manager and let you use ruby 1.9.2.

    sudo apt-get update
    sudo apt-get install build-essential git git-core curl
    bash < <(curl -s https://rvm.beginrescueend.com/install/rvm)
    echo '[[ -s "$HOME/.rvm/scripts/rvm" ]] && source "$HOME/.rvm/scripts/rvm"' >> ~/.bashrc 
    . ~/.bashrc
    sudo apt-get install build-essential openssl libreadline6 libreadline6-dev curl git-core zlib1g zlib1g-dev libssl-dev libyaml-dev libsqlite3-0 libsqlite3-dev sqlite3 libxml2-dev libxslt-dev autoconf libc6-dev ncurses-dev automake libtool bison ia32-libs
    rvm install 1.9.2
    rvm --default use 1.9.2
    gem install rails

Notes:

* This is an abridged version of [these instructions](http://ryanbigg.com/2010/12/ubuntu-ruby-rvm-rails-and-you/).
* The third, fourth and fifth command fetches RVM, and adds it to your .bashrc file so that it is loaded for each teminal session.
* The assortment of packages in command 6 (`sudo apt-get install loadsofpackages` may differ for your system. Run `rvm requirements` to check.

### Git

The process above installed git. Add your github config as per [the instructions on GitHub](http://help.github.com/linux-set-up-git/).

### Mulberry environment

Follow the instructions as per the main Mulberry README.md to get the Mulberry environment up and running. As we aren't on a Mac, the iOS instructions aren't valid here...

Note you will run into a couple of issues if you are using Ubuntu x64. These are listed below.

#### Cannot install `therubyracer` gem

When running `bundle install`, the `jshintrb` gem has a dependency on `therubyracer-0.8.0`. This requires V8 which does not compile correctly on Ubuntu 11.04 x64. As a workaround, disable installation of `jshintrb` by manually editing the `GemFile` and commenting out the line which specifies `jshintrb`.

This issue has [been reported](https://github.com/Toura/mulberry/issues/93), hopefully it will be fixed soon :)

#### Android VM cannot be created

When trying to build an AVD, an error appears: 

    Error: Failed to create the SD card.

As per [this thread](http://stackoverflow.com/questions/3878445/ubuntu-error-failed-to-create-the-sd-card#answer-3887112), you need to install `ia32-libs`:
    
    sudo apt-get install ia32-libs

### Setup your Android phone

* On the device, go to Settings > Applications and enable Unknown sources (on an Android 4.0 device, the setting is located in Settings > Security).
* On the device, go to Settings > Applications > Development and enable USB debugging (on an Android 4.0 device, the setting is located in Settings > Developer options).

### Add a udev rule for Android phone

So that we can use adb, we should add a udev rule for the Android device that you will be connecting to your machine:

* Open a terminal and switch to root user
* Create the file `/etc/udev/rules.d/51-android.rules`
* Lookup your USB vendor ID for your phone from [the Android Dev Guide](http://developer.android.com/guide/developing/device.html)
* Add the following line to the newly created file and save (replace XXXX with your vendor ID): `SUBSYSTEM=="usb", ATTR{idVendor}=="XXXX", MODE="0666"`
* Make the file executable: `chmod a+r /etc/udev/rules.d/51-android.rules`

You can verify that your device is connected by executing `adb devices` If connected, you'll see the device name listed as a "device."

## mulberry serve

Follow the normal instructions to run mulberry.

When you come to test out your application using the `mulberry serve` command, you might find that you can't exit the process using the standard Ctrl-C keyboard combo. This is because of [this problem](http://stackoverflow.com/questions/5891567/cant-stop-webrick-1-3-1-with-ctrl-c-on-ubuntu-11-04).

To workaround, from the terminal type:

    Ctrl-C
    Ctrl-Z
    fg
