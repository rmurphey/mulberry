dojo.provide('toura.app.PhoneGap.browser');

// This is adapted from code that is
// MIT licensed
// (c) 2010 Jesse MacFadyen, Nitobi
// https://github.com/purplecabbage/phonegap-plugins

toura.app.PhoneGap.browser = function(pg, device){
  function ChildBrowser() { }
  window.ChildBrowser = ChildBrowser;

  var os = device.os,
      init = {
        ios : function() {
          // Callback when the location of the page changes
          // called from native
          ChildBrowser._onLocationChange = function(newLoc) {
            window.plugins.childBrowser.onLocationChange(newLoc);
          };

          // Callback when the user chooses the 'Done' button
          // called from native
          ChildBrowser._onClose = function() {
            window.plugins.childBrowser.onClose();
          };

          // Callback when the user chooses the 'open in Safari' button
          // called from native
          ChildBrowser._onOpenExternal = function() {
            window.plugins.childBrowser.onOpenExternal();
          };

          // Pages loaded into the ChildBrowser can execute callback scripts, so be careful to
          // check location, and make sure it is a location you trust.
          // Warning ... don't exec arbitrary code, it's risky and could fuck up your app.
          // called from native
          ChildBrowser._onJSCallback = function(js,loc) {
            // Not Implemented
            //window.plugins.childBrowser.onJSCallback(js,loc);
          };

          /* The interface that you will use to access functionality */

          // Show a webpage, will result in a callback to onLocationChange
          ChildBrowser.prototype.showWebPage = function(loc) {
            PhoneGap.exec("ChildBrowserCommand.showWebPage", loc);
          };

          // close the browser, will NOT result in close callback
          ChildBrowser.prototype.close = function() {
            PhoneGap.exec("ChildBrowserCommand.close");
          };

          // Not Implemented
          ChildBrowser.prototype.jsExec = function(jsString) {
            // Not Implemented!!
            //PhoneGap.exec("ChildBrowserCommand.jsExec",jsString);
          };

          // Note: this plugin does NOT install itself, call this method some time after deviceready to install it
          // it will be returned, and also available globally from window.plugins.childBrowser
          ChildBrowser.install = function() {
            if(!window.plugins) {
              window.plugins = {};
            }

            window.plugins.childBrowser = new ChildBrowser();
            return window.plugins.childBrowser;
          };

          ChildBrowser.install();
        },

        android : function() {
          /*
           * Copyright (c) 2005-2010, Nitobi Software Inc.
           * Copyright (c) 2010, IBM Corporation
           */

          ChildBrowser.prototype.showWebPage = function(url, usePhoneGap) {
            PhoneGap.exec(null, null, "ChildBrowser", "showWebPage", [url, usePhoneGap]);
          };

          PhoneGap.addConstructor(function() {
            PhoneGap.addPlugin("childBrowser", new ChildBrowser());
            PluginManager.addService("ChildBrowser", "com.phonegap.plugins.childBrowser.ChildBrowser");
          });
        }
      };

  if (pg && init[os]) {
    init[os]();
  }

  return {
    url : function(url) {
      if (pg) {
        if (os === 'android') {
          PhoneGap.exec(null, null, 'ChildBrowser', 'showWebPage', [url, false]);
        } else {
          window.plugins.childBrowser.showWebPage(url);
        }
        return;
      }

      window.location = url;
    },

    getBrowser : function() {
      if (!window.plugins.childBrowser) {
        throw new Error("Can't find childBrowser plugin");
      }

      return window.plugins.childBrowser;
    }
  };

};

