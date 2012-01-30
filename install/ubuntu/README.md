# Mulberry Ubuntu (11.04) Installation Instructions

Note:
Windows, Linux, and OSX all have different installation methods. Please see the
platform-specific directories located in the `install` directory.

Mulberry tools are used to develop, debug, and test locally on your local browser.
These tools are written in ruby and are available via github or the Mulberry website.

Install via ./install.sh located at the project root directory.

Notes:
### Git

The install.sh process above installed git. Add your github config as per [the instructions on GitHub](http://help.github.com/linux-set-up-git/).


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
