# Introduction

OTA (Over The Air) updates allow you to update the content of your application
without submitting a new version of your app to the app store. With an OTA
update you can change the text on pages, add new assets, even change the
sitemap for your application -- all without having to wait for app your to be
approved before users can receive it.

To help you get a big picture understanding of how OTA's work, and the
potential pitfalls, we're going to describe the main actors in the app
[content] update process and several different OTA scenarios.

# The Players in App Content Distribution

## Mulberry app (project)

It all starts here. This is your Mulberry project. It contains the source code
for your app and the tools to build it for submission to app stores whence it
will ultimately be distributed to users' devices.

It also contains the tools to manage OTA's directly to those devices.

## App store

This is the original gatekeeper to end user's devices. You can't even begin to
talk about OTA's for your app until it is installed on the device, which is
what the app store does. It is also the mechanism through which updates that
entail source code changes get distributed to devices.

The app store is not involved directly in the actual over-the-air update
itself, but is an important player in the overall OTA management process.

## Deployed app

Once your app has gotten past the app store and installed onto a device, it is
ready to receive OTA's (if it was configured to be OTA enabled when it was
deployed). The only way to disable OTA's is to disable it in your project and
deploy an app store update.

## OTA Server

The OTA Server distributes your over-the-air updates directly to devices. You
publish your update to this server and your app installed on the device queries
it for updates.

Toura provides an OTA server that you can use for OTA's for your Mulberry
apps.

# OTA Scenarios

There are different scenarios in which you can publish an OTA for your app with
different possible consequences to consider. It is possible, in some cases, to
deploy an OTA that breaks your app and leave your users stuck without an update
for weeks, potentially. Thus, it is very important to consider these
consequences when you publish an OTA update.

Some of the different scenarios are discussed below.

## OTA with New App, Publish on Deploy

The simplest scenario is publishing a brand new app for the first time, with
OTA's enabled:

![OTA with New App, Publish on Deploy](http://www.lucidchart.com/publicSegments/view/4eeba060-abbc-4342-b224-53aa0a0226bf/image.png)

When you run `mulberry deploy` on your project, if there is no existing version
yet on the OTA server, it will automatically publish version 1 to it. This is
also the version used in the build output by `mulberry deploy` that you submit
to the app store and that will eventually be installed on users' devices.

When the app is booted after installation, it checks the OTA server to see if
any new later versions of your app's content have been published, sees that
there are none and therefore does not download any updates.

##  OTA with Existing App, Publish on Deploy

Once you've got an OTA-enabled app installed on a device, it is ready to
receive OTA's.

On a subsequent run of `mulberry deploy` it will no longer
automatically publish a new version to the OTA server.  But it will if you pass
the `--publish-ota` flag to it:

![OTA with Existing App, Publish on Deploy](http://www.lucidchart.com/publicSegments/view/4eeb9ff9-d7e4-4ba2-b477-6ddb0a56de19/image.png)

After the new version of your app content has been published to the OTA
server and bundled with your app store submission, it may be weeks before
your app is approved and ready to be installed on devices.  In the meantime,
existing OTA-enabled deployments can receive the update.

If the OTA is OK, devices that already have the previous version installed can
receive the content update before the app store version of the app is ready
(Devices A and B). Device A above gets the OTA, but for whatever reason does
not install the app store update; it still gets the benefit of the new content.
Device C, though it was OTA-enabled, did not get the OTA for whatever reason
(maybe the user just never used it during the time period between between app
store submission and approval), but still gets the content update bundled along
with the new app store version when it installs it.

**Note: The OTA does not distribute JavaScript source code, only content. If
the nature of the change to your app's content is such that only the newer
version of the source code is able to process it without breaking, then the
receivers of the this OTA (Devices A and B) could be stuck for weeks with a
broken app and no way to fix it.**

## OTA with Existing App, Publish on Approval

If you do not pass the `--publish-ota` flag to `mulberry deploy` it will not
auto-publish a new version to the OTA server:

![OTA with Existing App, Publish on Approval](http://www.lucidchart.com/publicSegments/view/4eeba02b-7144-4da6-b1d0-4bb70a56bd61/image.png)

If you tag this version in your SCCM, check it out once the app has been
approved, and then run `mulberry publish_ota` to publish the update to the OTA
server, there is no possibility of any device with code that is incompatible
with the new content receiving it before the app store version with compatible
code is available for download.

This is the safer way to deploy your OTA-enabled apps, but there is more
management overhead. The downside is that even if the older app store version
of your app is able to receive the new content it will still have to wait until
the new app store version is approved before getting it.

Strictly speaking, it is not actually necessary to do the publish to the OTA
server in this scenario unless you want to support content updates to devices
that for whatever reason do not install the app store update (Device A).

## OTA with Existing App, Publish Without Deployment

It is also possible to publish content updates without deploying a new app
store version of your app to devices:

![OTA with Existing App, Publish Without Deployment](http://www.lucidchart.com/publicSegments/view/4eeba757-cd54-4f83-893d-57b00a56bbe4/image.png)

You may want to do this simply because you want to get some new content out to
your users but you are not ready to submit a new app store update yet. Or you
may simply want to send regular content updates to your users between new app
store versions of your app.

This is the kind of OTA that you want to be really sure will not break apps.
The changes should be confined to the kind that you know are safe for your app.

## Safe/Unsafe Updates

Generally, adding new assets can be considered safe.

Removing assets is risky. Be sure there are no dependencies in the deployed
JavaScript code on any specific assets that you remove.

Changing the sitemap is also risky. Again, be sure that there are no
dependencies in the deployed JavaScript code on the particular page hierarchy
that it shipped with.

# Media Assets

For media assets such as images, audios, and videos, it is not possible to
update the actual binary content over the air. You can change captions and
other metadata, but not the file itself. Removal of assets, though for all
intents and purposes will make the asset unavailable to the app, will not
delete the actual files from the device (in case you were hoping to shrink the
app's storage requirements with an OTA).

The exception to this is streaming assets, which are referenced with full URI's
in your pages. New assets added as streaming assets to your pages will be
available to your app in an OTA.

# Configuration

It's easy to set up your app for OTA's.  Just ...

Add the details for the OTA server to your `config.yml`:

    toura_api:
     url: https://api.toura.com/
     key: your_app_key
     secret: your_app_secret

You can sign up to create an application that can receive OTA's at
[http://api.toura.com/](http://api.toura.com/).

Also in `config.yml`, enable/disable OTA's for your app like so

    ota:
      enabled: true


