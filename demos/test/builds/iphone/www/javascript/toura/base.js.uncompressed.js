/*************************************
 * Copyright 2011 Toura, LLC.
 * All Rights Reserved.
 ************************************/
dojo.provide("toura.base");
if(!dojo._hasResource['toura.Utilities']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.Utilities'] = true;
dojo.provide('toura.Utilities');

// You should have a very, very good reason to put something in this file.

dojo.forIn = function(obj, fn, scope) {
  for (var k in obj) {
    if (obj.hasOwnProperty(k)) {
      dojo.hitch(scope || window, fn)(k, obj[k]);
    }
  }
};

toura.util = {
  truncate : function(text, len) {
    var oldText;

    len = len || 200;

    text = text
      .replace('<\/p>',' ')
      .replace('<br>',' ')
      .replace(toura.regex.stripHTML, '');

    oldText = text = dojo.trim(text);

    text = text.substr(0, len);

    if (text && oldText.length > len) {
      text = text + ' &hellip;';
    }

    return text;
  },

  copyStyles : function(fromEl, toEl, styles) {
    var fromStyles = window.getComputedStyle(fromEl);

    // TODO: Filter this, then call dojo.style once?
    dojo.forEach(styles, function(style) {
      dojo.style(toEl, style,
        fromStyles[style]
      );
    });
  }

};

toura.regex = {
  stripHTML : /(<\/.>)|(<.>)|(<[^b][^r]?[^>]*>)/g
};

toura.tmpl = function(str, data) {
  return dojo.string.substitute(str, data);
};

toura.haml = Haml;

toura.populate = function(targetNode, tpl, data) {
  console.log('populating', arguments);
  targetNode.innerHTML = dojo.map(data, tpl).join('');
};

toura.datasource = function(name, proto) {
  dojo.declare('client.data.' + name, null, proto);
};

}

if(!dojo._hasResource['toura._Logging']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura._Logging'] = true;
dojo.provide('toura._Logging');

(function(d, w, c) {

var lastSection,
    sep = '=====',
    lastTime;

function getTimeElapsed(ts) {
  var str = '';

  if (!lastTime) {
    lastTime = ts;
  } else {
    str = ' (' + (ts - lastTime) + 'ms since last log) ';
    lastTime = ts;
  }

  return str;
}

d.mixin(toura,{
  log : function() {
        var msg = [].slice.call(arguments);

    if (w.device) {
      console.log('\n\n ' + new Date().getTime() + ' ' + msg.join(' ') + '\n\n');
    } else {
      c.log.apply(c, msg);
    }
      },

  logSection : function(sectionName) {
        var ts = new Date().getTime();
    console.log((w.device ? '\n' : '') + sep + '\n' + ts + '   START ' + sectionName +
      getTimeElapsed(ts) +
    '\n' + sep);
      },

  endLogSection : function(sectionName) {
        var ts = new Date().getTime();
    console.log((w.device ? '\n' : '') + sep + '\n' + ts + '   END   ' + sectionName +
      getTimeElapsed(ts) +
    '\n' + sep);
      }
});

}(dojo, window, console));

}

if(!dojo._hasResource['toura.app.Phonegap.device']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.app.Phonegap.device'] = true;
dojo.provide('toura.app.Phonegap.device');

(function() {

  function parseVersion(ua) {
    if (!ua) {
      return 'unknown';
    }

    if (!dojo.isString(ua)) {
      return 'unknown';
    }

    if (!dojo.trim(ua)) {
      return 'unknown';
    }

    var v;

    if (ua.match('Android')) {
      v = dojo.trim(
            ua.split('Android')[1].split(';')[0]
          ).split('-')[0].split('.');

      return assembleVersion(v);
    }

    if (ua.indexOf('AppleWebKit') > -1 &&
      (ua.indexOf('iPhone') + ua.indexOf('iPad') + ua.indexOf('iPod')) >= 0
    ) {
      // let's cross this bridge another day
      return 'unknown-ios-webkit';
    }

    // SOL
    return 'unknown';
  }

  function assembleVersion(version) {
    return [ version[0], version[1] || '0' ].join('-');
  }

  toura.app.Phonegap.device = function(pg, device) {
    return {
      version : (function() {
        // http://www.zytrax.com/tech/web/mobile_ids.html
        if (pg) {
          return assembleVersion(window.device.version.split('-')[0].split('.'));
        }

        return parseVersion(window.navigator.userAgent);
      }()),

      _parseVersion : parseVersion
    };
  };

}());

}

if(!dojo._hasResource['toura.app.Phonegap.network']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.app.Phonegap.network'] = true;
dojo.provide('toura.app.Phonegap.network');

toura.app.Phonegap.network = function(pg, device) {
  var n = navigator,
      interval = 5 * 60 * 1000,
      state,
      checked,
      reachable;

  return {
    /**
     * @public
     *
     * Whether the network is currently in a reachable state. If the method
     * reports that the network is not currently reachable, then it will cache
     * that status for 5 minutes before checking again.
     *
     * @returns {Promise} A promise that, when resolved, will resolve with a
     * boolean, with `true` indicating the network is reachable.
     */
    isReachable : function(domain) {

      console.log('toura.app.Phonegap.network::isReachable()');

      var dfd = new dojo.Deferred(),
          now = new Date().getTime();

      if (
        // we have checked for reachability before
        checked &&

        // last time we checked, it was not reachable
        !reachable &&

        // it has not been long enough since we last checked that we should
        // bother checking again
        (now - checked < interval)
      ) {
        // decide that the network is not reachable and be done with it
        dfd.resolve(reachable);
        return dfd;
      }

      checked = now;

      if (navigator.network && navigator.network.connection) {
        state = navigator.network.connection.type;

        if (state === Connection.UNKNOWN || state === Connection.NONE) {
          reachable = false;
        } else {
          reachable = true;
        }
      } else {
        reachable = true;
      }

      dfd.resolve(reachable);

      return dfd.promise;
    }
  };
};

}

if(!dojo._hasResource['toura.app.Phonegap.analytics']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.app.Phonegap.analytics'] = true;
dojo.provide('toura.app.Phonegap.analytics');

toura.app.Phonegap.analytics = function(pg, device) {
  var os = device.os,
      appName;

  return {
    log : (function() {
      function getAppName() {
        appName = appName || toura.app.Config.get('app').name.replace(/[^a-zA-Z]/g, '');
        return appName;
      }

      return toura.app.Phonegap.present ?
        function(evt, params) {
          console.log('toura.app.Phonegap::logAnalyticsEvent()');
          PhoneGap.exec(
            function() {},
            function(error) { toura.log("Could not log flurry event.  Error: " + error); },
            'FlurryCommand', 'logEvent', [evt, params]
          );
        }
        :
        function(evt, params) {
          console.log('toura.app.Phonegap::logAnalyticsEvent()');
        };

    }())
  };
};

}

if(!dojo._hasResource['toura.app.Phonegap.audio']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.app.Phonegap.audio'] = true;
dojo.provide('toura.app.Phonegap.audio');

toura.app.Phonegap.audio = function(pg, device) {
  var audio,
      audioSuccess = function() { },
      audioError = function(err) { };

  return {
    play : function(url) {
      console.log('toura.app.Phonegap.audio::play()');

      if (!pg) { return; }

      url = /^http/.test(url) ? url : ('/android_asset/www/' + url);
      audio = new Media(url, audioSuccess, audioError);
      audio.play();
    },

    stop : function() {
      console.log('toura.app.Phonegap.audio::stop()');

      if (!pg || !audio) { return; }

      audio.pause();
    },

    destroy : function() {
      if (!audio) { return; }

      audio.stop();
      audio.release();

      audio = null;
    }
  };
};

}

if(!dojo._hasResource['vendor.urbanairship.push']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['vendor.urbanairship.push'] = true;
dojo.provide('vendor.urbanairship.push');

vendor.urbanairship.push = function() {
  var PushNotification = function() {

  }

  // call this to register for push notifications
  PushNotification.prototype.register = function(success, fail, options) {
      PhoneGap.exec(success, fail, "PushNotification", "registerAPN", options);
  };

  // call this to notify the plugin that the device is ready
  PushNotification.prototype.startNotify = function(notificationCallback) {
      PhoneGap.exec(null, null, "PushNotification", "startNotify", []/* BUG - dies on null */);
  };

  // use this to log from JS to the Xcode console - useful!
  PushNotification.prototype.log = function(message) {
      PhoneGap.exec(null, null, "PushNotification", "log", [{"msg":message}]);
  };

  PhoneGap.addConstructor(function()
  {
    if(!window.plugins)
    {
      window.plugins = {};
    }
    window.plugins.pushNotification = new PushNotification();
  });
};

}

if(!dojo._hasResource['toura.app.Phonegap.push']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.app.Phonegap.push'] = true;
dojo.provide('toura.app.Phonegap.push');



toura.app.Phonegap.push = function(pg, device) {
  if (!pg) { return; }
  vendor.urbanairship.push();
};

}

if(!dojo._hasResource['toura.app.Phonegap.browser']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.app.Phonegap.browser'] = true;
dojo.provide('toura.app.Phonegap.browser');

// This is adapted from code that is
// MIT licensed
// (c) 2010 Jesse MacFadyen, Nitobi
// https://github.com/purplecabbage/phonegap-plugins

toura.app.Phonegap.browser = function(pg, device){
  function ChildBrowser() { }
  window.ChildBrowser = ChildBrowser;

  var os = device.os,
      init = {
        ios : function() {
          /*global PhoneGap */

          function ChildBrowser() {
            // Does nothing
          }

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

  if (pg) {
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


}

if(!dojo._hasResource['toura.app.Phonegap']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.app.Phonegap'] = true;
dojo.provide('toura.app.Phonegap');








(function() {

  var subscription = dojo.subscribe('/app/start', function() {

    var tap = toura.app.Phonegap,
        device = toura.app.Config.get('device'),
        phonegapPresent = tap.present = window.device && window.device.phonegap;

    /**
     * To add more functionality, create a module in the toura.app.Phonegap
     * namespace. The module itself should reference a function that returns an
     * object. So, toura.app.Phonegap.device is a function that returns the
     * toura.app.Phonegap.device.* methods and properties.
     *
     * Be sure to add the module's name to the list below AND to the list of
     * requires at the top of this file.
     */
    dojo.forEach([
      'device',
      'network',
      'analytics',
      'audio',
      'push',
      'browser'
    ], function(item) {
      if (!tap[item]) {
        throw 'No such phonegap item ' + item;
      }

      tap[item] = tap[item](phonegapPresent, device);
    });

    dojo.unsubscribe(subscription);
  });

}());

}

if(!dojo._hasResource["toura.app.xhr"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["toura.app.xhr"] = true;
/***********************************
 * This is a patched file from Dojo version 1.5.0. We had to patch it to deal
 * with the fact that Dojo sets the Content-Type header on all XHRs if none is
 * specified, which was messing with the hash for the data on S3.
 *
 * Here is the diff:
 
      873,874c880,884
      < 		// FIXME: is this appropriate for all content types?
      < 		xhr.setRequestHeader("Content-Type", args.contentType || _defaultContentType);
      ---
      > 
      >                 if (args.contentType !== false) {
      >                   xhr.setRequestHeader("Content-Type", args.contentType || _defaultContentType);
      >                 }
      > 

*/
dojo.provide("toura.app.xhr");



	var _d = dojo, cfg = _d.config;

	function setValue(/*Object*/obj, /*String*/name, /*String*/value){
		//summary:
		//		For the named property in object, set the value. If a value
		//		already exists and it is a string, convert the value to be an
		//		array of values.

		//Skip it if there is no value
		if(value === null){
			return;
		}

		var val = obj[name];
		if(typeof val == "string"){ // inline'd type check
			obj[name] = [val, value];
		}else if(_d.isArray(val)){
			val.push(value);
		}else{
			obj[name] = value;
		}
	}
	
	dojo.fieldToObject = function(/*DOMNode||String*/ inputNode){
		// summary:
		//		Serialize a form field to a JavaScript object.
		//
		// description:
		//		Returns the value encoded in a form field as
		//		as a string or an array of strings. Disabled form elements
		//		and unchecked radio and checkboxes are skipped.	Multi-select
		//		elements are returned as an array of string values.
		var ret = null;
		var item = _d.byId(inputNode);
		if(item){
			var _in = item.name;
			var type = (item.type||"").toLowerCase();
			if(_in && type && !item.disabled){
				if(type == "radio" || type == "checkbox"){
					if(item.checked){ ret = item.value }
				}else if(item.multiple){
					ret = [];
					_d.query("option", item).forEach(function(opt){
						if(opt.selected){
							ret.push(opt.value);
						}
					});
				}else{
					ret = item.value;
				}
			}
		}
		return ret; // Object
	}

	dojo.formToObject = function(/*DOMNode||String*/ formNode){
		// summary:
		//		Serialize a form node to a JavaScript object.
		// description:
		//		Returns the values encoded in an HTML form as
		//		string properties in an object which it then returns. Disabled form
		//		elements, buttons, and other non-value form elements are skipped.
		//		Multi-select elements are returned as an array of string values.
		//
		// example:
		//		This form:
		//		|	<form id="test_form">
		//		|		<input type="text" name="blah" value="blah">
		//		|		<input type="text" name="no_value" value="blah" disabled>
		//		|		<input type="button" name="no_value2" value="blah">
		//		|		<select type="select" multiple name="multi" size="5">
		//		|			<option value="blah">blah</option>
		//		|			<option value="thud" selected>thud</option>
		//		|			<option value="thonk" selected>thonk</option>
		//		|		</select>
		//		|	</form>
		//
		//		yields this object structure as the result of a call to
		//		formToObject():
		//
		//		|	{ 
		//		|		blah: "blah",
		//		|		multi: [
		//		|			"thud",
		//		|			"thonk"
		//		|		]
		//		|	};

		var ret = {};
		var exclude = "file|submit|image|reset|button|";
		_d.forEach(dojo.byId(formNode).elements, function(item){
			var _in = item.name;
			var type = (item.type||"").toLowerCase();
			if(_in && type && exclude.indexOf(type) == -1 && !item.disabled){
				setValue(ret, _in, _d.fieldToObject(item));
				if(type == "image"){
					ret[_in+".x"] = ret[_in+".y"] = ret[_in].x = ret[_in].y = 0;
				}
			}
		});
		return ret; // Object
	}

	dojo.objectToQuery = function(/*Object*/ map){
		//	summary:
		//		takes a name/value mapping object and returns a string representing
		//		a URL-encoded version of that object.
		//	example:
		//		this object:
		//
		//		|	{ 
		//		|		blah: "blah",
		//		|		multi: [
		//		|			"thud",
		//		|			"thonk"
		//		|		]
		//		|	};
		//
		//	yields the following query string:
		//	
		//	|	"blah=blah&multi=thud&multi=thonk"

		// FIXME: need to implement encodeAscii!!
		var enc = encodeURIComponent;
		var pairs = [];
		var backstop = {};
		for(var name in map){
			var value = map[name];
			if(value != backstop[name]){
				var assign = enc(name) + "=";
				if(_d.isArray(value)){
					for(var i=0; i < value.length; i++){
						pairs.push(assign + enc(value[i]));
					}
				}else{
					pairs.push(assign + enc(value));
				}
			}
		}
		return pairs.join("&"); // String
	}

	dojo.formToQuery = function(/*DOMNode||String*/ formNode){
		// summary:
		//		Returns a URL-encoded string representing the form passed as either a
		//		node or string ID identifying the form to serialize
		return _d.objectToQuery(_d.formToObject(formNode)); // String
	}

	dojo.formToJson = function(/*DOMNode||String*/ formNode, /*Boolean?*/prettyPrint){
		// summary:
		//		Create a serialized JSON string from a form node or string
		//		ID identifying the form to serialize
		return _d.toJson(_d.formToObject(formNode), prettyPrint); // String
	}

	dojo.queryToObject = function(/*String*/ str){
		// summary:
		//		Create an object representing a de-serialized query section of a
		//		URL. Query keys with multiple values are returned in an array.
		//
		// example:
		//		This string:
		//
		//	|		"foo=bar&foo=baz&thinger=%20spaces%20=blah&zonk=blarg&"
		//		
		//		results in this object structure:
		//
		//	|		{
		//	|			foo: [ "bar", "baz" ],
		//	|			thinger: " spaces =blah",
		//	|			zonk: "blarg"
		//	|		}
		//	
		//		Note that spaces and other urlencoded entities are correctly
		//		handled.

		// FIXME: should we grab the URL string if we're not passed one?
		var ret = {};
		var qp = str.split("&");
		var dec = decodeURIComponent;
		_d.forEach(qp, function(item){
			if(item.length){
				var parts = item.split("=");
				var name = dec(parts.shift());
				var val = dec(parts.join("="));
				if(typeof ret[name] == "string"){ // inline'd type check
					ret[name] = [ret[name]];
				}

				if(_d.isArray(ret[name])){
					ret[name].push(val);
				}else{
					ret[name] = val;
				}
			}
		});
		return ret; // Object
	}

	// need to block async callbacks from snatching this thread as the result
	// of an async callback might call another sync XHR, this hangs khtml forever
	// must checked by watchInFlight()

	dojo._blockAsync = false;

	// MOW: remove dojo._contentHandlers alias in 2.0
	var handlers = _d._contentHandlers = dojo.contentHandlers = {
		// summary: 
		//		A map of availble XHR transport handle types. Name matches the
		//		`handleAs` attribute passed to XHR calls.
		//
		// description:
		//		A map of availble XHR transport handle types. Name matches the
		//		`handleAs` attribute passed to XHR calls. Each contentHandler is
		//		called, passing the xhr object for manipulation. The return value
		//		from the contentHandler will be passed to the `load` or `handle` 
		//		functions defined in the original xhr call. 
		//		
		// example:
		//		Creating a custom content-handler:
		//	|	dojo.contentHandlers.makeCaps = function(xhr){
		//	|		return xhr.responseText.toUpperCase();
		//	|	}
		//	|	// and later:
		//	|	dojo.xhrGet({ 
		//	|		url:"foo.txt",
		//	|		handleAs:"makeCaps",
		//	|		load: function(data){ /* data is a toUpper version of foo.txt */ }
		//	|	});

		text: function(xhr){ 
			// summary: A contentHandler which simply returns the plaintext response data
			return xhr.responseText; 
		},
		json: function(xhr){
			// summary: A contentHandler which returns a JavaScript object created from the response data
			return _d.fromJson(xhr.responseText || null);
		},
		"json-comment-filtered": function(xhr){ 
			// summary: A contentHandler which expects comment-filtered JSON. 
			// description: 
			//		A contentHandler which expects comment-filtered JSON. 
			//		the json-comment-filtered option was implemented to prevent
			//		"JavaScript Hijacking", but it is less secure than standard JSON. Use
			//		standard JSON instead. JSON prefixing can be used to subvert hijacking.
			//		
			//		Will throw a notice suggesting to use application/json mimetype, as
			//		json-commenting can introduce security issues. To decrease the chances of hijacking,
			//		use the standard `json` contentHandler, and prefix your "JSON" with: {}&& 
			//		
			//		use djConfig.useCommentedJson = true to turn off the notice
			if(!dojo.config.useCommentedJson){
				console.warn("Consider using the standard mimetype:application/json."
					+ " json-commenting can introduce security issues. To"
					+ " decrease the chances of hijacking, use the standard the 'json' handler and"
					+ " prefix your json with: {}&&\n"
					+ "Use djConfig.useCommentedJson=true to turn off this message.");
			}

			var value = xhr.responseText;
			var cStartIdx = value.indexOf("\/*");
			var cEndIdx = value.lastIndexOf("*\/");
			if(cStartIdx == -1 || cEndIdx == -1){
				throw new Error("JSON was not comment filtered");
			}
			return _d.fromJson(value.substring(cStartIdx+2, cEndIdx));
		},
		javascript: function(xhr){ 
			// summary: A contentHandler which evaluates the response data, expecting it to be valid JavaScript

			// FIXME: try Moz and IE specific eval variants?
			return _d.eval(xhr.responseText);
		},
		xml: function(xhr){
			// summary: A contentHandler returning an XML Document parsed from the response data
			var result = xhr.responseXML;
						return result; // DOMDocument
		},
		"json-comment-optional": function(xhr){
			// summary: A contentHandler which checks the presence of comment-filtered JSON and 
			//		alternates between the `json` and `json-comment-filtered` contentHandlers.
			if(xhr.responseText && /^[^{\[]*\/\*/.test(xhr.responseText)){
				return handlers["json-comment-filtered"](xhr);
			}else{
				return handlers["json"](xhr);
			}
		}
	};

	/*=====
	dojo.__IoArgs = function(){
		//	url: String
		//		URL to server endpoint.
		//	content: Object?
		//		Contains properties with string values. These
		//		properties will be serialized as name1=value2 and
		//		passed in the request.
		//	timeout: Integer?
		//		Milliseconds to wait for the response. If this time
		//		passes, the then error callbacks are called.
		//	form: DOMNode?
		//		DOM node for a form. Used to extract the form values
		//		and send to the server.
		//	preventCache: Boolean?
		//		Default is false. If true, then a
		//		"dojo.preventCache" parameter is sent in the request
		//		with a value that changes with each request
		//		(timestamp). Useful only with GET-type requests.
		//	handleAs: String?
		//		Acceptable values depend on the type of IO
		//		transport (see specific IO calls for more information).
		// 	rawBody: String?
		// 		Sets the raw body for an HTTP request. If this is used, then the content
		// 		property is ignored. This is mostly useful for HTTP methods that have
		// 		a body to their requests, like PUT or POST. This property can be used instead
		// 		of postData and putData for dojo.rawXhrPost and dojo.rawXhrPut respectively.
		//	ioPublish: Boolean?
		//		Set this explicitly to false to prevent publishing of topics related to
		// 		IO operations. Otherwise, if djConfig.ioPublish is set to true, topics
		// 		will be published via dojo.publish for different phases of an IO operation.
		// 		See dojo.__IoPublish for a list of topics that are published.
		//	load: Function?
		//		This function will be
		//		called on a successful HTTP response code.
		//	error: Function?
		//		This function will
		//		be called when the request fails due to a network or server error, the url
		//		is invalid, etc. It will also be called if the load or handle callback throws an
		//		exception, unless djConfig.debugAtAllCosts is true.  This allows deployed applications
		//		to continue to run even when a logic error happens in the callback, while making
		//		it easier to troubleshoot while in debug mode.
		//	handle: Function?
		//		This function will
		//		be called at the end of every request, whether or not an error occurs.
		this.url = url;
		this.content = content;
		this.timeout = timeout;
		this.form = form;
		this.preventCache = preventCache;
		this.handleAs = handleAs;
		this.ioPublish = ioPublish;
		this.load = function(response, ioArgs){
			// ioArgs: dojo.__IoCallbackArgs
			//		Provides additional information about the request.
			// response: Object
			//		The response in the format as defined with handleAs.
		}
		this.error = function(response, ioArgs){
			// ioArgs: dojo.__IoCallbackArgs
			//		Provides additional information about the request.
			// response: Object
			//		The response in the format as defined with handleAs.
		}
		this.handle = function(loadOrError, response, ioArgs){
			// loadOrError: String
			//		Provides a string that tells you whether this function
			//		was called because of success (load) or failure (error).
			// response: Object
			//		The response in the format as defined with handleAs.
			// ioArgs: dojo.__IoCallbackArgs
			//		Provides additional information about the request.
		}
	}
	=====*/

	/*=====
	dojo.__IoCallbackArgs = function(args, xhr, url, query, handleAs, id, canDelete, json){
		//	args: Object
		//		the original object argument to the IO call.
		//	xhr: XMLHttpRequest
		//		For XMLHttpRequest calls only, the
		//		XMLHttpRequest object that was used for the
		//		request.
		//	url: String
		//		The final URL used for the call. Many times it
		//		will be different than the original args.url
		//		value.
		//	query: String
		//		For non-GET requests, the
		//		name1=value1&name2=value2 parameters sent up in
		//		the request.
		//	handleAs: String
		//		The final indicator on how the response will be
		//		handled.
		//	id: String
		//		For dojo.io.script calls only, the internal
		//		script ID used for the request.
		//	canDelete: Boolean
		//		For dojo.io.script calls only, indicates
		//		whether the script tag that represents the
		//		request can be deleted after callbacks have
		//		been called. Used internally to know when
		//		cleanup can happen on JSONP-type requests.
		//	json: Object
		//		For dojo.io.script calls only: holds the JSON
		//		response for JSONP-type requests. Used
		//		internally to hold on to the JSON responses.
		//		You should not need to access it directly --
		//		the same object should be passed to the success
		//		callbacks directly.
		this.args = args;
		this.xhr = xhr;
		this.url = url;
		this.query = query;
		this.handleAs = handleAs;
		this.id = id;
		this.canDelete = canDelete;
		this.json = json;
	}
	=====*/


	/*=====
	dojo.__IoPublish = function(){
		// 	summary:
		// 		This is a list of IO topics that can be published
		// 		if djConfig.ioPublish is set to true. IO topics can be
		// 		published for any Input/Output, network operation. So,
		// 		dojo.xhr, dojo.io.script and dojo.io.iframe can all
		// 		trigger these topics to be published.
		//	start: String
		//		"/dojo/io/start" is sent when there are no outstanding IO
		// 		requests, and a new IO request is started. No arguments
		// 		are passed with this topic.
		//	send: String
		//		"/dojo/io/send" is sent whenever a new IO request is started.
		// 		It passes the dojo.Deferred for the request with the topic.
		//	load: String
		//		"/dojo/io/load" is sent whenever an IO request has loaded
		// 		successfully. It passes the response and the dojo.Deferred
		// 		for the request with the topic.
		//	error: String
		//		"/dojo/io/error" is sent whenever an IO request has errored.
		// 		It passes the error and the dojo.Deferred
		// 		for the request with the topic.
		//	done: String
		//		"/dojo/io/done" is sent whenever an IO request has completed,
		// 		either by loading or by erroring. It passes the error and
		// 		the dojo.Deferred for the request with the topic.
		//	stop: String
		//		"/dojo/io/stop" is sent when all outstanding IO requests have
		// 		finished. No arguments are passed with this topic.
		this.start = "/dojo/io/start";
		this.send = "/dojo/io/send";
		this.load = "/dojo/io/load";
		this.error = "/dojo/io/error";
		this.done = "/dojo/io/done";
		this.stop = "/dojo/io/stop";
	}
	=====*/


	dojo._ioSetArgs = function(/*dojo.__IoArgs*/args,
			/*Function*/canceller,
			/*Function*/okHandler,
			/*Function*/errHandler){
		//	summary: 
		//		sets up the Deferred and ioArgs property on the Deferred so it
		//		can be used in an io call.
		//	args:
		//		The args object passed into the public io call. Recognized properties on
		//		the args object are:
		//	canceller:
		//		The canceller function used for the Deferred object. The function
		//		will receive one argument, the Deferred object that is related to the
		//		canceller.
		//	okHandler:
		//		The first OK callback to be registered with Deferred. It has the opportunity
		//		to transform the OK response. It will receive one argument -- the Deferred
		//		object returned from this function.
		//	errHandler:
		//		The first error callback to be registered with Deferred. It has the opportunity
		//		to do cleanup on an error. It will receive two arguments: error (the 
		//		Error object) and dfd, the Deferred object returned from this function.

		var ioArgs = {args: args, url: args.url};

		//Get values from form if requestd.
		var formObject = null;
		if(args.form){ 
			var form = _d.byId(args.form);
			//IE requires going through getAttributeNode instead of just getAttribute in some form cases, 
			//so use it for all.  See #2844
			var actnNode = form.getAttributeNode("action");
			ioArgs.url = ioArgs.url || (actnNode ? actnNode.value : null); 
			formObject = _d.formToObject(form);
		}

		// set up the query params
		var miArgs = [{}];
	
		if(formObject){
			// potentially over-ride url-provided params w/ form values
			miArgs.push(formObject);
		}
		if(args.content){
			// stuff in content over-rides what's set by form
			miArgs.push(args.content);
		}
		if(args.preventCache){
			miArgs.push({"dojo.preventCache": new Date().valueOf()});
		}
		ioArgs.query = _d.objectToQuery(_d.mixin.apply(null, miArgs));
	
		// .. and the real work of getting the deferred in order, etc.
		ioArgs.handleAs = args.handleAs || "text";
		var d = new _d.Deferred(canceller);
		d.addCallbacks(okHandler, function(error){
			return errHandler(error, d);
		});

		//Support specifying load, error and handle callback functions from the args.
		//For those callbacks, the "this" object will be the args object.
		//The callbacks will get the deferred result value as the
		//first argument and the ioArgs object as the second argument.
		var ld = args.load;
		if(ld && _d.isFunction(ld)){
			d.addCallback(function(value){
				return ld.call(args, value, ioArgs);
			});
		}
		var err = args.error;
		if(err && _d.isFunction(err)){
			d.addErrback(function(value){
				return err.call(args, value, ioArgs);
			});
		}
		var handle = args.handle;
		if(handle && _d.isFunction(handle)){
			d.addBoth(function(value){
				return handle.call(args, value, ioArgs);
			});
		}

		//Plug in topic publishing, if dojo.publish is loaded.
		if(cfg.ioPublish && _d.publish && ioArgs.args.ioPublish !== false){
			d.addCallbacks(
				function(res){
					_d.publish("/dojo/io/load", [d, res]);
					return res;
				},
				function(res){
					_d.publish("/dojo/io/error", [d, res]);
					return res;
				}
			);
			d.addBoth(function(res){
				_d.publish("/dojo/io/done", [d, res]);
				return res;
			});
		}

		d.ioArgs = ioArgs;
	
		// FIXME: need to wire up the xhr object's abort method to something
		// analagous in the Deferred
		return d;
	}

	var _deferredCancel = function(/*Deferred*/dfd){
		// summary: canceller function for dojo._ioSetArgs call.
		
		dfd.canceled = true;
		var xhr = dfd.ioArgs.xhr;
		var _at = typeof xhr.abort;
		if(_at == "function" || _at == "object" || _at == "unknown"){
			xhr.abort();
		}
		var err = dfd.ioArgs.error;
		if(!err){
			err = new Error("xhr cancelled");
			err.dojoType="cancel";
		}
		return err;
	}
	var _deferredOk = function(/*Deferred*/dfd){
		// summary: okHandler function for dojo._ioSetArgs call.

		var ret = handlers[dfd.ioArgs.handleAs](dfd.ioArgs.xhr);
		return ret === undefined ? null : ret;
	}
	var _deferError = function(/*Error*/error, /*Deferred*/dfd){
		// summary: errHandler function for dojo._ioSetArgs call.

		if(!dfd.ioArgs.args.failOk){
			console.error(error);
		}
		return error;
	}

	// avoid setting a timer per request. It degrades performance on IE
	// something fierece if we don't use unified loops.
	var _inFlightIntvl = null;
	var _inFlight = [];
	
	
	//Use a separate count for knowing if we are starting/stopping io calls.
	//Cannot use _inFlight.length since it can change at a different time than
	//when we want to do this kind of test. We only want to decrement the count
	//after a callback/errback has finished, since the callback/errback should be
	//considered as part of finishing a request.
	var _pubCount = 0;
	var _checkPubCount = function(dfd){
		if(_pubCount <= 0){
			_pubCount = 0;
			if(cfg.ioPublish && _d.publish && (!dfd || dfd && dfd.ioArgs.args.ioPublish !== false)){
				_d.publish("/dojo/io/stop");
			}
		}
	};

	var _watchInFlight = function(){
		//summary: 
		//		internal method that checks each inflight XMLHttpRequest to see
		//		if it has completed or if the timeout situation applies.
		
		var now = (new Date()).getTime();
		// make sure sync calls stay thread safe, if this callback is called
		// during a sync call and this results in another sync call before the
		// first sync call ends the browser hangs
		if(!_d._blockAsync){
			// we need manual loop because we often modify _inFlight (and therefore 'i') while iterating
			// note: the second clause is an assigment on purpose, lint may complain
			for(var i = 0, tif; i < _inFlight.length && (tif = _inFlight[i]); i++){
				var dfd = tif.dfd;
				var func = function(){
					if(!dfd || dfd.canceled || !tif.validCheck(dfd)){
						_inFlight.splice(i--, 1); 
						_pubCount -= 1;
					}else if(tif.ioCheck(dfd)){
						_inFlight.splice(i--, 1);
						tif.resHandle(dfd);
						_pubCount -= 1;
					}else if(dfd.startTime){
						//did we timeout?
						if(dfd.startTime + (dfd.ioArgs.args.timeout || 0) < now){
							_inFlight.splice(i--, 1);
							var err = new Error("timeout exceeded");
							err.dojoType = "timeout";
							dfd.errback(err);
							//Cancel the request so the io module can do appropriate cleanup.
							dfd.cancel();
							_pubCount -= 1;
						}
					}
				};
				if(dojo.config.debugAtAllCosts){
					func.call(this);
				}else{
					try{
						func.call(this);
					}catch(e){
						dfd.errback(e);
					}
				}
			}
		}

		_checkPubCount(dfd);

		if(!_inFlight.length){
			clearInterval(_inFlightIntvl);
			_inFlightIntvl = null;
			return;
		}
	}

	dojo._ioCancelAll = function(){
		//summary: Cancels all pending IO requests, regardless of IO type
		//(xhr, script, iframe).
		try{
			_d.forEach(_inFlight, function(i){
				try{
					i.dfd.cancel();
				}catch(e){/*squelch*/}
			});
		}catch(e){/*squelch*/}
	}

	//Automatically call cancel all io calls on unload
	//in IE for trac issue #2357.
	
	_d._ioNotifyStart = function(/*Deferred*/dfd){
		// summary:
		// 		If dojo.publish is available, publish topics
		// 		about the start of a request queue and/or the
		// 		the beginning of request.
		// description:
		// 		Used by IO transports. An IO transport should
		// 		call this method before making the network connection.
		if(cfg.ioPublish && _d.publish && dfd.ioArgs.args.ioPublish !== false){
			if(!_pubCount){
				_d.publish("/dojo/io/start");
			}
			_pubCount += 1;
			_d.publish("/dojo/io/send", [dfd]);
		}
	}

	_d._ioWatch = function(dfd, validCheck, ioCheck, resHandle){
		// summary: 
		//		Watches the io request represented by dfd to see if it completes.
		// dfd: Deferred
		//		The Deferred object to watch.
		// validCheck: Function
		//		Function used to check if the IO request is still valid. Gets the dfd
		//		object as its only argument.
		// ioCheck: Function
		//		Function used to check if basic IO call worked. Gets the dfd
		//		object as its only argument.
		// resHandle: Function
		//		Function used to process response. Gets the dfd
		//		object as its only argument.
		var args = dfd.ioArgs.args;
		if(args.timeout){
			dfd.startTime = (new Date()).getTime();
		}
		
		_inFlight.push({dfd: dfd, validCheck: validCheck, ioCheck: ioCheck, resHandle: resHandle});
		if(!_inFlightIntvl){
			_inFlightIntvl = setInterval(_watchInFlight, 50);
		}
		// handle sync requests
		//A weakness: async calls in flight
		//could have their handlers called as part of the
		//_watchInFlight call, before the sync's callbacks
		// are called.
		if(args.sync){
			_watchInFlight();
		}
	}

	var _defaultContentType = "application/x-www-form-urlencoded";

	var _validCheck = function(/*Deferred*/dfd){
		return dfd.ioArgs.xhr.readyState; //boolean
	}
	var _ioCheck = function(/*Deferred*/dfd){
		return 4 == dfd.ioArgs.xhr.readyState; //boolean
	}
	var _resHandle = function(/*Deferred*/dfd){
		var xhr = dfd.ioArgs.xhr;
		if(_d._isDocumentOk(xhr)){
			dfd.callback(dfd);
		}else{
			var err = new Error("Unable to load " + dfd.ioArgs.url + " status:" + xhr.status);
			err.status = xhr.status;
			err.responseText = xhr.responseText;
			dfd.errback(err);
		}
	}

	dojo._ioAddQueryToUrl = function(/*dojo.__IoCallbackArgs*/ioArgs){
		//summary: Adds query params discovered by the io deferred construction to the URL.
		//Only use this for operations which are fundamentally GET-type operations.
		if(ioArgs.query.length){
			ioArgs.url += (ioArgs.url.indexOf("?") == -1 ? "?" : "&") + ioArgs.query;
			ioArgs.query = null;
		}		
	}

	/*=====
	dojo.declare("dojo.__XhrArgs", dojo.__IoArgs, {
		constructor: function(){
			//	summary:
			//		In addition to the properties listed for the dojo._IoArgs type,
			//		the following properties are allowed for dojo.xhr* methods.
			//	handleAs: String?
			//		Acceptable values are: text (default), json, json-comment-optional,
			//		json-comment-filtered, javascript, xml. See `dojo.contentHandlers`
			//	sync: Boolean?
			//		false is default. Indicates whether the request should
			//		be a synchronous (blocking) request.
			//	headers: Object?
			//		Additional HTTP headers to send in the request.
			//	failOk: Boolean?
			//		false is default. Indicates whether a request should be
			//		allowed to fail (and therefore no console error message in
			//		the event of a failure)
			this.handleAs = handleAs;
			this.sync = sync;
			this.headers = headers;
			this.failOk = failOk;
		}
	});
	=====*/

	dojo.xhr = function(/*String*/ method, /*dojo.__XhrArgs*/ args, /*Boolean?*/ hasBody){
		//	summary:
		//		Sends an HTTP request with the given method.
		//	description:
		//		Sends an HTTP request with the given method.
		//		See also dojo.xhrGet(), xhrPost(), xhrPut() and dojo.xhrDelete() for shortcuts
		//		for those HTTP methods. There are also methods for "raw" PUT and POST methods
		//		via dojo.rawXhrPut() and dojo.rawXhrPost() respectively.
		//	method:
		//		HTTP method to be used, such as GET, POST, PUT, DELETE.  Should be uppercase.
		//	hasBody:
		//		If the request has an HTTP body, then pass true for hasBody.

		//Make the Deferred object for this xhr request.
		var dfd = _d._ioSetArgs(args, _deferredCancel, _deferredOk, _deferError);
		var ioArgs = dfd.ioArgs;

		//Pass the args to _xhrObj, to allow alternate XHR calls based specific calls, like
		//the one used for iframe proxies.
		var xhr = ioArgs.xhr = _d._xhrObj(ioArgs.args);
		//If XHR factory fails, cancel the deferred.
		if(!xhr){
			dfd.cancel();
			return dfd;
		}

		//Allow for specifying the HTTP body completely.
		if("postData" in args){
			ioArgs.query = args.postData;
		}else if("putData" in args){
			ioArgs.query = args.putData;
		}else if("rawBody" in args){
			ioArgs.query = args.rawBody;
		}else if((arguments.length > 2 && !hasBody) || "POST|PUT".indexOf(method.toUpperCase()) == -1){
			//Check for hasBody being passed. If no hasBody,
			//then only append query string if not a POST or PUT request.
			_d._ioAddQueryToUrl(ioArgs);
		}

		// IE 6 is a steaming pile. It won't let you call apply() on the native function (xhr.open).
		// workaround for IE6's apply() "issues"
		xhr.open(method, ioArgs.url, args.sync !== true, args.user || undefined, args.password || undefined);
		if(args.headers){
			for(var hdr in args.headers){
				if(hdr.toLowerCase() === "content-type" && !args.contentType){
					args.contentType = args.headers[hdr];
				}else if(args.headers[hdr]){
					//Only add header if it has a value. This allows for instnace, skipping
					//insertion of X-Requested-With by specifying empty value.
					xhr.setRequestHeader(hdr, args.headers[hdr]);
				}
			}
		}

                if (args.contentType !== false) {
                  xhr.setRequestHeader("Content-Type", args.contentType || _defaultContentType);
                }

		if(!args.headers || !("X-Requested-With" in args.headers)){
			xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		}
		// FIXME: set other headers here!
		_d._ioNotifyStart(dfd);
		if(dojo.config.debugAtAllCosts){
			xhr.send(ioArgs.query);
		}else{
			try{
				xhr.send(ioArgs.query);
			}catch(e){
				ioArgs.error = e;
				dfd.cancel();
			}
		}
		_d._ioWatch(dfd, _validCheck, _ioCheck, _resHandle);
		xhr = null;
		return dfd; // dojo.Deferred
	}

	dojo.xhrGet = function(/*dojo.__XhrArgs*/ args){
		//	summary: 
		//		Sends an HTTP GET request to the server.
		return _d.xhr("GET", args); // dojo.Deferred
	}

	dojo.rawXhrPost = dojo.xhrPost = function(/*dojo.__XhrArgs*/ args){
		//	summary:
		//		Sends an HTTP POST request to the server. In addtion to the properties
		//		listed for the dojo.__XhrArgs type, the following property is allowed:
		//	postData:
		//		String. Send raw data in the body of the POST request.
		return _d.xhr("POST", args, true); // dojo.Deferred
	}

	dojo.rawXhrPut = dojo.xhrPut = function(/*dojo.__XhrArgs*/ args){
		//	summary:
		//		Sends an HTTP PUT request to the server. In addtion to the properties
		//		listed for the dojo.__XhrArgs type, the following property is allowed:
		//	putData:
		//		String. Send raw data in the body of the PUT request.
		return _d.xhr("PUT", args, true); // dojo.Deferred
	}

	dojo.xhrDelete = function(/*dojo.__XhrArgs*/ args){
		//	summary:
		//		Sends an HTTP DELETE request to the server.
		return _d.xhr("DELETE", args); //dojo.Deferred
	}

	/*
	dojo.wrapForm = function(formNode){
		//summary:
		//		A replacement for FormBind, but not implemented yet.

		// FIXME: need to think harder about what extensions to this we might
		// want. What should we allow folks to do w/ this? What events to
		// set/send?
		throw new Error("dojo.wrapForm not yet implemented");
	}
	*/


}

if(!dojo._hasResource['toura.app.Config']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.app.Config'] = true;
dojo.provide('toura.app.Config');

if (!toura.app._Config) {
  // prevent toura.app._Config from being included
  // in the built files
  var req = dojo.require;
  req('toura.app.TouraConfig');
}

(function(d, undef) {

var privateConfig;

toura.app.Config = {
  get : function(key) {
    var val = privateConfig[key];

    if (val === undef) {
      console.error("No config value found for " + key);
      throw new Error("No config value found for " + key);
    }

    return val;
  },

  set : function(key, val) {
    privateConfig[key] = val;
  },

  registerConfig : function(config) {
    privateConfig = config;
  }
};

toura.app.Config.registerConfig(toura.app._Config);

}(dojo));

}

if(!dojo._hasResource['toura.app.Analytics']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.app.Analytics'] = true;
dojo.provide('toura.app.Analytics');



/**
 * toura.app.Analytics listens for the broadcast of application events
 * and tracks them in Flurry analytics as appropriate.
 */
(function(){

var _pg = toura.app.Phonegap;

dojo.declare('toura.app.Analytics', [], {
  /**
   * @constructor
   * @param {String} id  The application ID to associate with analytics data
   *
   * Subscribes to various application events.
   */
  constructor : function(id) {
    this.appId = id;

    dojo.subscribe('/video/play', dojo.hitch(this, '_trackEvent', 'Video Play'));
    dojo.subscribe('/audio/play', dojo.hitch(this, '_trackEvent', 'Audio Play'));
    dojo.subscribe('/image/view', dojo.hitch(this, '_trackEvent', 'Image View'));
    dojo.subscribe('/share', dojo.hitch(this, '_trackEvent', 'Share'));

    dojo.subscribe('/node/view', this, '_trackPageview');
    dojo.subscribe('/search', this, '_trackSearch');
  },

  /**
   * @param {String} eventType  The type of event to track
   * @param {Object} data  The data associated with the event
   *
   * Receives data associated with an application event, and sends the data
   * to the analytics service.
   */
  _trackEvent : function(eventType, data) {
    _pg.analytics.log(eventType, { data : data });
  },

  /**
   * @param {String} hash  The hash for the pageview
   */
  _trackPageview : function(hash) {
    _pg.analytics.log('/tour/' + toura.app.Config.get('app').id + hash);
  },

  /**
   * @param {String} term
   *
   * Handles tracking searches
   */
  _trackSearch : function(term) {
    term = term ? dojo.trim(term) : false;
    if (!term) { return; }
    _pg.analytics.log('Search', { searchTerm : term });
  }

});

toura.app.Analytics = new toura.app.Analytics();

}());

}

if(!dojo._hasResource['toura.app.DeviceStorage']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.app.DeviceStorage'] = true;
dojo.provide('toura.app.DeviceStorage');



/**
 * Provides an API for interacting with the SQLite databse
 */
toura.app.DeviceStorage = (function(){
  var storeInSQL = {
    'tour' : {
      tableName : 'items',
      fields : [ 'id text', 'json text' ],
      insertStatement : function(tableName, item) {
        return [
          "INSERT INTO " + tableName + "( id, json ) VALUES ( ?, ? )",
          [ item.id, JSON.stringify(item) ]
        ];
      },
      processSelecton : function(result) {
        var items = [],
            len = result.rows.length,
            rowData;

        for (var i = 0; i < len; i++) {
          rowData = result.rows.item(i).json;
          items.push(rowData ? JSON.parse(rowData) : {});
        }

        return items;
      }
    }
  };

  return {
    init : function(appId) {
      this.appId = appId;

      if (!window.localStorage) {
        console.log('no local storage');
        throw new Error('Local storage interface is not defined. Cannot create database. Aborting.');
      }

      if (!window.openDatabase) {
        console.log('no database capability');
        throw new Error('SQLite database interface is not defined. Cannot create database. Aborting.');
      }

      var db = this._db = openDatabase(
        // short db name
        appId,

        // sqlite version
        "1.0",

        // long db name
        appId + ' Database',

        // database size
        { android : 5 * 1024 * 1024, ios : 1000000 }[toura.app.Config.get("device").os]
      );

      if (!db) {
        console.log('No database. This will end badly.');
      }

      this._sql = function(queries, formatter) {
        var dfd = new dojo.Deferred(),
            len;

        queries = dojo.isArray(queries) ? queries : [ queries ];
        len = queries.length;

        db.transaction(function(t) {

          dojo.forEach(queries, function(q, i) {
            var last = i + 1 === len,
                cb, eb, params = [];

            if (last) {
              cb = dojo.isFunction(formatter) ?
                    function(t, data) {
                      dfd.callback(formatter(data));
                    } :
                    dfd.callback;

              eb = dfd.errback;
            } else {
              cb = eb = function() {};
            }

            if (dojo.isArray(q)) {
              params = q[1];
              q = q[0];
            }

            t.executeSql(q, params, cb, eb);
          });

        });

        return dfd;
      };

      // don't let database be initialized again
      return this._db;
    },

    drop : function(tableName) {
      var queries = [];

      dojo.forIn(storeInSQL, function(propName, settings) {
        queries.push("DROP TABLE IF EXISTS " + settings.tableName);
      });

      window.localStorage.clear();
      return this._sql(queries);
    },

    set : function(k, v) {
      var sql = storeInSQL[k],
          queries;

      if (sql) {
        queries = [
          "DROP TABLE IF EXISTS " + sql.tableName,
          "CREATE TABLE " + sql.tableName + "(" + sql.fields.join(',') + ")"
        ];

        dojo.forEach(v, function(item) {
          queries.push(sql.insertStatement(sql.tableName, item));
        });

        return this._sql(queries);
      }

      window.localStorage.setItem(k, JSON.stringify(v));
      return true;
    },

    get : function(k) {
      var sql = storeInSQL[k];

      if (sql) {
        return this._sql("SELECT * FROM " + sql.tableName, sql.processSelecton);
      }

      var ret = window.localStorage.getItem(k);
      if (ret === 'undefined') { ret = null; }
      ret = ret && JSON.parse(ret);
      return ret;
    }
  };
}());

}

if(!dojo._hasResource['toura.app.URL']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.app.URL'] = true;
dojo.provide('toura.app.URL');

toura.app.URL = {
  home : function() {
    return '#/home';
  },

  about : function() {
    return '#/about';
  },

  maps : function() {
    return '#/maps';
  },

  favorites : function() {
    return '#/favorites';
  },

  node : function(nodeId) {
    return '#/node/' + nodeId;
  },

  search : function() {
    return '#/search';
  },

  searchTerm : function(term) {
    return toura.app.URL.search() + '/' + term;
  },

  searchResult : function(context) {
    var url = [ 'node', context.node ];

    if (context.type !== 'node') {
      url.push(context.type, context.id);
    }

    return '#/' + url.join('/');
  },

  update : function() {
    return '#/update';
  },

  storedAsset : function(type, filename) {
    var dirs = {
          'image' : 'images',
          'video' : 'videos',
          'audio' : 'audios',
          'videoPoster' : 'videos/poster'
        };

    return [ toura.mediaDir || 'media', dirs[type], filename ].join('/');
  },

  googleMapAddress : function(address) {
    var url = 'http://maps.google.com/maps?',
        params = { q : address };

    return url + dojo.objectToQuery(params);
  },

  protocol : function() {
    return (/^https/).test(document.location.protocol) ? 'https' : 'http';
  },

  tel : function(tel) {
    return 'tel:' + tel.replace(/\W/g, '');
  },

  feedItem : function(feedId, itemIndex) {
    return '/feed/' + feedId + '/item/' + itemIndex;
  }
};

}

if(!dojo._hasResource['toura.models.TextAsset']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.models.TextAsset'] = true;
dojo.provide('toura.models.TextAsset');

dojo.declare('toura.models.TextAsset', [], {
  constructor : function(store, item) {
    dojo.mixin(this, {
      id : store.getValue(item, 'id'),
      body : store.getValue(item, 'body'),
      name : store.getValue(item, 'name'),
      contexts : store.getValues(item, 'contexts')
    });
  }
});

}

if(!dojo._hasResource['toura.models.SimpleNode']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.models.SimpleNode'] = true;
dojo.provide('toura.models.SimpleNode');



(function() {

var cache = {};

dojo.subscribe('/tour/update', function() { cache = {}; });

dojo.declare('toura.models.SimpleNode', [], {
  constructor : function(store, item) {
    var id = store.getValue(item, 'id');
    if (cache[id]) {
      dojo.mixin(this, cache[id]);
      return;
    }

    dojo.mixin(this, {
      id : store.getValue(item, 'id'),
      name : store.getValue(item, 'name')
    });

    this.url = toura.app.URL.node(this.id);

    cache[id] = this;
  }
});

}());

}

if(!dojo._hasResource['toura.models._CaptionedAsset']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.models._CaptionedAsset'] = true;
dojo.provide('toura.models._CaptionedAsset');

dojo.declare('toura.models._CaptionedAsset', [], {
  _processCaption : function(store, item) {
    if (!item.caption) { return; }

    store.fetchItemByIdentity({
      identity : item.caption._reference,
      onItem : function(item) {
        dojo.mixin(this, {
          caption : store.getValue(item, 'body'),
          name : store.getValue(item, 'name') || this.name
        });
      },
      scope : this
    });
  }
});

}

if(!dojo._hasResource['toura.models._StorableAsset']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.models._StorableAsset'] = true;
dojo.provide('toura.models._StorableAsset');



(function() {

var appUrl = toura.app.URL.storedAsset;

dojo.declare('toura.models._StorableAsset', [], {
  _getUrl : function(store, item) {
    this.store = store;

    var assetType = store.getValue(item, 'type'),
        subtypes = assetType === 'image' ?
          [ 'featuredSmall', 'featured', 'gallery', 'original' ] : false;

    if (subtypes) {
      dojo.forEach(subtypes, function(subtype) {
        var t = this[subtype] = store.getValue(item, subtype),
            isStreamed = this._isStreamed(item, subtype);

        t.url = (isStreamed && t.url) ? t.url : appUrl(assetType, t.filename);
      }, this);
    } else {
      var url = store.getValue(item, 'url');
      this.url = (this._isStreamed(item) && url) ? url : appUrl(assetType, store.getValue(item, 'filename'));
    }
  },

  _isStreamed : function(item, type) {
    if (toura.forceStreaming) { return true; }
    if (toura.forceLocal) { return false; }

    if (!toura.app.manifest) {
      return true;
    }

    // first, ask the data whether the asset is streamed; if it is,
    // we assume the asset should be streamed
    if (!toura.app.manifest || this.store.getValue(item, 'streamed')) { return true; }

    // if the asset is marked not to stream, we need to check whether
    // we have the asset on device

    // first, we determine the filename for the asset from the data
    var filename = type ?
      this.store.getValue(item, type).filename :
      this.store.getValue(item, 'filename');

    // next, we figure out where to look in toura.app.manifest
    var lookup = toura.app.manifest[this.store.getValue(item, 'type') + 's'];

    // if the manifest doesn't have an entry for the asset type, we must stream
    if (!lookup || !dojo.isArray(lookup)) {
      return true;
    }

    // if the asset is in the manifest, then it's safe to not stream it
    if (dojo.indexOf(lookup, filename) > -1) {
      return false;
    }

    // if the asset isn't in the manifest, we're stuck streaming it
    return true;
  }
});

}());

}

if(!dojo._hasResource['toura.models.Image']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.models.Image'] = true;
dojo.provide('toura.models.Image');




dojo.declare('toura.models.Image', [ toura.models._CaptionedAsset, toura.models._StorableAsset ], {
  constructor : function(store, item) {
    store.fetchItemByIdentity({
      identity : item.image._reference,
      onItem : function(item) {
        dojo.mixin(this, {
          id : store.getValue(item, 'id'),
          name : store.getValue(item, 'name'),
          height : store.getValue(item, 'height') || null,
          width : store.getValue(item, 'width') || null
        });
        this._getUrl(store, item);
      },
      scope : this
    });

    this._processCaption(store, item);
  }
});



}

if(!dojo._hasResource['toura.models.HeaderImage']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.models.HeaderImage'] = true;
dojo.provide('toura.models.HeaderImage');



dojo.declare('toura.models.HeaderImage', [ toura.models._StorableAsset, toura.models._CaptionedAsset ], {
  constructor : function(store, item) {
    dojo.mixin(this, {
      id : store.getValue(item, 'id'),
      name : store.getValue(item, 'name'),
      height : store.getValue(item, 'height') || null,
      width : store.getValue(item, 'width') || null
    });

    this._getUrl(store, item);
    this._processCaption(store, item);

    this.destination = /^http/.test(this.name) ? this.name : false;
  }
});

}

if(!dojo._hasResource['toura.models.BackgroundImage']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.models.BackgroundImage'] = true;
dojo.provide('toura.models.BackgroundImage');



dojo.declare('toura.models.BackgroundImage', [ toura.models._StorableAsset ], {
  constructor : function(store, item) {
    dojo.mixin(this, {
      id : store.getValue(item, 'id'),
      name : store.getValue(item, 'name'),
      height : store.getValue(item, 'height') || null,
      width : store.getValue(item, 'width') || null
    });

    this._getUrl(store, item);
  }
});

}

if(!dojo._hasResource['toura.models.FeaturedImage']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.models.FeaturedImage'] = true;
dojo.provide('toura.models.FeaturedImage');



dojo.declare('toura.models.FeaturedImage', [ toura.models._StorableAsset ], {
  constructor :  function(store, item) {
    this._getUrl(store, item);
    this.small = this.featuredSmall;
    this.large = this.featured;
    delete this.featured_small;
    delete this.featured;
    delete this.gallery;
    delete this.original;
  }
});

}

if(!dojo._hasResource['toura.models.Video']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.models.Video'] = true;
dojo.provide('toura.models.Video');




dojo.declare('toura.models.Video', [ toura.models._CaptionedAsset, toura.models._StorableAsset ], {
  constructor : function(store, item) {
    if (!item.video) {
      dojo.mixin(this, {
        id : store.getValue(item, 'id'),
        name : store.getValue(item, 'name'),
        url : store.getValue(item, 'url')
      });

      return;
    }

    store.fetchItemByIdentity({
      identity : item.video._reference,
      onItem : function(item) {
        dojo.mixin(this, {
          id : store.getValue(item, 'id'),
          name : store.getValue(item, 'name'),
          poster : store.getValue(item, 'poster')
        });
        this._getUrl(store, item);
      },
      scope : this
    });

    this._processCaption(store, item);

    if (this.poster) {
      this.poster = this._posterOnDevice() ?
        toura.app.URL.storedAsset('videoPoster', this.poster.filename) :
        this.poster.url;
    }
  },

  _posterOnDevice : function() {
    var filename = this.poster.filename;

    return toura.app.manifest && toura.app.manifest.videos &&
      dojo.indexOf(toura.app.manifest.videos.posters || [], filename) > -1;
  }
});


}

if(!dojo._hasResource['toura.models.Audio']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.models.Audio'] = true;
dojo.provide('toura.models.Audio');




dojo.declare('toura.models.Audio', [ toura.models._CaptionedAsset, toura.models._StorableAsset ], {
  constructor : function(store, item) {
    store.fetchItemByIdentity({
      identity : item.audio._reference,
      onItem : function(item) {
        dojo.mixin(this, {
          id : store.getValue(item, 'id'),
          name : store.getValue(item, 'name')
        });
        this._getUrl(store, item);
      },
      scope : this
    });

    this._processCaption(store, item);
  }
});

}

if(!dojo._hasResource['toura.models.Data']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.models.Data'] = true;
dojo.provide('toura.models.Data');

dojo.declare('toura.models.Data', [], {
  constructor : function(store, item) {
    store.fetchItemByIdentity({
      identity: item.dataAsset._reference,
      onItem : function(item) {
        dojo.mixin(this, {
          id : store.getValue(item, 'id'),
          name : store.getValue(item, 'name'),
          type : store.getValue(item, 'dataType'),
          json : JSON.parse(store.getValue(item, 'value'))
        });
      },
      scope : this
    });
  }
});

}

if(!dojo._hasResource['toura.models.GoogleMapPin']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.models.GoogleMapPin'] = true;
dojo.provide('toura.models.GoogleMapPin');



dojo.declare('toura.models.GoogleMapPin', [ toura.models._CaptionedAsset ], {
  constructor : function(store, item) {
    store.fetchItemByIdentity({
      identity : item.googleMapPin._reference,
      onItem : function(item) {
        dojo.mixin(this, {
          id : store.getValue(item, 'id'),
          name : store.getValue(item, 'name'),
          lat : store.getValue(item, 'lat'),
          lon : store.getValue(item, 'lon'),
          address : store.getValue(item, 'address'),
          phoneNumber : store.getValue(item, 'phoneNumber'),
          website : store.getValue(item, 'website')
        });
      },
      scope : this
    });

    this._processCaption(store, item);
  }
});

}

if(!dojo._hasResource["dojo.io.script"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.io.script"] = true;
dojo.provide("dojo.io.script");

dojo.getObject("io", true, dojo);

/*=====
dojo.declare("dojo.io.script.__ioArgs", dojo.__IoArgs, {
	constructor: function(){
		//	summary:
		//		All the properties described in the dojo.__ioArgs type, apply to this
		//		type as well, EXCEPT "handleAs". It is not applicable to
		//		dojo.io.script.get() calls, since it is implied by the usage of
		//		"jsonp" (response will be a JSONP call returning JSON)
		//		or the response is pure JavaScript defined in
		//		the body of the script that was attached.
		//	callbackParamName: String
		//		Deprecated as of Dojo 1.4 in favor of "jsonp", but still supported for
		// 		legacy code. See notes for jsonp property.
		//	jsonp: String
		//		The URL parameter name that indicates the JSONP callback string.
		//		For instance, when using Yahoo JSONP calls it is normally,
		//		jsonp: "callback". For AOL JSONP calls it is normally
		//		jsonp: "c".
		//	checkString: String
		//		A string of JavaScript that when evaluated like so:
		//		"typeof(" + checkString + ") != 'undefined'"
		//		being true means that the script fetched has been loaded.
		//		Do not use this if doing a JSONP type of call (use callbackParamName instead).
		//	frameDoc: Document
		//		The Document object for a child iframe. If this is passed in, the script
		//		will be attached to that document. This can be helpful in some comet long-polling
		//		scenarios with Firefox and Opera.
		this.callbackParamName = callbackParamName;
		this.jsonp = jsonp;
		this.checkString = checkString;
		this.frameDoc = frameDoc;
	}
});
=====*/
(function(){
	var loadEvent = dojo.isIE ? "onreadystatechange" : "load",
		readyRegExp = /complete|loaded/;

	dojo.io.script = {
		get: function(/*dojo.io.script.__ioArgs*/args){
			//	summary:
			//		sends a get request using a dynamically created script tag.
			var dfd = this._makeScriptDeferred(args);
			var ioArgs = dfd.ioArgs;
			dojo._ioAddQueryToUrl(ioArgs);
	
			dojo._ioNotifyStart(dfd);

			if(this._canAttach(ioArgs)){
				var node = this.attach(ioArgs.id, ioArgs.url, args.frameDoc);

				//If not a jsonp callback or a polling checkString case, bind
				//to load event on the script tag.
				if(!ioArgs.jsonp && !ioArgs.args.checkString){
					var handle = dojo.connect(node, loadEvent, function(evt){
						if(evt.type == "load" || readyRegExp.test(node.readyState)){
							dojo.disconnect(handle);
							ioArgs.scriptLoaded = evt;
						}
					});
				}
			}

			dojo._ioWatch(dfd, this._validCheck, this._ioCheck, this._resHandle);
			return dfd;
		},
	
		attach: function(/*String*/id, /*String*/url, /*Document?*/frameDocument){
			//	summary:
			//		creates a new <script> tag pointing to the specified URL and
			//		adds it to the document.
			//	description:
			//		Attaches the script element to the DOM.  Use this method if you
			//		just want to attach a script to the DOM and do not care when or
			//		if it loads.
			var doc = (frameDocument || dojo.doc);
			var element = doc.createElement("script");
			element.type = "text/javascript";
			element.src = url;
			element.id = id;
			element.charset = "utf-8";
			return doc.getElementsByTagName("head")[0].appendChild(element);
		},
	
		remove: function(/*String*/id, /*Document?*/frameDocument){
			//summary: removes the script element with the given id, from the given frameDocument.
			//If no frameDocument is passed, the current document is used.
			dojo.destroy(dojo.byId(id, frameDocument));
			
			//Remove the jsonp callback on dojo.io.script, if it exists.
			if(this["jsonp_" + id]){
				delete this["jsonp_" + id];
			}
		},
	
		_makeScriptDeferred: function(/*Object*/args){
			//summary:
			//		sets up a Deferred object for an IO request.
			var dfd = dojo._ioSetArgs(args, this._deferredCancel, this._deferredOk, this._deferredError);
	
			var ioArgs = dfd.ioArgs;
			ioArgs.id = dojo._scopeName + "IoScript" + (this._counter++);
			ioArgs.canDelete = false;
	
			//Special setup for jsonp case
			ioArgs.jsonp = args.callbackParamName || args.jsonp;
			if(ioArgs.jsonp){
				//Add the jsonp parameter.
				ioArgs.query = ioArgs.query || "";
				if(ioArgs.query.length > 0){
					ioArgs.query += "&";
				}
				ioArgs.query += ioArgs.jsonp
					+ "="
					+ (args.frameDoc ? "parent." : "")
					+ dojo._scopeName + ".io.script.jsonp_" + ioArgs.id + "._jsonpCallback";
	
				ioArgs.frameDoc = args.frameDoc;
	
				//Setup the Deferred to have the jsonp callback.
				ioArgs.canDelete = true;
				dfd._jsonpCallback = this._jsonpCallback;
				this["jsonp_" + ioArgs.id] = dfd;
			}
			return dfd; // dojo.Deferred
		},
		
		_deferredCancel: function(/*Deferred*/dfd){
			//summary: canceller function for dojo._ioSetArgs call.
	
			//DO NOT use "this" and expect it to be dojo.io.script.
			dfd.canceled = true;
			if(dfd.ioArgs.canDelete){
				dojo.io.script._addDeadScript(dfd.ioArgs);
			}
		},
	
		_deferredOk: function(/*Deferred*/dfd){
			//summary: okHandler function for dojo._ioSetArgs call.
	
			//DO NOT use "this" and expect it to be dojo.io.script.
			var ioArgs = dfd.ioArgs;
	
			//Add script to list of things that can be removed.
			if(ioArgs.canDelete){
				dojo.io.script._addDeadScript(ioArgs);
			}
	
			//Favor JSONP responses, script load events then lastly ioArgs.
			//The ioArgs are goofy, but cannot return the dfd since that stops
			//the callback chain in Deferred. The return value is not that important
			//in that case, probably a checkString case.
			return ioArgs.json || ioArgs.scriptLoaded || ioArgs;
		},
	
		_deferredError: function(/*Error*/error, /*Deferred*/dfd){
			//summary: errHandler function for dojo._ioSetArgs call.
	
			if(dfd.ioArgs.canDelete){
				//DO NOT use "this" and expect it to be dojo.io.script.
				if(error.dojoType == "timeout"){
					//For timeouts, remove the script element immediately to
					//avoid a response from it coming back later and causing trouble.
					dojo.io.script.remove(dfd.ioArgs.id, dfd.ioArgs.frameDoc);
				}else{
					dojo.io.script._addDeadScript(dfd.ioArgs);
				}
			}
			console.log("dojo.io.script error", error);
			return error;
		},
	
		_deadScripts: [],
		_counter: 1,
	
		_addDeadScript: function(/*Object*/ioArgs){
			//summary: sets up an entry in the deadScripts array.
			dojo.io.script._deadScripts.push({id: ioArgs.id, frameDoc: ioArgs.frameDoc});
			//Being extra paranoid about leaks:
			ioArgs.frameDoc = null;
		},
	
		_validCheck: function(/*Deferred*/dfd){
			//summary: inflight check function to see if dfd is still valid.
	
			//Do script cleanup here. We wait for one inflight pass
			//to make sure we don't get any weird things by trying to remove a script
			//tag that is part of the call chain (IE 6 has been known to
			//crash in that case).
			var _self = dojo.io.script;
			var deadScripts = _self._deadScripts;
			if(deadScripts && deadScripts.length > 0){
				for(var i = 0; i < deadScripts.length; i++){
					//Remove the script tag
					_self.remove(deadScripts[i].id, deadScripts[i].frameDoc);
					deadScripts[i].frameDoc = null;
				}
				dojo.io.script._deadScripts = [];
			}
	
			return true;
		},
	
		_ioCheck: function(/*Deferred*/dfd){
			//summary: inflight check function to see if IO finished.
			var ioArgs = dfd.ioArgs;
			//Check for finished jsonp
			if(ioArgs.json || (ioArgs.scriptLoaded && !ioArgs.args.checkString)){
				return true;
			}
	
			//Check for finished "checkString" case.
			var checkString = ioArgs.args.checkString;
			if(checkString && eval("typeof(" + checkString + ") != 'undefined'")){
				return true;
			}
	
			return false;
		},
	
		_resHandle: function(/*Deferred*/dfd){
			//summary: inflight function to handle a completed response.
			if(dojo.io.script._ioCheck(dfd)){
				dfd.callback(dfd);
			}else{
				//This path should never happen since the only way we can get
				//to _resHandle is if _ioCheck is true.
				dfd.errback(new Error("inconceivable dojo.io.script._resHandle error"));
			}
		},
	
		_canAttach: function(/*Object*/ioArgs){
			//summary: A method that can be overridden by other modules
			//to control when the script attachment occurs.
			return true;
		},
		
		_jsonpCallback: function(/*JSON Object*/json){
			//summary:
			//		generic handler for jsonp callback. A pointer to this function
			//		is used for all jsonp callbacks.  NOTE: the "this" in this
			//		function will be the Deferred object that represents the script
			//		request.
			this.ioArgs.json = json;
		}
	};
})();

}

if(!dojo._hasResource['toura.models.Feed']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.models.Feed'] = true;
dojo.provide('toura.models.Feed');





(function() {

/**
 * @class
 *
 * @property {Number} throttle  The time in milliseconds to wait between
 * fetches
 * @property {String} feedUrl
 * @property {String} id
 * @property {String} name
 * @property {Number} lastChecked
 * @property {Array} items
 * @property {Number} updated
 */
dojo.declare('toura.models.Feed', [], {
  throttle : 5 * 60 * 1000, // 5 minutes

  /**
   * @constructor
   */
  constructor : function(store, item) {
    if (item && item.feed) {
      store.fetchItemByIdentity({
        identity : item.feed._reference,
        onItem : function(item) {
          dojo.mixin(this, {
            feedUrl : store.getValue(item, 'feedUrl'),
            id : store.getValue(item, 'id'),
            name : store.getValue(item, 'name')
          });
        },
        scope : this
      });
    } else {
      dojo.mixin(this, {
        feedUrl : store.getValue(item, 'feedUrl'),
        id : store.getValue(item, 'id'),
        name : store.getValue(item, 'name')
      });
    }

    this.lastChecked = toura.app.DeviceStorage.get(this.id + '-checked');
  },

  /**
   * @public
   *
   * @returns {Promise} A promise that may be resolved or rejected. If
   * resolved, the promise is resolved with an array of feed items; this array
   * may be empty, which indicates that no feed items were fetched but that
   * an attempt was made to fetch them. If rejected, the network was not
   * reachable and no attempt was made to load the feed items.
   */
  load : function() {
    var fn = toura.app.Phonegap.present ?
        dojo.hitch(dojo, 'xhrGet') :
        dojo.hitch(dojo.io.script, 'get'),

        dfd = new dojo.Deferred();

    if (new Date().getTime() - this.lastChecked < this.throttle) {
      dfd.resolve(this._get());
    } else {
      toura.app.Phonegap.network.isReachable()
        .then(dojo.hitch(this, function(reachable) {
          if (!reachable) {
            dfd.resolve(this._get());
            return;
          }

          fn(this._createArgs(dfd));
        }));
    }

    return dfd.promise;
  },

  /**
   * @public
   * @param {Number} itemIndex  The index of the desired item
   */
  getItem : function(itemIndex) {
    this._get();
    var item = this.items[itemIndex];
    item.siblings = this.items;
    return item;
  },

  _onLoad : function(dfd, data) {
    this.lastChecked = new Date().getTime();

    if (data && data.query && data.query.results && data.query.results.item) {
      this.items = dojo.map(data.query.results.item, function(item, index) {
        item.index = index;
        return new toura.models.FeedItem(item, this);
      }, this);

      this.updated = new dojo.date.stamp.fromISOString(data.query.created);
    } else {
      console.warn('There were no results for feed', this.id, data);
      this.items = [];
    }

    this._store();

    dfd.resolve(this._get());
  },

  _onError : function(dfd) {
    dfd.resolve(this._get() || []);
  },

  _store : function() {
    toura.app.DeviceStorage.set(this.id, this.items);
    toura.app.DeviceStorage.set(this.id + '-checked', this.lastChecked);
  },

  _get : function() {
    this.items = dojo.map(
      toura.app.DeviceStorage.get(this.id) || [],
      function(item) {
        item.pubDate = new Date(item.pubDate);
        return item;
      }
    );

    return this.items;
  },

  _createArgs : function(dfd) {
    var req = {
      url : 'http://query.yahooapis.com/v1/public/yql',
      content : {
        q : "select * from feed where url='{{feed}}' limit 20".replace('{{feed}}', this.feedUrl),
        format : 'json'
      },
      preventCache : true,
      load : dojo.hitch(this, '_onLoad', dfd),
      error : dojo.hitch(this, '_onError', dfd)
    };

    if (!toura.app.Phonegap.present) {
      req.callbackParamName = 'callback';
    } else {
      req.handleAs = 'json';
    }

    return req;
  }
});

/**
 * @class
 *
 * @property {String} title
 * @property {String} name
 * @property {String} body
 * @property {String} link
 * @property {String} pubDate
 * @property {Object} image
 * @property {String} author
 * @property {String} id
 * @property {String} feedName
 */
dojo.declare('toura.models.FeedItem', null, {
  /**
   * @constructor
   */
  constructor : function(item, feed) {
    this.type = 'feedItem';

    dojo.mixin(this, {
      title : item.title || '',
      body : item.description || '',
      url : toura.app.URL.feedItem(feed.id, item.index),
      link : item.link,
      pubDate : item.pubDate,
      name : item.title,
      feedName : feed.name,
      id : feed.id + '-' + item.index
    });

    if (dojo.isObject(this.body)) {
      this.body = this.body.content || null;
    }

    if (dojo.isObject(this.link)) {
      this.link = this.link.content || null;
    }

    if (dojo.isObject(this.title)) {
      this.title = this.title.content || null;
    }

    this.image = this._getImage(item);
    this.author = this._getAuthor(item);
  },

  _getImage : function(item) {
    var enc = item.enclosure || item.content;

    if (enc && enc.type && enc.type.match(/(jpeg|png)/i)) {
      return { url : enc.url };
    }

    return '';
  },

  _getAuthor : function(item) {
    var author = item.author;

    if (author && author.displayName) {
      return author.displayName;
    }

    return '';
  }
});

}());

}

if(!dojo._hasResource['toura.models.Node']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.models.Node'] = true;
dojo.provide('toura.models.Node');














(function(){

var cache = {};

dojo.subscribe('/tour/update', function() { cache = {}; });

dojo.declare('toura.models.Node', [], {
  /*
   * convert a node store item into a plain
   * javascript object that can be consumed
   * by a view
   */
  constructor : function(store, item) {
    var id = store.getValue(item, 'id');

    if (cache[id]) {
      dojo.mixin(this, cache[id]);
      return;
    }

    this.store = store;
    this._dataCache = {};

    var getAssets = function(assetKey, Model) {
      return dojo.map(
        store.getValues(item, assetKey) || [],
        function(asset) { return new Model(store, asset); }
      );
    };

    dojo.mixin(this, {
      type : 'node',
      id : id,
      name : store.getValue(item, 'name'),

      headerImage : {
        phone : getAssets('phoneHeaderImage', toura.models.HeaderImage)[0],
        tablet : getAssets('tabletHeaderImage', toura.models.HeaderImage)[0]
      },

      backgroundImage : {
        phone : getAssets('phoneBackgroundImage', toura.models.BackgroundImage)[0],
        tablet : getAssets('tabletBackgroundImage', toura.models.BackgroundImage)[0]
      },

      featuredImage : getAssets('featuredImage', toura.models.FeaturedImage)[0],

      children : store.getValues(item, 'children'),
      bodyText : store.getValue(item, 'bodyText'),

      images : getAssets('images', toura.models.Image),
      audios : getAssets('audios', toura.models.Audio),
      videos : getAssets('videos', toura.models.Video),

      data : getAssets('dataAssets', toura.models.Data),

      staticMapImages : getAssets('imageMapImages', toura.models.Image),

      googleMapPins : getAssets('googleMapPins', toura.models.GoogleMapPin),

      feeds : getAssets('feeds', toura.models.Feed),

      pageController : store.getValue(item, 'pageController'),
      sharingURL : store.getValue(item, 'sharingUrl'),

      parent : store.getValue(item, 'parent')
    });

    dojo.mixin(this, {
      url : toura.app.URL.node(this.id),
      bodyText : this.bodyText && new toura.models.TextAsset(store, this.bodyText),
      assetTypeUrl : function(type) {
        return this.url + '/' + type;
      },
      parent : this.parent && new toura.models.Node(store, this.parent),
      isHomeNode : this.id === toura.app.Config.get("app").homeNodeId
    });

    this.siblings = this.parent ? dojo.map(this.parent.children, function(c) {
      return new toura.models.SimpleNode(this.store, c);
    }, this) : [];

    this._assetCache = {};

    cache[id] = this;
  },

  _pluralize : function(type) {
    var lookup = {
      'google-map-pin' : 'googleMapPins',
      'image' : 'images',
      'video' : 'videos',
      'audio' : 'audios',
      'static-map-image' : 'staticMapImages'
    };

    if (!lookup[type]) {
      console.warn('toura.models.Node::_pluralize(): no property found for', type);
    }

    return lookup[type] || (type + 's');
  },

  getAssetById : function(type, id) {
    var key = type + id,
        matches,
        assets;

    if (!this._assetCache[key]) {
      assets = this[this._pluralize(type)];

      if (!assets) {
        console.warn('toura.models.Node::getAssetById(): No matching asset property found for', type);
        assets = [];
      }

      matches = dojo.filter(assets, function(a) {
        return a.id === id;
      });

      this._assetCache[key] = matches.length ? matches[0] : false;
    }

    return this._assetCache[key];
  },

  getBackgroundImage : function(device) {
    var imageStyle = device.type === 'phone' ? 'gallery' : 'original';

    if (this.backgroundImage && this.backgroundImage[device.type]) {
      return this.backgroundImage[device.type][imageStyle];
    }

    return false;
  },

  populateChildren : function() {
    if (this.childrenPopulated) { return; }
    this.children = dojo.map(this.children, function(c) {
      return new toura.models.Node(this.store, c);
    }, this);
    this.childrenPopulated = true;
  },

  getData : function(type) {
    if (!this._dataCache[type]) {
      var matches = dojo.filter(this.data, function(d) {
        return d.type === type;
      });

      this._dataCache[type] = !matches.length ? false : matches[0].json;
    }

    return this._dataCache[type];
  }
});

}());

}

if(!dojo._hasResource['toura.models.SearchResult']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.models.SearchResult'] = true;
dojo.provide('toura.models.SearchResult');



dojo.declare('toura.models.SearchResult', [], {
  constructor : function(store, item) {
    var context = item.context,
        textAsset = item.textAsset,
        node;

    if (!context) {
      // we're dealing with a node search result
      node = new toura.models.Node(store, item);
      dojo.mixin(this, {
        type : 'node',
        nodeId : node.id,
        displayName : node.name,
        displayText : node.bodyText ? node.bodyText.body || '' : '',
        url : toura.app.URL.searchResult({
          type : 'node',
          node : node.id
        }),
        nodeTitle : node.name
      });

      return;
    }

    // if there's a context, we're dealing with
    // a text asset search result
    dojo.mixin(this, {
      nodeId : context.node,
      type : context.type,
      displayName : textAsset.name,
      displayText : textAsset.body,
      url : toura.app.URL.searchResult(context)
    });

    store.fetchItemByIdentity({
      identity : context.node,
      onItem : function(item) {
        var n = new toura.models.Node(store, item);

        this.nodeTitle = n.name;

        if (context.type !== 'node') {
          this.asset = n.getAssetById(context.type, context.id);
        }
      },
      scope : this
    });
  }
});

}

if(!dojo._hasResource['toura.app.Data']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.app.Data'] = true;
dojo.provide('toura.app.Data');










dojo.declare('toura.app.Data', null, {
  cache : {},
  searchCache : {},

  models : {
    node : toura.models.Node,
    backgroundImage : toura.models.BackgroundImage,
    feed : toura.models.Feed,
    featuredImage : toura.models.FeaturedImage
  },

  constructor : function(data) {
    this.loadData(data);
  },

  loadData : function(data) {
    this.cache = {};
    this.searchCache = {};

    this._store = new dojo.data.ItemFileReadStore({
      data : {
        identifier : 'id',
        items : data
      },
      hierarchical : false
    });

    this.onLoadData(data);
  },

  onLoadData : function(data) {
    dojo.publish('/data/loaded', [ data ]);
    // stub for connection
  },

  getModel : function(id, type) {
    if (!id) {
      throw new Error('toura.app.Data::getModel requires an id');
    }

    if (!dojo.isString(id)) {
      throw new Error('toura.app.Data::getModel requires the id to be a string');
    }

    var cache = this.cache,
        store = this._store,
        item, Model;

    if (!cache[id]) {
      item = this.getById(id);
      if (!item) { return false; }

      type = type || store.getValue(item, 'type');
      Model = this.models[type];

      if (item && !Model) {
        throw new Error('toura.app.Data::getModel no model for type ' + type);
      }

      cache[id] = new Model(store, item);
    }

    return cache[id];
  },

  getById : function(id) {
    var ret;

    this._store.fetchItemByIdentity({
      identity : id,
      scope : this,
      onItem : dojo.hitch(this, function(item) {
        ret = item;
      })
    });

    return ret;
  },

  search : function(term) {
    if (!term || !dojo.trim(term)) { return []; }

    term = dojo.trim(term.replace(/\W/g, ' '));

    if (this.searchCache[term]) {
      return this.searchCache[term];
    }

    /*
     * Known limitations:
     *
     * - Only searches text assets and node titles
     * - Only searches for exact match
     */
    var matchingTextAssets = [],
        searchResults = [],
        store = this._store,
        addItems = function(items) {
          matchingTextAssets = matchingTextAssets.concat(items);
        },
        re = new RegExp(term, 'i'),
        seen = {},
        identifierSearchResults,
        Model = toura.models.SearchResult;

    var queries = [
      { type : 'text-asset', body : re },
      { type : 'text-asset', name : re }
    ];

    dojo.forEach(queries, function(q) {
      store.fetch({ query : q, onComplete : addItems });
    });

    dojo.forEach(matchingTextAssets, function(a) {
      var ta = new toura.models.TextAsset(store, a);
      searchResults = searchResults.concat(
        dojo.map(ta.contexts, function(c) {
          return new Model(store, {
            textAsset : ta, context : c
          });
        })
      );
    }, this);

    store.fetch({
      query : { type : 'node', name : re },
      onComplete : function(items) {
        searchResults = searchResults.concat(
          dojo.map(items, function(item) {
            return new Model(store, item);
          })
        );
      }
    });

    store.fetch({
      query : { type : 'node', identifier : re },
      onComplete : function(items) {
        identifierSearchResults = dojo.map(items, function(item) {
          return new toura.models.SearchResult(store, item);
        });
      }
    });

    searchResults = identifierSearchResults.concat(searchResults);

    // de-dupe
    searchResults = dojo.filter(searchResults, function(r) {
      if (seen[r.nodeId] && r.type === 'node') {
        return false;
      }

      if (seen[r.url]) {
        return false;
      }

      seen[r.url] = true;
      seen[r.nodeId] = true;
      return true;
    });

    this.searchCache[term] = searchResults;
    return searchResults;
  }
});

}

if(!dojo._hasResource['toura._Nls']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura._Nls'] = true;
dojo.provide('toura._Nls');





dojo.declare('toura._Nls', null, {
  /* http://www.ibm.com/developerworks/web/library/wa-dojo/ */
  data: {
    __initialized : false
  },

  constructor : function() {
    if (!this.data.__initialized) {
      this.data.nlsStrings = dojo.i18n.getLocalization("toura", "toura", toura.app.Config.get("locale"));
      this.data.__initialized = true;
    }
  },

  /**
  *
  * @param {String} key - the name of the key in the translation file
  * @param {Object or Array?} substitutes - in cases where the translated  
  *   string is a template for string substitution, this parameter
  *   holds the values to be used by dojo.string.substitute on that  
  *   template
  */
  getString : function(/*String*/ key, /*Object or Array?*/ substitutes) {
    var str = this.data.nlsStrings[key];
    return (substitutes) ? dojo.string.substitute(str,substitutes) : str;
  },

  postMixInProperties : function() {
    this.inherited('postMixInProperties', arguments);
    this.initializeStrings();
  },

  initializeStrings : function(){
    // stub for subclasses
  }
});

}

if(!dojo._hasResource['vendor.iscroll']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['vendor.iscroll'] = true;
dojo.provide('vendor.iscroll');

/**
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * iScroll v4.0 Beta 4
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * Copyright (c) 2010 Matteo Spinelli, http://cubiq.org/
 * Released under MIT license
 * http://cubiq.org/dropbox/mit-license.txt
 *
 * Last updated: 2011.03.10
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 */

(function(){
function iScroll (el, options) {
	var that = this, doc = document, div, i;

	that.wrapper = typeof el == 'object' ? el : doc.getElementById(el);
	that.wrapper.style.overflow = 'hidden';
	that.scroller = that.wrapper.children[0];

	// Default options
	that.options = {
		HWTransition: true,		// Experimental, internal use only
		HWCompositing: true,	// Experimental, internal use only
		hScroll: true,
		vScroll: true,
		hScrollbar: true,
		vScrollbar: true,
		fixedScrollbar: isAndroid,
		fadeScrollbar: (isIDevice && has3d) || !hasTouch,
		hideScrollbar: isIDevice || !hasTouch,
		scrollbarClass: '',
		bounce: has3d,
		bounceLock: false,
		momentum: has3d,
		lockDirection: true,
		zoom: false,
		zoomMin: 1,
		zoomMax: 4,
		snap: false,
		pullToRefresh: false,
		pullDownLabel: ['Pull down to refresh...', 'Release to refresh...', 'Loading...'],
		pullUpLabel: ['Pull up to refresh...', 'Release to refresh...', 'Loading...'],
		onPullDown: function () {},
		onPullUp: function () {},
		onScrollStart: null,
		onScrollEnd: null,
		onZoomStart: null,
		onZoomEnd: null,
		checkDOMChange: false		// Experimental
	};

	// User defined options
	for (i in options) {
		that.options[i] = options[i];
	}

	that.options.HWCompositing = that.options.HWCompositing && hasCompositing;
	that.options.HWTransition = that.options.HWTransition && hasCompositing;

	if (that.options.HWCompositing) {
		that.scroller.style.cssText += '-webkit-transition-property:-webkit-transform;-webkit-transform-origin:0 0;-webkit-transform:' + trnOpen + '0,0' + trnClose;
	} else {
		that.scroller.style.cssText += '-webkit-transition-property:top,left;-webkit-transform-origin:0 0;top:0;left:0';
	}

	if (that.options.HWTransition) {
		that.scroller.style.cssText += '-webkit-transition-timing-function:cubic-bezier(0.33,0.66,0.66,1);-webkit-transition-duration:0;';
	}

	that.options.hScrollbar = that.options.hScroll && that.options.hScrollbar;
	that.options.vScrollbar = that.options.vScroll && that.options.vScrollbar;

	that.pullDownToRefresh = that.options.pullToRefresh == 'down' || that.options.pullToRefresh == 'both';
	that.pullUpToRefresh = that.options.pullToRefresh == 'up' || that.options.pullToRefresh == 'both';

	if (that.pullDownToRefresh) {
		div = doc.createElement('div');
		div.className = 'iScrollPullDown';
		div.innerHTML = '<span class="iScrollPullDownIcon"></span><span class="iScrollPullDownLabel">' + that.options.pullDownLabel[0] + '</span>\n';
		that.scroller.insertBefore(div, that.scroller.children[0]);
		that.options.bounce = true;
		that.pullDownEl = div;
		that.pullDownLabel = div.getElementsByTagName('span')[1];
	}

	if (that.pullUpToRefresh) {
		div = doc.createElement('div');
		div.className = 'iScrollPullUp';
		div.innerHTML = '<span class="iScrollPullUpIcon"></span><span class="iScrollPullUpLabel">' + that.options.pullUpLabel[0] + '</span>\n';
		that.scroller.appendChild(div);
		that.options.bounce = true;
		that.pullUpEl = div;
		that.pullUpLabel = div.getElementsByTagName('span')[1];
	}

	that.refresh();

	that._bind(RESIZE_EV, window);
	that._bind(START_EV);
/*	that._bind(MOVE_EV);
	that._bind(END_EV);
	that._bind(CANCEL_EV);*/

	if (hasGesture && that.options.zoom) {
		that._bind('gesturestart');
		that.scroller.style.webkitTransform = that.scroller.style.webkitTransform + ' scale(1)';
	}

	if (!hasTouch) {
		that._bind('mousewheel');
	}

	if (that.options.checkDOMChange) {
		that.DOMChangeInterval = setInterval(function () { that._checkSize(); }, 250);
	}
}

iScroll.prototype = {
	x: 0, y: 0,
	currPageX: 0, currPageY: 0,
	pagesX: [], pagesY: [],
	offsetBottom: 0,
	offsetTop: 0,
	scale: 1, lastScale: 1,
	contentReady: true,

	handleEvent: function (e) {
		var that = this;

		switch(e.type) {
			case START_EV: that._start(e); break;
			case MOVE_EV: that._move(e); break;
			case END_EV:
			case CANCEL_EV: that._end(e); break;
			case 'webkitTransitionEnd': that._transitionEnd(e); break;
			case RESIZE_EV: that._resize(); break;
			case 'gesturestart': that._gestStart(e); break;
			case 'gesturechange': that._gestChange(e); break;
			case 'gestureend':
			case 'gesturecancel': that._gestEnd(e); break;
			case 'mousewheel': that._wheel(e); break;
		}
	},

	_scrollbar: function (dir) {
		var that = this,
			doc = document,
			bar;

		if (!that[dir + 'Scrollbar']) {
			if (that[dir + 'ScrollbarWrapper']) {
				that[dir + 'ScrollbarIndicator'].style.webkitTransform = '';	// Should free some mem
				that[dir + 'ScrollbarWrapper'].parentNode.removeChild(that[dir + 'ScrollbarWrapper']);
				that[dir + 'ScrollbarWrapper'] = null;
				that[dir + 'ScrollbarIndicator'] = null;
			}

			return;
		}

		if (!that[dir + 'ScrollbarWrapper']) {
			// Create the scrollbar wrapper
			bar = doc.createElement('div');
			if (that.options.scrollbarClass) {
				bar.className = that.options.scrollbarClass + dir.toUpperCase();
			} else {
				bar.style.cssText = 'position:absolute;z-index:100;' + (dir == 'h' ? 'height:7px;bottom:1px;left:2px;right:7px' : 'width:7px;bottom:7px;top:2px;right:1px');
			}
			bar.style.cssText += 'pointer-events:none;-webkit-transition-property:opacity;-webkit-transition-duration:' + (that.options.fadeScrollbar ? '350ms' : '0') + ';overflow:hidden;opacity:' + (that.options.hideScrollbar ? '0' : '1');

			that.wrapper.appendChild(bar);
			that[dir + 'ScrollbarWrapper'] = bar;

			// Create the scrollbar indicator
			bar = doc.createElement('div');
			if (!that.options.scrollbarClass) {
				bar.style.cssText = 'position:absolute;z-index:100;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);-webkit-background-clip:padding-box;-webkit-box-sizing:border-box;' + (dir == 'h' ? 'height:100%;-webkit-border-radius:4px 3px;' : 'width:100%;-webkit-border-radius:3px 4px;');
			}
			bar.style.cssText += 'pointer-events:none;-webkit-transition-property:-webkit-transform;-webkit-transition-timing-function:cubic-bezier(0.33,0.66,0.66,1);-webkit-transition-duration:0;-webkit-transform:' + trnOpen + '0,0' + trnClose;

			that[dir + 'ScrollbarWrapper'].appendChild(bar);
			that[dir + 'ScrollbarIndicator'] = bar;
		}

		if (dir == 'h') {
			that.hScrollbarSize = that.hScrollbarWrapper.clientWidth;
			that.hScrollbarIndicatorSize = m.max(m.round(that.hScrollbarSize * that.hScrollbarSize / that.scrollerW), 8);
			that.hScrollbarIndicator.style.width = that.hScrollbarIndicatorSize + 'px';
			that.hScrollbarMaxScroll = that.hScrollbarSize - that.hScrollbarIndicatorSize;
			that.hScrollbarProp = that.hScrollbarMaxScroll / that.maxScrollX;
		} else {
			that.vScrollbarSize = that.vScrollbarWrapper.clientHeight;
			that.vScrollbarIndicatorSize = m.max(m.round(that.vScrollbarSize * that.vScrollbarSize / that.scrollerH), 8);
			that.vScrollbarIndicator.style.height = that.vScrollbarIndicatorSize + 'px';
			that.vScrollbarMaxScroll = that.vScrollbarSize - that.vScrollbarIndicatorSize;
			that.vScrollbarProp = that.vScrollbarMaxScroll / that.maxScrollY;
		}

		// Reset position
		that._indicatorPos(dir, true);
	},

	_resize: function () {
		var that = this;

		//if (that.options.momentum) that._unbind('webkitTransitionEnd');

		setTimeout(function () {
			that.refresh();
		}, 0);
	},

	_checkSize: function () {
		var that = this,
			scrollerW,
			scrollerH;

		if (that.moved || that.zoomed || !that.contentReady) return;

		scrollerW = m.round(that.scroller.offsetWidth * that.scale),
		scrollerH = m.round((that.scroller.offsetHeight - that.offsetBottom - that.offsetTop) * that.scale);

		if (scrollerW == that.scrollerW && scrollerH == that.scrollerH) return;

		that.refresh();
	},

	_pos: function (x, y) {
		var that = this;

		that.x = that.hScroll ? x : 0;
		that.y = that.vScroll ? y : 0;

		that.scroller.style.webkitTransform = trnOpen + that.x + 'px,' + that.y + 'px' + trnClose + ' scale(' + that.scale + ')';
//		that.scroller.style.left = that.x + 'px';
//		that.scroller.style.top = that.y + 'px';

		that._indicatorPos('h');
		that._indicatorPos('v');
	},

	_indicatorPos: function (dir, hidden) {
		var that = this,
			pos = dir == 'h' ? that.x : that.y;

		if (!that[dir + 'Scrollbar']) return;

		pos = that[dir + 'ScrollbarProp'] * pos;

		if (pos < 0) {
			pos = that.options.fixedScrollbar ? 0 : pos + pos*3;
			if (that[dir + 'ScrollbarIndicatorSize'] + pos < 9) pos = -that[dir + 'ScrollbarIndicatorSize'] + 8;
		} else if (pos > that[dir + 'ScrollbarMaxScroll']) {
			pos = that.options.fixedScrollbar ? that[dir + 'ScrollbarMaxScroll'] : pos + (pos - that[dir + 'ScrollbarMaxScroll'])*3;
			if (that[dir + 'ScrollbarIndicatorSize'] + that[dir + 'ScrollbarMaxScroll'] - pos < 9) pos = that[dir + 'ScrollbarIndicatorSize'] + that[dir + 'ScrollbarMaxScroll'] - 8;
		}
		that[dir + 'ScrollbarWrapper'].style.webkitTransitionDelay = '0';
		that[dir + 'ScrollbarWrapper'].style.opacity = hidden && that.options.hideScrollbar ? '0' : '1';
		that[dir + 'ScrollbarIndicator'].style.webkitTransform = trnOpen + (dir == 'h' ? pos + 'px,0' : '0,' + pos + 'px') + trnClose;
	},

	_transitionTime: function (time) {
		var that = this;

		time += 'ms';
		that.scroller.style.webkitTransitionDuration = time;

		if (that.hScrollbar) that.hScrollbarIndicator.style.webkitTransitionDuration = time;
		if (that.vScrollbar) that.vScrollbarIndicator.style.webkitTransitionDuration = time;
	},

	_start: function (e) {
		var that = this,
			point = hasTouch ? e.changedTouches[0] : e,
			matrix;

		that.moved = false;

		e.preventDefault();

		if (hasTouch && e.touches.length == 2 && that.options.zoom && hasGesture && !that.zoomed) {
			that.originX = m.abs(e.touches[0].pageX + e.touches[1].pageX - that.wrapperOffsetLeft*2) / 2 - that.x;
			that.originY = m.abs(e.touches[0].pageY + e.touches[1].pageY - that.wrapperOffsetTop*2) / 2 - that.y;
		}

		that.moved = false;
		that.distX = 0;
		that.distY = 0;
		that.absDistX = 0;
		that.absDistY = 0;
		that.dirX = 0;
		that.dirY = 0;
		that.returnTime = 0;

		that._transitionTime(0);

		if (that.options.momentum) {
			if (that.scrollInterval) {
				clearInterval(that.scrollInterval);
				that.scrollInterval = null;
			}

			if (that.options.HWCompositing) {
				matrix = new WebKitCSSMatrix(window.getComputedStyle(that.scroller, null).webkitTransform);
				if (matrix.m41 != that.x || matrix.m42 != that.y) {
					that._unbind('webkitTransitionEnd');
					that._pos(matrix.m41, matrix.m42);
				}
			} else {
				matrix = window.getComputedStyle(that.scroller, null);
				if (that.x + 'px' != matrix.left || that.y + 'px' != matrix.top) {
					that._unbind('webkitTransitionEnd');
					that._pos(matrix.left.replace(/[^0-9]/g)*1, matrix.top.replace(/[^0-9]/g)*1);
				}
			}

		}

		that.scroller.style.webkitTransitionTimingFunction = 'cubic-bezier(0.33,0.66,0.66,1)';
		if (that.hScrollbar) that.hScrollbarIndicator.style.webkitTransitionTimingFunction = 'cubic-bezier(0.33,0.66,0.66,1)';
		if (that.vScrollbar) that.vScrollbarIndicator.style.webkitTransitionTimingFunction = 'cubic-bezier(0.33,0.66,0.66,1)';
		that.startX = that.x;
		that.startY = that.y;
		that.pointX = point.pageX;
		that.pointY = point.pageY;

		that.startTime = e.timeStamp;

		if (that.options.onScrollStart) that.options.onScrollStart.call(that);

		// Registering/unregistering of events is done to preserve resources on Android
//		setTimeout(function () {
//			that._unbind(START_EV);
			that._bind(MOVE_EV);
			that._bind(END_EV);
			that._bind(CANCEL_EV);
//		}, 0);
	},

	_move: function (e) {
		if (hasTouch && e.touches.length > 1) return;

		var that = this,
			point = hasTouch ? e.changedTouches[0] : e,
			deltaX = point.pageX - that.pointX,
			deltaY = point.pageY - that.pointY,
			newX = that.x + deltaX,
			newY = that.y + deltaY;

		e.preventDefault();

		that.pointX = point.pageX;
		that.pointY = point.pageY;

		// Slow down if outside of the boundaries
		if (newX > 0 || newX < that.maxScrollX) {
			newX = that.options.bounce ? that.x + (deltaX / 2.4) : newX >= 0 || that.maxScrollX >= 0 ? 0 : that.maxScrollX;
		}
		if (newY > 0 || newY < that.maxScrollY) {
			newY = that.options.bounce ? that.y + (deltaY / 2.4) : newY >= 0 || that.maxScrollY >= 0 ? 0 : that.maxScrollY;

			// Pull down to refresh
			if (that.options.pullToRefresh && that.contentReady) {
				if (that.pullDownToRefresh && newY > that.offsetBottom) {
					that.pullDownEl.className = 'iScrollPullDown flip';
					that.pullDownLabel.innerText = that.options.pullDownLabel[1];
				} else if (that.pullDownToRefresh && that.pullDownEl.className.match('flip')) {
					that.pullDownEl.className = 'iScrollPullDown';
					that.pullDownLabel.innerText = that.options.pullDownLabel[0];
				}

				if (that.pullUpToRefresh && newY < that.maxScrollY - that.offsetTop) {
					that.pullUpEl.className = 'iScrollPullUp flip';
					that.pullUpLabel.innerText = that.options.pullUpLabel[1];
				} else if (that.pullUpToRefresh && that.pullUpEl.className.match('flip')) {
					that.pullUpEl.className = 'iScrollPullUp';
					that.pullUpLabel.innerText = that.options.pullUpLabel[0];
				}
			}
		}

		if (that.absDistX < 4 && that.absDistY < 4) {
			that.distX += deltaX;
			that.distY += deltaY;
			that.absDistX = m.abs(that.distX);
			that.absDistY = m.abs(that.distY);
			return;
		}

		// Lock direction
		if (that.options.lockDirection) {
			if (that.absDistX > that.absDistY+3) {
				newY = that.y;
				deltaY = 0;
			} else if (that.absDistY > that.absDistX+3) {
				newX = that.x;
				deltaX = 0;
			}
		}

		that.moved = true;
		that._pos(newX, newY);
		that.dirX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
		that.dirY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

		if (e.timeStamp - that.startTime > 300) {
			that.startTime = e.timeStamp;
			that.startX = that.x;
			that.startY = that.y;
		}
	},

	_end: function (e) {
		if (hasTouch && e.touches.length != 0) return;

		var that = this,
			point = hasTouch ? e.changedTouches[0] : e,
			target, ev,
			momentumX = { dist:0, time:0 },
			momentumY = { dist:0, time:0 },
			duration = e.timeStamp - that.startTime,
			newPosX = that.x, newPosY = that.y,
			newDuration,
			snap;

//		that._bind(START_EV);
		that._unbind(MOVE_EV);
		that._unbind(END_EV);
		that._unbind(CANCEL_EV);

		if (that.zoomed) return;

		if (!that.moved) {
			if (hasTouch) {
				if (that.doubleTapTimer && that.options.zoom) {
					// Double tapped
					clearTimeout(that.doubleTapTimer);
					that.doubleTapTimer = null;
					that.zoom(that.pointX, that.pointY, that.scale == 1 ? 2 : 1);
				} else {
					that.doubleTapTimer = setTimeout(function () {
						that.doubleTapTimer = null;

						// Find the last touched element
						target = point.target;
						while (target.nodeType != 1) {
							target = target.parentNode;
						}

						ev = document.createEvent('MouseEvents');
						ev.initMouseEvent('click', true, true, e.view, 1,
							point.screenX, point.screenY, point.clientX, point.clientY,
							e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
							0, null);
						ev._fake = true;
						target.dispatchEvent(ev);
					}, that.options.zoom ? 250 : 0);
				}
			}

			that._resetPos();
			return;
		}

		if (that.pullDownToRefresh && that.contentReady && that.pullDownEl.className.match('flip')) {
			that.pullDownEl.className = 'iScrollPullDown loading';
			that.pullDownLabel.innerText = that.options.pullDownLabel[2];
			that.scroller.style.marginTop = '0';
			that.offsetBottom = 0;
			that.refresh();
			that.contentReady = false;
			that.options.onPullDown();
		}

		if (that.pullUpToRefresh && that.contentReady && that.pullUpEl.className.match('flip')) {
			that.pullUpEl.className = 'iScrollPullUp loading';
			that.pullUpLabel.innerText = that.options.pullUpLabel[2];
			that.scroller.style.marginBottom = '0';
			that.offsetTop = 0;
			that.refresh();
			that.contentReady = false;
			that.options.onPullUp();
		}

		if (duration < 300 && that.options.momentum) {
			momentumX = newPosX ? that._momentum(newPosX - that.startX, duration, -that.x, that.scrollerW - that.wrapperW + that.x, that.options.bounce ? that.wrapperW : 0) : momentumX;
			momentumY = newPosY ? that._momentum(newPosY - that.startY, duration, -that.y, (that.maxScrollY < 0 ? that.scrollerH - that.wrapperH + that.y : 0), that.options.bounce ? that.wrapperH : 0) : momentumY;

			newPosX = that.x + momentumX.dist;
			newPosY = that.y + momentumY.dist;

 			if ((that.x > 0 && newPosX > 0) || (that.x < that.maxScrollX && newPosX < that.maxScrollX)) momentumX = { dist:0, time:0 };
 			if ((that.y > 0 && newPosY > 0) || (that.y < that.maxScrollY && newPosY < that.maxScrollY)) momentumY = { dist:0, time:0 };
		}

		if (momentumX.dist || momentumY.dist) {
			newDuration = m.max(m.max(momentumX.time, momentumY.time), 10);

			// Do we need to snap?
			if (that.options.snap) {
				snap = that._snap(newPosX, newPosY);
				newPosX = snap.x;
				newPosY = snap.y;
				newDuration = m.max(snap.time, newDuration);
			}

/*			if (newPosX > 0 || newPosX < that.maxScrollX || newPosY > 0 || newPosY < that.maxScrollY) {
				// Subtle change of scroller motion
				that.scroller.style.webkitTransitionTimingFunction = 'cubic-bezier(0.33,0.66,0.5,1)';
				if (that.hScrollbar) that.hScrollbarIndicator.style.webkitTransitionTimingFunction = 'cubic-bezier(0.33,0.66,0.5,1)';
				if (that.vScrollbar) that.vScrollbarIndicator.style.webkitTransitionTimingFunction = 'cubic-bezier(0.33,0.66,0.5,1)';
			}*/

			that.scrollTo(newPosX, newPosY, newDuration);
			return;
		}

		// Do we need to snap?
		if (that.options.snap) {
			snap = that._snap(that.x, that.y);
			if (snap.x != that.x || snap.y != that.y) {
				that.scrollTo(snap.x, snap.y, snap.time);
			}
			return;
		}

		that._resetPos();
	},

	_resetPos: function (time) {
		var that = this,
			resetX = that.x,
			resetY = that.y;

		if (that.x >= 0) resetX = 0;
		else if (that.x < that.maxScrollX) resetX = that.maxScrollX;

		if (that.y >= 0 || that.maxScrollY > 0) resetY = 0;
		else if (that.y < that.maxScrollY) resetY = that.maxScrollY;

		if (resetX == that.x && resetY == that.y) {
			if (that.moved) {
				if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);		// Execute custom code on scroll end
				that.moved = false;
			}

			if (that.zoomed) {
				if (that.options.onZoomEnd) that.options.onZoomEnd.call(that);			// Execute custom code on scroll end
				that.zoomed = false;
			}

			if (that.hScrollbar && that.options.hideScrollbar) {
				that.hScrollbarWrapper.style.webkitTransitionDelay = '300ms';
				that.hScrollbarWrapper.style.opacity = '0';
			}
			if (that.vScrollbar && that.options.hideScrollbar) {
				that.vScrollbarWrapper.style.webkitTransitionDelay = '300ms';
				that.vScrollbarWrapper.style.opacity = '0';
			}

			return;
		}

		if (time === undefined) time = 200;

		// Invert ease
		if (time) {
			that.scroller.style.webkitTransitionTimingFunction = 'cubic-bezier(0.33,0.0,0.33,1)';
			if (that.hScrollbar) that.hScrollbarIndicator.style.webkitTransitionTimingFunction = 'cubic-bezier(0.33,0.0,0.33,1)';
			if (that.vScrollbar) that.vScrollbarIndicator.style.webkitTransitionTimingFunction = 'cubic-bezier(0.33,0.0,0.33,1)';
		}

		that.scrollTo(resetX, resetY, time);
	},

	_timedScroll: function (destX, destY, runtime) {
		var that = this,
			startX = that.x, startY = that.y,
			startTime = (new Date).getTime(),
			easeOut;

		that._transitionTime(0);

		if (that.scrollInterval) {
			clearInterval(that.scrollInterval);
			that.scrollInterval = null;
		}

		that.scrollInterval = setInterval(function () {
			var now = (new Date).getTime(),
				newX, newY;

			if (now >= startTime + runtime) {
				clearInterval(that.scrollInterval);
				that.scrollInterval = null;

				that._pos(destX, destY);
				that._transitionEnd();
				return;
			}

			now = (now - startTime) / runtime - 1;
			easeOut = m.sqrt(1 - now * now);
			newX = (destX - startX) * easeOut + startX;
			newY = (destY - startY) * easeOut + startY;
			that._pos(newX, newY);
		}, 20);
	},

	_transitionEnd: function (e) {
		var that = this;

		if (e) e.stopPropagation();

		that._unbind('webkitTransitionEnd');

		that._resetPos(that.returnTime);
		that.returnTime = 0;
	},


	/**
	 *
	 * Gestures
	 *
	 */
	_gestStart: function (e) {
		var that = this;

		that._transitionTime(0);
		that.lastScale = 1;

		if (that.options.onZoomStart) that.options.onZoomStart.call(that);

		that._unbind('gesturestart');
		that._bind('gesturechange');
		that._bind('gestureend');
		that._bind('gesturecancel');
	},

	_gestChange: function (e) {
		var that = this,
			scale = that.scale * e.scale,
			x, y, relScale;

		that.zoomed = true;

		if (scale < that.options.zoomMin) scale = that.options.zoomMin;
		else if (scale > that.options.zoomMax) scale = that.options.zoomMax;

		relScale = scale / that.scale;
		x = that.originX - that.originX * relScale + that.x;
		y = that.originY - that.originY * relScale + that.y;
		that.scroller.style.webkitTransform = trnOpen + x + 'px,' + y + 'px' + trnClose + ' scale(' + scale + ')';
		that.lastScale = relScale;
	},

	_gestEnd: function (e) {
		var that = this,
			scale = that.scale,
			lastScale = that.lastScale;

		that.scale = scale * lastScale;
		if (that.scale < that.options.zoomMin + 0.05) that.scale = that.options.zoomMin;
		else if (that.scale > that.options.zoomMax - 0.05) that.scale = that.options.zoomMax;
		lastScale = that.scale / scale;
		that.x = that.originX - that.originX * lastScale + that.x;
		that.y = that.originY - that.originY * lastScale + that.y;

		that.scroller.style.webkitTransform = trnOpen + that.x + 'px,' + that.y + 'px' + trnClose + ' scale(' + that.scale + ')';

		setTimeout(function () {
			that.refresh();
		}, 0);

		that._bind('gesturestart');
		that._unbind('gesturechange');
		that._unbind('gestureend');
		that._unbind('gesturecancel');
	},

	_wheel: function (e) {
		var that = this,
			deltaX = that.x + e.wheelDeltaX / 12,
			deltaY = that.y + e.wheelDeltaY / 12;

		if (deltaX > 0) deltaX = 0;
		else if (deltaX < that.maxScrollX) deltaX = that.maxScrollX;

		if (deltaY > 0) deltaY = 0;
		else if (deltaY < that.maxScrollY) deltaY = that.maxScrollY;

		that.scrollTo(deltaX, deltaY, 0);
	},


	/**
	 *
	 * Utilities
	 *
	 */
	_momentum: function (dist, time, maxDistUpper, maxDistLower, size) {
		var that = this,
			deceleration = 0.0006,
			speed = m.abs(dist) / time,
			newDist = (speed * speed) / (2 * deceleration),
			newTime = 0, outsideDist = 0;

		// Proportinally reduce speed if we are outside of the boundaries
		if (dist > 0 && newDist > maxDistUpper) {
			outsideDist = size / (6 / (newDist / speed * deceleration));
			maxDistUpper = maxDistUpper + outsideDist;
			that.returnTime = 800 / size * outsideDist + 100;
			speed = speed * maxDistUpper / newDist;
			newDist = maxDistUpper;
		} else if (dist < 0 && newDist > maxDistLower) {
			outsideDist = size / (6 / (newDist / speed * deceleration));
			maxDistLower = maxDistLower + outsideDist;
			that.returnTime = 800 / size * outsideDist + 100;
			speed = speed * maxDistLower / newDist;
			newDist = maxDistLower;
		}

		newDist = newDist * (dist < 0 ? -1 : 1);
		newTime = speed / deceleration;

		return { dist: newDist, time: m.round(newTime) };
	},

	_offset: function (el, tree) {
		var left = -el.offsetLeft,
			top = -el.offsetTop;

		if (!tree) return { x: left, y: top };

		while (el = el.offsetParent) {
			left -= el.offsetLeft;
			top -= el.offsetTop;
		}

		return { x: left, y: top };
	},

	_snap: function (x, y) {
		var that = this,
			i, l,
			page, time,
			sizeX, sizeY;

		// Check page X
		page = that.pagesX.length-1;
		for (i=0, l=that.pagesX.length; i<l; i++) {
			if (x >= that.pagesX[i]) {
				page = i;
				break;
			}
		}
		if (page == that.currPageX && page > 0 && that.dirX < 0) page--;
		x = that.pagesX[page];
		sizeX = m.abs(x - that.pagesX[that.currPageX]);
		sizeX = sizeX ? m.abs(that.x - x) / sizeX * 500 : 0;
		that.currPageX = page;

		// Check page Y
		page = that.pagesY.length-1;
		for (i=0; i<page; i++) {
			if (y >= that.pagesY[i]) {
				page = i;
				break;
			}
		}
		if (page == that.currPageY && page > 0 && that.dirY < 0) page--;
		y = that.pagesY[page];
		sizeY = m.abs(y - that.pagesY[that.currPageY]);
		sizeY = sizeY ? m.abs(that.y - y) / sizeY * 500 : 0;
		that.currPageY = page;

		// Snap with constant speed (proportional duration)
		time = m.round(m.max(sizeX, sizeY)) || 200;

		return { x: x, y: y, time: time };
	},

	_bind: function (type, el) {
		(el || this.scroller).addEventListener(type, this, false);
	},

	_unbind: function (type, el) {
		(el || this.scroller).removeEventListener(type, this, false);
	},


	/**
	 *
	 * Public methods
	 *
	 */
	destroy: function () {
		var that = this;

		if (that.options.checkDOMChange) clearTimeout(that.DOMChangeInterval);

		// Remove pull to refresh
		if (that.pullDownToRefresh) {
			that.pullDownEl.parentNode.removeChild(that.pullDownEl);
		}
		if (that.pullUpToRefresh) {
			that.pullUpEl.parentNode.removeChild(that.pullUpEl);
		}

		// Remove the scrollbars
		that.hScrollbar = false;
		that.vScrollbar = false;
		that._scrollbar('h');
		that._scrollbar('v');

		// Free some mem
		that.scroller.style.webkitTransform = '';

		// Remove the event listeners
		that._unbind('webkitTransitionEnd');
		that._unbind(RESIZE_EV);
		that._unbind(START_EV);
		that._unbind(MOVE_EV);
		that._unbind(END_EV);
		that._unbind(CANCEL_EV);

		if (that.options.zoom) {
			that._unbind('gesturestart');
			that._unbind('gesturechange');
			that._unbind('gestureend');
			that._unbind('gesturecancel');
		}
	},

	refresh: function () {
		var that = this,
			pos = 0, page = 0,
			i, l, els,
			oldHeight, offsets,
			loading;

		if (that.pullDownToRefresh) {
			loading = that.pullDownEl.className.match('loading');
			if (loading && !that.contentReady) {
				oldHeight = that.scrollerH;
				that.contentReady = true;
				that.pullDownEl.className = 'iScrollPullDown';
				that.pullDownLabel.innerText = that.options.pullDownLabel[0];
				that.offsetBottom = that.pullDownEl.offsetHeight;
				that.scroller.style.marginTop = -that.offsetBottom + 'px';
			} else if (!loading) {
				that.offsetBottom = that.pullDownEl.offsetHeight;
				that.scroller.style.marginTop = -that.offsetBottom + 'px';
			}
		}

		if (that.pullUpToRefresh) {
			loading = that.pullUpEl.className.match('loading');
			if (loading && !that.contentReady) {
				oldHeight = that.scrollerH;
				that.contentReady = true;
				that.pullUpEl.className = 'iScrollPullUp';
				that.pullUpLabel.innerText = that.options.pullUpLabel[0];
				that.offsetTop = that.pullUpEl.offsetHeight;
				that.scroller.style.marginBottom = -that.offsetTop + 'px';
			} else if (!loading) {
				that.offsetTop = that.pullUpEl.offsetHeight;
				that.scroller.style.marginBottom = -that.offsetTop + 'px';
			}
		}

		that.wrapperW = that.wrapper.clientWidth;
		that.wrapperH = that.wrapper.clientHeight;

    if (!that.wrapperW || !that.wrapperH) {
      // Bail out - the wrapper has no size and that will screw up
      // calculations. Best way to handle this?
      return false;
    }

		that.scrollerW = m.round(that.scroller.offsetWidth * that.scale);
		that.scrollerH = m.round((that.scroller.offsetHeight - that.offsetBottom - that.offsetTop) * that.scale);
		that.maxScrollX = that.wrapperW - that.scrollerW;
		that.maxScrollY = that.wrapperH - that.scrollerH;
		that.dirX = 0;
		that.dirY = 0;

		that._transitionTime(0);

		that.hScroll = that.options.hScroll && that.maxScrollX < 0;
		that.vScroll = that.options.vScroll && (!that.options.bounceLock && !that.hScroll || that.scrollerH > that.wrapperH);
		that.hScrollbar = that.hScroll && that.options.hScrollbar;
		that.vScrollbar = that.vScroll && that.options.vScrollbar && that.scrollerH > that.wrapperH;

		// Prepare the scrollbars
		that._scrollbar('h');
		that._scrollbar('v');

		// Snap
		if (typeof that.options.snap == 'string') {
			that.pagesX = [];
			that.pagesY = [];
			els = that.scroller.querySelectorAll(that.options.snap);
			for (i=0, l=els.length; i<l; i++) {
				pos = that._offset(els[i]);
				that.pagesX[i] = pos.x < that.maxScrollX ? that.maxScrollX : pos.x * that.scale;
				that.pagesY[i] = pos.y < that.maxScrollY ? that.maxScrollY : pos.y * that.scale;
			}
		} else if (that.options.snap) {
			that.pagesX = [];
			while (pos >= that.maxScrollX) {
				that.pagesX[page] = pos;
				pos = pos - that.wrapperW;
				page++;
			}
			if (that.maxScrollX%that.wrapperW) that.pagesX[that.pagesX.length] = that.maxScrollX - that.pagesX[that.pagesX.length-1] + that.pagesX[that.pagesX.length-1];

			pos = 0;
			page = 0;
			that.pagesY = [];
			while (pos >= that.maxScrollY) {
				that.pagesY[page] = pos;
				pos = pos - that.wrapperH;
				page++;
			}
			if (that.maxScrollY%that.wrapperH) that.pagesY[that.pagesY.length] = that.maxScrollY - that.pagesY[that.pagesY.length-1] + that.pagesY[that.pagesY.length-1];
		}

		// Recalculate wrapper offsets
		if (that.options.zoom) {
			offsets = that._offset(that.wrapper, true);
			that.wrapperOffsetLeft = -offsets.x;
			that.wrapperOffsetTop = -offsets.y;
		}

		if (oldHeight && that.y == 0) {
			oldHeight = oldHeight - that.scrollerH + that.y;
			that.scrollTo(0, oldHeight, 0);
		}

		that._resetPos();
	},

	scrollTo: function (x, y, time, relative) {
		var that = this;

		if (relative) {
			x = that.x - x;
			y = that.y - y;
		}

		time = !time || (m.round(that.x) == m.round(x) && m.round(that.y) == m.round(y)) ? 0 : time;

		that.moved = true;

		if (!that.options.HWTransition) {
			that._timedScroll(x, y, time);
			return;
		}

		if (time) that._bind('webkitTransitionEnd');
		that._transitionTime(time);
		that._pos(x, y);
		if (!time) setTimeout(function () { that._transitionEnd(); }, 0);
	},

	scrollToElement: function (el, time) {
		var that = this, pos;
		el = el.nodeType ? el : that.scroller.querySelector(el);
		if (!el) return;

		pos = that._offset(el);
		pos.x = pos.x > 0 ? 0 : pos.x < that.maxScrollX ? that.maxScrollX : pos.x;
		pos.y = pos.y > 0 ? 0 : pos.y < that.maxScrollY ? that.maxScrollY : pos.y;
		time = time === undefined ? m.max(m.abs(pos.x)*2, m.abs(pos.y)*2) : time;

		that.scrollTo(pos.x, pos.y, time);
	},

	scrollToPage: function (pageX, pageY, time) {
		var that = this, x, y;

		if (that.options.snap) {
			pageX = pageX == 'next' ? that.currPageX+1 : pageX == 'prev' ? that.currPageX-1 : pageX;
			pageY = pageY == 'next' ? that.currPageY+1 : pageY == 'prev' ? that.currPageY-1 : pageY;

			pageX = pageX < 0 ? 0 : pageX > that.pagesX.length-1 ? that.pagesX.length-1 : pageX;
			pageY = pageY < 0 ? 0 : pageY > that.pagesY.length-1 ? that.pagesY.length-1 : pageY;

			that.currPageX = pageX;
			that.currPageY = pageY;
			x = that.pagesX[pageX];
			y = that.pagesY[pageY];
		} else {
			x = -that.wrapperW * pageX;
			y = -that.wrapperH * pageY;
			if (x < that.maxScrollX) x = that.maxScrollX;
			if (y < that.maxScrollY) y = that.maxScrollY;
		}

		that.scrollTo(x, y, time || 400);
	},

	zoom: function (x, y, scale, transitionTime) {
		var that = this,
			relScale = scale / that.scale;

		x = x - that.wrapperOffsetLeft - that.x;
		y = y - that.wrapperOffsetTop - that.y;
		that.x = x - x * relScale + that.x;
		that.y = y - y * relScale + that.y;

		that.scale = scale;

		if (that.options.onZoomStart) that.options.onZoomStart.call(that);

		that.refresh();

		that._bind('webkitTransitionEnd');
		that._transitionTime(transitionTime !== null ? transitionTime : 200);

		setTimeout(function () {
			that.zoomed = true;
			that.scroller.style.webkitTransform = trnOpen + that.x + 'px,' + that.y + 'px' + trnClose + ' scale(' + scale + ')';
		}, 0);
	}
};


var has3d = 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix(),
	hasTouch = 'ontouchstart' in window,
	hasGesture = 'ongesturestart' in window,
//	hasHashChange = 'onhashchange' in window,
//	hasTransitionEnd = 'onwebkittransitionend' in window,
	hasCompositing = 'WebKitTransitionEvent' in window,
	isIDevice = (/iphone|ipad/gi).test(navigator.appVersion),
	isAndroid = (/android/gi).test(navigator.appVersion),
	RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
	START_EV = hasTouch ? 'touchstart' : 'mousedown',
	MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
	END_EV = hasTouch ? 'touchend' : 'mouseup',
	CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup',
	trnOpen = 'translate' + (has3d ? '3d(' : '('),
	trnClose = has3d ? ',0)' : ')',
	m = Math;

if (typeof exports !== 'undefined') exports.iScroll = iScroll;
else window.iScroll = iScroll;

})();

}

if(!dojo._hasResource['toura.ui.Scrollable']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.ui.Scrollable'] = true;
dojo.provide('toura.ui.Scrollable');




dojo.declare('toura.ui.Scrollable', dijit._Widget, {
  postCreate : function() {
    this.inherited(arguments);

    this.subscribe('/page/transition/end', '_makeScroller');
    this.subscribe('/window/resize', 'refreshScroller');
    this.subscribe('/fontsize', 'refreshScroller');
    this.subscribe('/content/update', function() {
      this.refreshScroller();
      if (this.scroller) {
        this.scroller.scrollTo(0, 0);
      }
    });

    dojo.addClass(this.domNode, 'scrollable');
  },

  _makeScroller : function() {
    if (this.domNode.children.length > 1) {
      console.error('toura.ui.Scrollable::_makeScroller: More than one child element. Only the first one will be scrollable. Probably not what you want!');
    }

    this.scroller = new iScroll(this.domNode, {
      vScrollbar: false
    });

    this.scroller.refresh();
  },

  makeScroller : function() {
    if (!this.scroller) {
      this._makeScroller();
    }
  },

  destroy : function() {
    if (this.scroller) {
      this.scroller.destroy();
    }
    this.inherited(arguments);
  },

  refreshScroller : function() {
    if (this.scroller) {
      this.scroller.refresh();
    }
  }
});


}

if(!dojo._hasResource['toura.ui.Clickable']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.ui.Clickable'] = true;
dojo.provide('toura.ui.Clickable');

/**
 * This is intended for internal use only by toura._View
 */
dojo.declare('toura.ui.Clickable', null, {
  constructor : function(el, handler) {
    this.connections = [];
    this.secondaryConnections = [];
    this.subscriptions = [];
    this.handler = handler;
    this.el = el;
    this.moved = false;

    dojo.addClass(this.el, 'not-moving');

    if (toura.app.UI.hasTouch) {
      this.connections.push(dojo.connect(el, 'touchstart', this, '_onTouchStart'));
      this.connections.push(dojo.connect(el, 'click', function(e) {
        e.preventDefault();
      }));
    } else {
      this.connections.push(dojo.connect(el, 'click', this, '_handle'));
    }
  },

  _onTouchStart : function() {
    this.touchStartTime = new Date().getTime();

    this.secondaryConnections = [
      dojo.connect(this.el, 'touchmove', this, '_onTouchMove'),
      dojo.connect(this.el, 'touchend', this, '_handle')
    ];
  },

  _onTouchMove : function() {
    dojo.removeClass(this.el, 'not-moving');
    this.moved = true;
  },

  _handle: function(e) {
    this.touchEndTime = new Date().getTime();

    dojo.addClass(this.el, 'not-moving');

    dojo.forEach(this.secondaryConnections || [], dojo.disconnect);
    this.secondaryConnections = [];

    if (toura.animating) {
      e.preventDefault();
      console.log('click ignored during animation');
      return;
    }

    var trueTarget = e.target,
        href = dojo.attr(trueTarget, 'href');

    if (this.touchStartTime && (this.touchEndTime - this.touchStartTime > toura.app.UI.touchMoveDebounce) && this.moved) {
      this.moved = false;
      return;
    }

    while (!href && trueTarget !== this.el) {
      href = dojo.attr(trueTarget, 'href');
      if (!href) { trueTarget = trueTarget.parentNode; }
    }

    if (!href) { return; }

    // run the handler function
    if (this.handler && dojo.isFunction(this.handler) && this.handler(trueTarget, e) === false) {
      return;
    }

    // we only get to here if the handler function did not return false;
    // this is the default behavior we're going to want most of the time
    if (!/#/.test(href)) {
      return;
    }

    href = href.split('#')[1];

    if (href) {
      e.preventDefault();
      e.stopPropagation();
      toura.app.Router.go(href);
    }
  },

  destroy : function() {
    dojo.forEach(this.connections || [], dojo.disconnect);
    dojo.forEach(this.secondaryConnections || [], dojo.disconnect);
    dojo.forEach(this.subscriptions || [], dojo.unsubscribe);
  }
});

}

if(!dojo._hasResource['toura._View']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura._View'] = true;
/*jslint evil:true */
dojo.provide('toura._View');

/*
 * The base view class, to be inherited by all views.
 */










(function() {

var _tmplCache = {};

dojo.declare('toura._View', [ dijit._Widget, dijit._Templated, toura._Nls ], {
  templateString : '%div',
  isHidden : false,
  isDisabled : false,

  postMixInProperties : function() {
    // make sure the device info is available
    this.inherited(arguments);

    if (!this.device) {
      this.device = toura.app.Config.get('device');
    }

    this.phone = this.device.type === 'phone';
    this.tablet = this.device.type === 'tablet';
  },

  _skipNodeCache : true,

  _stringRepl : function(tmpl) {
    var t = _tmplCache[tmpl] = (_tmplCache[tmpl] || Haml(tmpl));
    return t(this);
  },

  postCreate : function() {
    this.inherited(arguments);
  },

  /**
   * Reference for the following methods is at http://higginsforpresident.net/2010/01/widgets-within-widgets/
   */
  adopt: function(/* Function */cls, /* Object? */props, /* DomNode */node){
      // summary: Instantiate some new item from a passed Class, with props with an optional srcNode (node)
      //  reference. Also tracks this widget as if it were a child to be destroyed when this parent widget
      //  is removed.
      //
      // cls: Function
      //      The class to instantiate. Cannot be a string. Use dojo.getObject to get a full class object if you
      //      must.
      //
      // props: Object?
      //      An optional object mixed into the constructor of said cls.
      //
      // node: DomNode?
      //      An optional srcNodeRef to use with dijit._Widget. This thinger will be instantiated using
      //      this passed node as the target if passed. Otherwise a new node is created and you must placeAt() your
      //      instance somewhere in the dom for it to be useful.
      //
      // example:
      //  |    this.adopt(my.ui.Button, { onClick: function(){} }).placeAt(this.domNode);
      //
      // example:
      //  |   var x = this.adopt(my.ui.Button).placeAt(this.domNode);
      //  |   x.connect(this.domNode, "onclick", "fooBar");
      //
      //  example:
      //  If you *must* new up a thinger and only want to adopt it once, use _addItem instead:
      //  |   var t;
      //  |   if(4 > 5){ t = new my.ui.Button(); }else{ t = new my.ui.OtherButton() }
      //  |   this._addItem(t);

      var x = new cls(props, node);
      this._addItem(x);
      return x; // my.Widget
  },

  _addItem: function(/* dijit._Widget... */){
      // summary: Add any number of programatically created children to this instance for later cleanup.
      // private, use `adopt` directly.
      this._addedItems = this._addedItems || [];
      this._addedItems.push.apply(this._addedItems, arguments);
  },

  orphan: function(/* dijit._Widget */widget, /* Boolean? */destroy){
      // summary: remove a single item from this instance when we destroy it. It is the parent widget's job
      // to properly destroy an orphaned child.
      //
      // widget:
      //      A widget reference to remove from this parent.
      //
      // destroy:
      //      An optional boolean used to force immediate destruction of the child. Pass any truthy value here
      //      and the child will be orphaned and killed.
      //
      // example:
      //  Clear out all the children in an array, but do not destroy them.
      //  |   dojo.forEach(this._thumbs, this.orphan, this);
      //
      // example:
      //  Create and destroy a button cleanly:
      //  |   var x = this.adopt(my.ui.Button, {});
      //  |   this.orphan(x, true);
      //
      this._addedItems = this._addedItems || [];
      var i = dojo.indexOf(this._addedItems, widget);

      if (i >= 0) {
        this._addedItems.splice(i, 1);
      }

      if (destroy) {
        this._kill(widget);
      }
  },

  _kill: function(w){
      // summary: Private helper function to properly destroy a widget instance.
      if (w && w.destroyRecursive) {
          w.destroyRecursive();
      } else if (w && w.destroy) {
          w.destroy();
      }
  },

  query : function(sel) {
    var nl, result;

    if (!sel) {
      return new dojo.NodeList(this.domNode);
    } else {
      result = this.domNode.querySelectorAll(sel);
      nl = new dojo.NodeList();

      dojo.forEach(result, function(n) {
        nl.push(n);
      });
    }

    return nl;
  },


  preventClickDelay : function(el, handler) {
    this.clickables = this.clickables || [];

    this.clickables.push(
      new toura.ui.Clickable(el, dojo.hitch(this, handler))
    );
  },

  destroy: function(){
    // override the default destroy function to account
    // for programatically added children.
    dojo.forEach(this._addedItems, this._kill);

    // destroy scrollers

    // this would no longer be needed
    dojo.forEach(this.scrollerHandles || [], function(handle) {
      handle.destroy();
    });

    // destroy clickables
    dojo.forEach(this.clickables || [], function(c) {
      c.destroy();
    });

    this.inherited(arguments);
  },

  addClass : function(className) {
    dojo.addClass(this.domNode, className);
  },

  removeClass : function(className) {
    dojo.removeClass(this.domNode, className);
  },

  /**
   * @public
   * Shows the view if it's hidden.   It removes the `hidden` class from the
   * `_View`'s root element. By default `hidden` has a style of `display:
   * none`. If you need some other style (opacity, transitions, transfors)
   * override `hidden` for your `_View`.
   *
   * If passed a dom element as an argument, it shows that element instead.
   *
   * @param {DomElement} [domNode] The domNode you want to show (optional)
   **/
  show : function(domNode) {
    if (domNode && domNode.nodeName) {
      dojo.removeClass(domNode, 'hidden');
      return;
    }

    this.removeClass('hidden');
    this.isHidden = false;
  },

  /**
   * @public
   * Hides the view if it's currrently visible. By default, it adds the
   * `hidden` class from the `_View`'s root element. For explanation of how to
   * customize this @see `toura._View#show`.
   *
   * If passed a dom element as an argument, it hides that element instead.
   *
   * @param {DomElement} [domNode] The domNode you want to hide (optional)
   **/
  hide : function(domNode) {
    if (domNode && domNode.nodeName) {
      dojo.addClass(domNode, 'hidden');
      return;
    }

    this.addClass('hidden');
    this.isHidden = true;
  },

  /**
   * @public
   * Toggles the hidden state of the `_View`.
   * TODO: should be rerenamed toggleVisibility, or something that indicates
   * *what* it's toggling.
   **/
  toggle : function(domNode) {
    if (domNode) {
      dojo.toggleClass(domNode, 'hidden');
      return;
    }

    if (this.isHidden) {
      this.show();
    } else {
      this.hide();
    }
  },

  enable : function() {
    this.removeClass('disabled');
    this.isDisabled = false;
  },

  disable : function() {
    this.addClass('disabled');
    this.isDisabled = true;
  }

});

}());

}

if(!dojo._hasResource['toura.containers.Pages']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.containers.Pages'] = true;
dojo.provide('toura.containers.Pages');




dojo.declare('toura.containers.Pages', [ toura._View ], {
  templateString : dojo.cache("toura.containers", "Pages/Pages.haml", "%ol.page-container\n"),

  direction : 'next',

  postCreate : function() {
    this.connect(this.domNode, 'webkitAnimationEnd', '_onAnimationEnd');
  },

  _setNavDirectionAttr : function(dir) {
    this.direction = dir === 'back' ? 'prev' : 'next';
  },

  _setContentAttr : function(newPage) {
    if (toura.animating) { return; }

    var n = this.domNode,
        next = this.direction === 'next';

    this.direction = 'next'; // reset
    this.currentPage = newPage;

    if (n.children.length) {
      toura.animating = true;
      this.addClass('pre-slide');
      newPage.placeAt(n, next ? 'last' : 'first');
      this.addClass(next ? 'slide-left' : 'slide-right');
    } else {
      newPage.placeAt(n, 'last');
      this._onAnimationEnd();
    }

    setTimeout(function() {
      // sometimes webkitAnimationEnd doesn't fire :/
      if (this.animating) {
        this._onAnimationEnd();
      }
    }, 600);
  },

  _cleanupOldPage : function() {
    var pages = document.querySelectorAll('ol.page-container > li');

    dojo.forEach(pages, function(page) {
      if (this.currentPage.domNode !== page) {
        dojo.destroy(page);

        var widget = dijit.byNode(page);

        if (widget) { widget.destroy(); }
      }
    }, this);

    this.removeClass(['slide-left', 'slide-right', 'pre-slide']);
  },

  _onAnimationEnd : function() {
    this._cleanupOldPage();
    toura.animating = false;
    dojo.publish('/page/transition/end');
  }
});

}

if(!dojo._hasResource['toura.components._Component']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components._Component'] = true;
dojo.provide('toura.components._Component');




dojo.declare('toura.components._Component', [ toura._View ], {
  handleClicks : false,

  /**
   * This is a stub for implementation by components that inherit from
   * _Component.
   *
   * This will run prior to the template being rendered; if there's any data
   * you need to massage before rendering the template, this is the place to do
   * it.
   */
  prepareData : function() { },

  /**
   * This is a stub for implementation by components that inherit from
   * _Component.
   *
   * This will run after the DOM for the component has been created, but before
   * it is visible in the page. This is where you should do any connections
   * required by the component.
   */
  setupConnections : function() { },

  /**
   * This is a stub for implementation by components that inherit from
   * _Component.
   *
   * This will run after the DOM for the component has been created, but before
   * it is visible in the page. This is where you should do any subscriptions
   * that are required by the component.
   */
  setupSubscriptions : function() { },

  /**
   * This is a stub for implementation by components that inherit from
   * _Component.
   *
   * This will run after the DOM for the component has been created, but before
   * it is visible in the page. If there are components that you want to place
   * or remove conditionally, this is the place to do it.
   */
  setupChildComponents : function() { },

  /**
   * This is a stub for implementation by components that inherit from
   * _Component.
   *
   * This will run after the DOM for the component has been created, but before
   * it is visible on the page. If you want to conditionally change markup,
   * such as adding a class, this is the place to do it.
   */
  adjustMarkup : function() { },

  /**
   * This is a stub for implementation by components that inherit from
   * _Component.
   *
   * This will run after the DOM for the component has been created and placed
   * in the page, and the component is visible in the page.
   */
  resizeElements : function() { },

  /**
   * This is a stub for implementation by components that inherit from
   * _Component.
   *
   * This will run right before the component is destroyed. Use this method to
   * clean up any items that may continue to occupy memory after the component
   * is destroyed. Note that you do not need to clean up after connections and
   * subscriptions that were created with this.connect or this.subscribe.
   */
  teardown : function() { },

  postMixInProperties : function() {
    this.inherited(arguments);

    // support for new templates
    if (this.screen) {
      this.screen.registerComponent(this);
      this.connect(this.screen, 'startup', 'startup');
    }

    this.prepareData();
    this._loadHelpers();

    this.inherited(arguments);
  },

  postCreate : function() {
    this.inherited(arguments);

    if (this.isHidden) {
      this.hide();
    }

    if (this.handleClicks) {
      this.preventClickDelay(
        this.clickableNode || this.domNode,
        this._clickHandler && dojo.hitch(this, '_clickHandler')
      );
    }

    this.subscribe('/window/resize', function() {
      this.dimensions = null;
    });

    this.setupChildComponents();
    this.adjustMarkup();
    this.setupConnections();
    this.setupSubscriptions();
  },

  startup : function() {
    this.inherited(arguments);
    this.resizeElements();
  },

  destroy : function() {
    this.teardown();
    this.inherited(arguments);
  },

  _loadHelpers : function() {
    if (this.helpers && dojo.isObject(this.helpers)) {
      dojo.forIn(this.helpers, function(prop, tpl) {
        if (tpl) {
          this.helpers[prop] = Haml(tpl)();
        }
      }, this);
    }
  },

  _setupTouch : function(ele, handler) {
    var touch = toura.app.UI.hasTouch,
        evt = touch ? 'touchstart' : 'click';

    this.connect(ele, evt, handler);
    if (touch) { this.connect(ele, 'click', function(e) { e.preventDefault(); }); }
  },

  getDimensions : function() {
    var domNode = this[this.sizeNode];

    this.dimensions = this.dimensions || {
      width : dojo.style(this.domNode, 'width'),
      height : dojo.style(this.domNode, 'height')
    };

    return this.dimensions;
  }

});

toura.component = function(name, proto) {
  var p = dojo.mixin(proto, {
    templateString : proto.componentTemplate || '%div',

    prepareData : function() {
      this.inherited(arguments);

      if (proto.prep) {
        proto.prep.call(this);
      }
    },

    postCreate : function() {
      this.inherited(arguments);
      if (jQuery) { this.$domNode = jQuery(this.domNode); }
    },

    startup : function() {
      this.inherited(arguments);
      if (proto.init) {
        proto.init.call(this);
      }
    }
  });

  dojo.declare('client.components.' + name, [ toura.components._Component ], p);
};

}

if(!dojo._hasResource['toura.components.SiblingNav']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components.SiblingNav'] = true;
dojo.provide('toura.components.SiblingNav');



dojo.declare('toura.components.SiblingNav', [ toura.components._Component ], {
  templateString : dojo.cache("toura.components", "SiblingNav/SiblingNav.haml", ".component.sibling-nav\n  .handle{ dojoAttachPoint : 'handleNode' }\n    .toggler\n  %nav\n    .controller.prev{ dojoAttachPoint : 'prevButton' } prev\n    %ol.nodes{ dojoAttachPoint : 'siblingList' }\n    .controller.next{ dojoAttachPoint : 'nextButton' } next\n\n\n"),
  siblingTemplate : Haml(dojo.cache("toura.components", "SiblingNav/Sibling.haml", "%li{ class : className }\n  %span{ data-href : url }= name\n")),

  setupConnections : function() {
    var evt = toura.app.UI.hasTouch ? 'touchstart' : 'click';

    this.connect(this.handleNode, evt, 'toggle');
    this.connect(this.prevButton, evt, dojo.hitch(this, '_handleButton', 'prev'));
    this.connect(this.nextButton, evt, dojo.hitch(this, '_handleButton', 'next'));
    this.connect(this.siblingList, evt, '_handleLink');
  },

  toggle : function() {
    this.set('open', !this.open);
  },

  _handleButton : function(dir) {
    var node = this[ dir + 'Item' ];

    if (dir === 'prev') {
      toura.app.UI.set('navDirection', 'back');
    }

    toura.app.Router.go(node.url, true);
  },

  _handleLink : function(e) {
    var target = e.target,
        url = dojo.attr(target, 'data-href');

    if (!url) { return; }

    if (dojo.hasClass(target.parentNode, 'prev')) {
      toura.app.UI.set('navDirection', 'back');
    }

    toura.app.Router.go(url, true);
  },

  _setOpenAttr : function(open) {
    dojo[ open ? 'addClass' : 'removeClass' ](this.domNode, 'open');
    this.open = open;
  },

  _setNodeAttr : function(node) {
    if (!node || !node.siblings || !node.siblings.length) {
      this.hide();
      this.set('open', false);
      this.siblings = false;
      return;
    }

    this.show();

    this._processSiblings(node.siblings, node);
  },

  _processSiblings : function(siblings, currentItem) {
    this.siblings = siblings.length ? true : false;

    dojo.forEach(siblings, function(sibling, idx) {
      if (sibling.id === currentItem.id) {
        this.currentIndex = idx;
      }
    }, this);

    var nextIndex = this.currentIndex + 1;
    var prevIndex = this.currentIndex - 1;

    this.nextItem = nextIndex >= siblings.length ? null : siblings[nextIndex];
    this.prevItem = prevIndex < 0 ? null : siblings[prevIndex];

    this._updateButtons();
    this._updateLinks();
  },

  _updateButtons : function() {
    dojo[this.nextItem ? 'removeClass' : 'addClass'](this.nextButton, 'inactive');
    dojo[this.prevItem ? 'removeClass' : 'addClass'](this.prevButton, 'inactive');
  },

  _updateLinks : function() {
    var html, viewModel;

    dojo.empty(this.siblingList);

    if (this.prevItem) {
      viewModel = dojo.mixin(this.prevItem, { className : 'prev' });
      this.prevLink = dojo.place(this.siblingTemplate(viewModel), this.siblingList);
    }

    if (this.nextItem) {
      viewModel = dojo.mixin(this.nextItem, { className : 'next' });
      this.nextLink = dojo.place(this.siblingTemplate(viewModel), this.siblingList);
    }
  }


});

}

if(!dojo._hasResource['toura.app.UI']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.app.UI'] = true;
dojo.provide('toura.app.UI');










dojo.declare('toura.app.UI', [ dojo.Stateful ], {
  containers : {},
  currentPage : null,

  constructor : function(device) {
    this.device = device;
    this.body = dojo.body();
    this.hasTouch = 'ontouchstart' in window;
    this.touchMoveDebounce = device.os === 'android' ? 200 : 0;

    this._navSetup();
    this._watchers();
    this._updateViewport();

    this._uiSetup();
    this._eventSetup();
    this._containersSetup();
  },

  _watchers : function() {
    var watchers = {
      fontSize : function(k, oldSize, newSize) {
        var b = this.body;
        if (oldSize) { dojo.removeClass(b, oldSize); }
        dojo.addClass(b, newSize);
        toura.app.DeviceStorage.set('fontSize', newSize);
        dojo.publish('/fontsize');
      },

      navDirection : function(k, old, dir) {
        this.containers.pages.set('navDirection', dir);
      },

      siblingNavVisible : function(k, old, visible) {
        if (!this.siblingNav) { return; }

        if (!this.siblingNav.siblings) {
          this.siblingNav.hide();
          return;
        }

        this.siblingNav[ visible ? 'show' : 'hide' ]();
      }
    };

    dojo.forIn(watchers, this.watch, this);
  },

  _updateViewport : function() {
    this.viewport = {
      width : this.body.offsetWidth,
      height : this.body.offsetHeight
    };
  },

  _uiSetup : function() {
    var b = this.body,
        device = this.device,
        feature;

    dojo.addClass(b, device.type);
    dojo.addClass(b, device.os);
    dojo.addClass(b, 'version-' + toura.app.Phonegap.device.version);

    this.set('fontSize', toura.app.DeviceStorage.get('fontSize'));

    if (toura.features.multiLineChildNodes) {
      dojo.addClass(b, 'multi-line-child-nodes');
    }

    if (toura.isMAP) {
      dojo.addClass(b, 'layout-MAP');
    }

    dojo.forIn(toura.features, function(feature, enabled) {
      if (enabled) {
        dojo.addClass(b, 'feature-' + feature);
      }
    });
  },

  _containersSetup : function() {
    this.containers.pages = new toura.containers.Pages().placeAt(this.body, 'first');
  },

  _navSetup : function() {
    if (!toura.features.siblingNav) { return; }
    this.siblingNav = new toura.components.SiblingNav().placeAt(this.body, 'last');
    this.set('siblingNavVisible', false);
  },

  _eventSetup : function() {
    dojo.connect(document, 'touchmove', function(e) {
      e.preventDefault();
    });

    dojo.connect(window, 'resize', this, function() {
      this._updateViewport();
      dojo.publish('/window/resize');
    });

    dojo.connect(document, 'menubutton', this, function(e) {
      e.preventDefault();
      dojo.publish('/button/menu');
    });

    dojo.connect(document, 'backbutton', this, function(e) {
      e.preventDefault();
      toura.app.Router.back();
    });

    dojo.connect(document, 'searchbutton', this, function(e) {
      toura.app.Router.go('/search');
      e.preventDefault();
    });

    if (this.siblingNav) {
      dojo.connect(this.siblingNav, 'show', this, function() {
        dojo.addClass(this.body, 'sibling-nav-visible');
        dojo.publish('/window/resize');
      });

      dojo.connect(this.siblingNav, 'hide', this, function() {
        dojo.removeClass(this.body, 'sibling-nav-visible');
        dojo.publish('/window/resize');
      });
    }
  },

  showPage : function(page, node) {
    if (!page) {
      throw new Error('toura.app.UI::showPage called without a page to show');
    }

    if (page.startup) {
      var s = dojo.subscribe('/page/transition/end', function() {
        page.startup();
        dojo.unsubscribe(s);
      });
    }

    this.containers.pages.set('content', page);
    this.currentPage = page;

    if (!this.siblingNav) { return; }
    this.set('siblingNavVisible', true);
    this.siblingNav.set('node', node);
  },

  hideSplash : function() {
    var splash = dojo.byId('splash');
    if (splash) { dojo.destroy(splash); }
  },

  getCurrentPage : function() {
    return this.currentPage;
  }
});

dojo.subscribe('/app/ready', function() {
  toura.app.UI = new toura.app.UI(toura.app.Config.get('device'));
});

}

if(!dojo._hasResource["dojo.hash"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.hash"] = true;
dojo.provide("dojo.hash");


//TODOC: where does this go?
// summary:
//		Methods for monitoring and updating the hash in the browser URL.
//
// example:
//		dojo.subscribe("/dojo/hashchange", context, callback);
//
//		function callback (hashValue){
//			// do something based on the hash value.
// 		}

(function(){
	dojo.hash = function(/* String? */ hash, /* Boolean? */ replace){
		//	summary:
		//		Gets or sets the hash string.
		//	description:
		//		Handles getting and setting of location.hash.
		//		 - If no arguments are passed, acts as a getter.
		//		 - If a string is passed, acts as a setter.
		//	hash:
		//		the hash is set - #string.
		//	replace:
		//		If true, updates the hash value in the current history
		//		state instead of creating a new history state.
		//	returns:
		//		when used as a getter, returns the current hash string.
		//		when used as a setter, returns the new hash string.
		
		// getter
		if(!arguments.length){
			return _getHash();
		}
		// setter
		if(hash.charAt(0) == "#"){
			hash = hash.substring(1);
		}
		if(replace){
			_replace(hash);
		}else{
			location.href = "#" + hash;
		}
		return hash; // String
	};

	// Global vars
	var _recentHash, _ieUriMonitor, _connect,
		_pollFrequency = dojo.config.hashPollFrequency || 100;

	//Internal functions
	function _getSegment(str, delimiter){
		var i = str.indexOf(delimiter);
		return (i >= 0) ? str.substring(i+1) : "";
	}
	
	function _getHash(){
		return _getSegment(location.href, "#");
	}

	function _dispatchEvent(){
		dojo.publish("/dojo/hashchange", [_getHash()]);
	}

	function _pollLocation(){
		if(_getHash() === _recentHash){
			return;
		}
		_recentHash = _getHash();
		_dispatchEvent();
	}
	
	function _replace(hash){
		if(_ieUriMonitor){
			if(_ieUriMonitor.isTransitioning()){
				setTimeout(dojo.hitch(null,_replace,hash), _pollFrequency);
				return;
			}
			var href = _ieUriMonitor.iframe.location.href;
			var index = href.indexOf('?');
			// main frame will detect and update itself
			_ieUriMonitor.iframe.location.replace(href.substring(0, index) + "?" + hash);
			return;
		}
		location.replace("#"+hash);
		!_connect && _pollLocation();
	}

	function IEUriMonitor(){
		// summary:
		//		Determine if the browser's URI has changed or if the user has pressed the
		//		back or forward button. If so, call _dispatchEvent.
		//
		//	description:
		//		IE doesn't add changes to the URI's hash into the history unless the hash
		//		value corresponds to an actual named anchor in the document. To get around
		//      this IE difference, we use a background IFrame to maintain a back-forward
		//		history, by updating the IFrame's query string to correspond to the
		//		value of the main browser location's hash value.
		//
		//		E.g. if the value of the browser window's location changes to
		//
		//		#action=someAction
		//
		//		... then we'd update the IFrame's source to:
		//
		//		?action=someAction
		//
		//		This design leads to a somewhat complex state machine, which is
		//		described below:
		//
		//		s1: Stable state - neither the window's location has changed nor
		//			has the IFrame's location. Note that this is the 99.9% case, so
		//			we optimize for it.
		//			Transitions: s1, s2, s3
		//		s2: Window's location changed - when a user clicks a hyperlink or
		//			code programmatically changes the window's URI.
		//			Transitions: s4
		//		s3: Iframe's location changed as a result of user pressing back or
		//			forward - when the user presses back or forward, the location of
		//			the background's iframe changes to the previous or next value in
		//			its history.
		//			Transitions: s1
		//		s4: IEUriMonitor has programmatically changed the location of the
		//			background iframe, but it's location hasn't yet changed. In this
		//			case we do nothing because we need to wait for the iframe's
		//			location to reflect its actual state.
		//			Transitions: s4, s5
		//		s5:	IEUriMonitor has programmatically changed the location of the
		//			background iframe, and the iframe's location has caught up with
		//			reality. In this case we need to transition to s1.
		//			Transitions: s1
		//
		//		The hashchange event is always dispatched on the transition back to s1.
		//

		// create and append iframe
		var ifr = document.createElement("iframe"),
			IFRAME_ID = "dojo-hash-iframe",
			ifrSrc = dojo.config.dojoBlankHtmlUrl || dojo.moduleUrl("dojo", "resources/blank.html");

		if(dojo.config.useXDomain && !dojo.config.dojoBlankHtmlUrl){
			console.warn("dojo.hash: When using cross-domain Dojo builds,"
				+ " please save dojo/resources/blank.html to your domain and set djConfig.dojoBlankHtmlUrl"
				+ " to the path on your domain to blank.html");
		}

		ifr.id = IFRAME_ID;
		ifr.src = ifrSrc + "?" + _getHash();
		ifr.style.display = "none";
		document.body.appendChild(ifr);

		this.iframe = dojo.global[IFRAME_ID];
		var recentIframeQuery, transitioning, expectedIFrameQuery, docTitle, ifrOffline,
			iframeLoc = this.iframe.location;

		function resetState(){
			_recentHash = _getHash();
			recentIframeQuery = ifrOffline ? _recentHash : _getSegment(iframeLoc.href, "?");
			transitioning = false;
			expectedIFrameQuery = null;
		}

		this.isTransitioning = function(){
			return transitioning;
		};
		
		this.pollLocation = function(){
			if(!ifrOffline) {
				try{
					//see if we can access the iframe's location without a permission denied error
					var iframeSearch = _getSegment(iframeLoc.href, "?");
					//good, the iframe is same origin (no thrown exception)
					if(document.title != docTitle){ //sync title of main window with title of iframe.
						docTitle = this.iframe.document.title = document.title;
					}
				}catch(e){
					//permission denied - server cannot be reached.
					ifrOffline = true;
					console.error("dojo.hash: Error adding history entry. Server unreachable.");
				}
			}
			var hash = _getHash();
			if(transitioning && _recentHash === hash){
				// we're in an iframe transition (s4 or s5)
				if(ifrOffline || iframeSearch === expectedIFrameQuery){
					// s5 (iframe caught up to main window or iframe offline), transition back to s1
					resetState();
					_dispatchEvent();
				}else{
					// s4 (waiting for iframe to catch up to main window)
					setTimeout(dojo.hitch(this,this.pollLocation),0);
					return;
				}
			}else if(_recentHash === hash && (ifrOffline || recentIframeQuery === iframeSearch)){
				// we're in stable state (s1, iframe query == main window hash), do nothing
			}else{
				// the user has initiated a URL change somehow.
				// sync iframe query <-> main window hash
				if(_recentHash !== hash){
					// s2 (main window location changed), set iframe url and transition to s4
					_recentHash = hash;
					transitioning = true;
					expectedIFrameQuery = hash;
					ifr.src = ifrSrc + "?" + expectedIFrameQuery;
					ifrOffline = false;	//we're updating the iframe src - set offline to false so we can check again on next poll.
					setTimeout(dojo.hitch(this,this.pollLocation),0); //yielded transition to s4 while iframe reloads.
					return;
				}else if(!ifrOffline){
					// s3 (iframe location changed via back/forward button), set main window url and transition to s1.
					location.href = "#" + iframeLoc.search.substring(1);
					resetState();
					_dispatchEvent();
				}
			}
			setTimeout(dojo.hitch(this,this.pollLocation), _pollFrequency);
		};
		resetState(); // initialize state (transition to s1)
		setTimeout(dojo.hitch(this,this.pollLocation), _pollFrequency);
	}
	dojo.addOnLoad(function(){
		if("onhashchange" in dojo.global && (!dojo.isIE || (dojo.isIE >= 8 && document.compatMode != "BackCompat"))){	//need this IE browser test because "onhashchange" exists in IE8 in IE7 mode
			_connect = dojo.connect(dojo.global,"onhashchange",_dispatchEvent);
		}else{
			if(document.addEventListener){ // Non-IE
				_recentHash = _getHash();
				setInterval(_pollLocation, _pollFrequency); //Poll the window location for changes
			}else if(document.attachEvent){ // IE7-
				//Use hidden iframe in versions of IE that don't have onhashchange event
				_ieUriMonitor = new IEUriMonitor();
			}
			// else non-supported browser, do nothing.
		}
	});
})();

}

if(!dojo._hasResource['toura.app.Router']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.app.Router'] = true;
dojo.provide('toura.app.Router');




/**
 * toura.Router provides an API for specifying hash-based URLs
 * ("routes") and the functionality associated with each. It allows
 * the routes to include both path and query string parameters which
 * are then available inside the handling function:
 *
 *    /things/:id     ->    #/things/3
 *    /things         ->    #/things?id=3&color=red
 *
 * Defining a route involves providing a string route matcher, and
 * a function to run for the route. The function receives two arguments:
 * an object containing the parameters associated with the route, if any;
 * and a route object with information about the route itself.
 *
 * The concept for this class is based largely on the wonderful
 * Sammy.js, a jQuery-based framework for accomplishing all of this and
 * more. See http://code.quirkey.com/sammy/ for details.
 *
 * @author rmurphey
 */

(function(d) {
  d.declare('toura.app.Router', null, {
    QUERY_STRING_MATCHER : /\?([^#]*)$/,
    PATH_REPLACER : "([^\/]+)",
    PATH_NAME_MATCHER : /:([\w\d]+)/g,

    _routes : [],

    _cache : {},
    _currentHash : null,

    // yay feature detection!
    _hasHistoryState : !!(history.pushState && history.replaceState),

    /**
     * @constructor
     */
    constructor : function(config) {
      if (!config || !config.routes) {
        throw new Error('No routes defined for toura.app.Router');
      }

      d.forEach(config.routes, function(r) {
        this.registerRoute(r.route, r.handler, r.defaultRoute);
      }, this);
    },

    /**
     * Initializes the router and routes the current URL.
     * This should be run after all routes have been defined.
     */
    init : function() {
      if (!this.defaultRoute) {
        console.error("No default route provided to router.");
        throw new Error("No default route provided to router.");
      }

      var hash = window.location.hash.toString(),
          loc = hash.replace('#','') || this.defaultRoute.origRoute;

      this.go(loc);

      d.subscribe('/dojo/hashchange', this, '_handleHash');

      if (this._hasHistoryState) {
        d.connect(window, 'onpopstate', this, function() {
          var hash = window.location.hash.replace('#','');
          this._handleHash(hash);
        });
      }
    },

    /**
     * Redirects the application to a new hash.
     * @param {String} loc The location to redirect to.
     */
    go : function(loc, replace, state) {
      var hash = loc.replace('#', ''),
          urlHash;

      if (this._hasHistoryState) {
        history[ replace ? 'replaceState' : 'pushState' ](state, null, '#' + hash);
        // history[replace ? 'replaceState' : 'pushState'](null, null, '#' + hash);
        this._handleHash(hash);
      } else {
        window.location.hash = hash;
        this._handleHash(hash);
      }
    },

    /**
     * @public
     * Sets the navigation state to back and navigates to the previous state in
     * the browser history.
     */
    back : function() {
      toura.app.UI.set('navDirection', 'back');
      history.back();
    },

    /**
     * @public
     * Sets the navigation state to back and navigates to the home page.
     */
    home : function() {
      toura.app.UI.set('navDirection', 'back');
      this.go('/home');
    },

    /**
     * Identifies and runs the route that matches the current hash
     * @private
     * @param {String} hash The current hash, as provided by the /dojo/hashchange topic
     */
    _handleHash : function(hash) {
      if (hash === this._currentHash) {
        console.log('>>> hash is a dupe, ignoring: ' + hash);
        return;
      }

      this._currentHash = hash;

      toura.logSection('Handling ' + hash);

      var route = this.currentRoute = this._lookupRoute(hash),
          params,
          proceed = true;

      hash = hash.replace('#','');

      if (!route) {
        console.log('No route found for hash ' + hash);
        this.go(this.defaultRoute.origRoute);
        return;
      }

      params = this._parseParamsFromHash(hash);
      params.pageState = window.history.state;
      route = d.mixin(route, { hash : hash });

      route.callback(params, route);

      d.publish('/router/handleHash/after');
      toura.endLogSection('Handling ' + hash);
    },

    /**
     * Creates a params object based on a hash
     * @private
     * @param {String} hash The hash to parse
     * @returns Params object containing all params from hash
     * @type Object
     */
    _parseParamsFromHash : function(hash) {
      var parts = hash.split('?'),
          path = parts[0],
          query = parts[1],
          params,
          pathParams,
          _decode = decodeURIComponent,
          route = this.currentRoute;

      params = query ? d.mixin({}, d.queryToObject(query)) : {};

      if ((pathParams = route.path.exec(this._routeablePath(path))) !== null) {
        // first match is the full path
        pathParams.shift();

        // for each of the matches
        d.forEach(pathParams, function(param, i) {
          // if theres a matching param name
          if (route.paramNames[i]) {
            // set the name to the match
            params[route.paramNames[i]] = _decode(param);
          } else {
            // initialize 'splat'
            if (!params.splat) { params.splat = []; }
            params.splat.push(_decode(param));
          }
        });
      }

      return params;
    },

    /**
     * Finds a route that matches the provided hash
     * @private
     * @param {String} hash The hash to find a route for
     * @returns A route object for the hash, or the default route object if no match is found
     * @type Object
     */
    _lookupRoute : function(hash) {
      var routeablePath = this._routeablePath(hash);

      if (!this._cache[hash]) {
        d.forEach(this._routes, function(route) {
          if (this._routeablePath(hash).match(route.path)) {
            this._cache[hash] = route;
          }
        }, this);
      }

      return this._cache[hash];
    },

    /**
     * Converts a hash into a string suitable for matching against a route definition
     * @private
     * @param {String} hash The hash to convert
     * @returns A string with query params removed
     * @type String
     */
    _routeablePath : function(hash) {
      return hash.replace(this.QUERY_STRING_MATCHER, '');
    },

    /**
     * @private
     * Registers a route definition with the router
     * @param {String|RegEx} route The route definition string. This can include
     * parameter names, prefixed by a colon. It must NOT include the # symbol
     * at the beginning; this is assumed. For example, a route definition string
     * can look like '/foo' or '/foo/:id' or even '/foo/:id/bar/:thing'
     * @param {Function} fn The function to run for the route. This function
     * receives one argument: an object containing the params parsed from the hash.
     * @param {Boolean} defaultRoute Whether the route should be used
     * as the default route.
     */
    registerRoute : function(route, fn, defaultRoute) {
      var pathMatch,
          paramNames = [],
          origRoute = route,
          r;

      this.PATH_NAME_MATCHER.lastIndex = 0;

      while ((pathMatch = this.PATH_NAME_MATCHER.exec(route)) !== null) {
        paramNames.push(pathMatch[1]);
      }

      // replace with the path replacement
      route = d.isString(route) ?
        new RegExp("^" + route.replace(this.PATH_NAME_MATCHER, this.PATH_REPLACER) + "$") :
        route;

      r = {
        origRoute : origRoute,
        path : route,
        callback : fn,
        paramNames : paramNames
      };

      this._routes.push(r);

      if (defaultRoute) {
        this.defaultRoute = r;
      }
    }
  });
}(dojo));

}

if(!dojo._hasResource['toura.models._Updateable']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.models._Updateable'] = true;
dojo.provide('toura.models._Updateable');




/**
 * @class toura.models._Updateable
 *
 * A base class for any updateable resource.
 */
dojo.declare('toura.models._Updateable', [], {
  /**
   * The location of the bundled data, if any
   * @optional
   */
  bundleDataUrl : '',

  /**
   * The location of the remote data
   * @required
   */
  remoteDataUrl : '',

  /**
   * The location of the remote version information
   * @required
   */
  remoteVersionUrl : '',

  /**
   * A storage key prefix for storing the version in local storage.
   * @required
   */
  storageKey : '',

  /**
   * An integer indicating when the remote was last checked for a new version.
   */
  lastChecked : 0,

  /**
   * @constructor
   */
  constructor : function(config) {
    dojo.mixin(this, config);
  },

  /**
   * @public
   *
   * This method allows consumers to request the items associated with the
   * updateable resource. It must be implemented by subclasses.
   *
   * @returns {Array} An array of items.
   */
  getItems : function() {
    console.warn('The getItems method has not been implemented by ', this.declaredClass);
    return this._items || [];
  },

  /**
   * @public
   *
   * This method ensures that bundled data has been loaded into the
   * application, and then checks to see whether there is newer data available
   * on the remote. If there is newer data available, then the local data is
   * replaced with the newer data.
   *
   * @returns {Promise} A promise that, if resolved, will be resolved with a
   * boolean value. If the value is true, then the data was updated during the
   * bootstrapping process.
   */
  bootstrap : function() {
    console.log('toura.models._Updateable::bootstrap()');

    var localVersion = this._getLocalVersion(),
        dfd = this.deferred = new dojo.Deferred();

    dojo.when(
      // if localVersion < 0, then this is the first boot,
      // so we need to initialize the data; otherwise, we can
      // proceed with updating if necessary
      localVersion < 0 ? this._initializeData() : true,
      dojo.hitch(this, '_updateIfNecessary')
    ).then(dojo.hitch(this, '_onUpdate'));

    return dfd.promise;
  },

  _onUpdate : function(remoteData) {
    if (remoteData) {
      if (remoteData.appVersion && this._isAppVersionCompatible(remoteData.appVersion)) {
        // if there was remote data, we need to store it
        dojo.when(this._store(remoteData), dojo.hitch(this, function() {
          // once we've stored it, we have a chance to run a hook
          this._onDataReady();

          // finally, we're done -- we resolve true to indicate we
          // updated the data successfully
          this.deferred.resolve(true);
        }));
      } else {
        // not storing remote data so resolve false
        this.deferred.resolve(false);
      }
    } else {
      this.deferred.resolve(false);
    }
  },

  _isAppVersionCompatible: function(versionString) {
    var appVersion = toura.app.Config.get('appVersion'),
        appMajorVersion = this._parseMajorVersion(appVersion);

    return appMajorVersion === this._parseMajorVersion(versionString);
  },

  _updateIfNecessary : function() {
    // update the local version if it was originally < 0
    var dfd = new dojo.Deferred(),
        localVersion = this._getLocalVersion();

    dojo.when(
      // first, get the remote version
      this._getRemoteVersion(),

      // once we have the remote version ...
      dojo.hitch(this, function(remoteVersionData) {
        var appMajorVersion = this._parseMajorVersion(toura.app.Config.get('appVersion'));

        if (remoteVersionData) {
          remoteVersionData.appVersion = remoteVersionData.appVersion || "2.0";
        }

        // check that app and remote major versions are compatible and that
        // remote version is newer than the local version
        if (
           remoteVersionData &&
           this._isAppVersionCompatible(remoteVersionData.appVersion) &&
           (remoteVersionData.version > localVersion)
        ) {

          // if the remote version is newer, we need to fetch new data from the remote
          this._getRemoteData()
            .then(
              // once we have new remote data ...
              dojo.hitch(this, function(remoteData) {
                if (!remoteData) {
                  // if it was empty for some reason, we're done
                  dfd.resolve(false);
                  return;
                }
                dfd.resolve(remoteData);
              })
            );
        } else {
          // if the remote version isn't newer, the local data we have is fine

          // again, we have a chance to run a hook if we need
          this._onDataReady();

          // since we didn't update the data, we resolve the dfd false
          dfd.resolve(false);
        }
      }),

      // ... hm, we did not get the remote version
      function() {
        dfd.resolve(false);
      }
    );

    return dfd.promise;
  },

  /**
   * @private
   * @param {String} url The url for the request
   * @param {Object} dfd The deferred that should be rejected or resolved
   * @returns {XHR} A configuration object for passing to dojo.xhrGet
   */
  _xhr : function(url, dfd) {
    return dojo.xhrGet({
      url : url,
      preventCache : true,
      handleAs : 'json',
      contentType : false,
      load : dfd.resolve,
      error : dfd.reject
    });
  },

  /**
   * @private
   * @returns {Promise} A promise that, if resolved, will be resolved with the
   * current version of the remote data.
   */
  _getRemoteVersion : function() {
    this.lastChecked = new Date().getTime();

    var dfd = new dojo.Deferred();

    if (toura.skipVersionCheck || !this.remoteVersionUrl) {
      console.log('No remote version URL -- skipping remote version check');
      dfd.resolve({ version : -1 });
    } else {
      toura.app.Phonegap.network.isReachable()
        .then(
          dojo.hitch(this, function(isReachable) {
            if (!isReachable) {
              dfd.resolve({ version : -1 });
              return;
            }

            this._xhr(this.remoteVersionUrl, dfd);
          }),

          dfd.reject
        );
    }

    return dfd.promise;
  },

  /**
   * @private
   * @returns {Number} The current local version, or -1 if there is no current
   * local version.
   */
  _getLocalVersion : function() {
    var v = toura.app.DeviceStorage.get(this.storageKey + '-version') || -1;
    return v;
  },

  /**
   * @private
   */
  _setLocalVersion : function(v) {
    toura.app.DeviceStorage.set(this.storageKey + '-version', v);
  },


  /**
   * @private
   * @returns {Promise} A promise that, if resolved, will be resolved with the
   * remote data.
   */
  _getRemoteData : function() {
    var dfd = new dojo.Deferred();

    if (!this.remoteDataUrl) {
      console.log('No remote data URL -- skipping remote data check');
      dfd.resolve(false);
    } else {
      toura.app.Phonegap.network.isReachable()
        .then(
          dojo.hitch(this, function() {
            this._xhr(this.remoteDataUrl, dfd);
          }),
          function() {
            dfd.resolve(false);
          }
        );
    }

    return dfd.promise;
  },

  /**
   * @private
   * @returns {Object} The bundled data
   */
  _getBundleData : function() {
    var dfd = new dojo.Deferred();

    if (!this.bundleDataUrl) {
      dfd.resolve();
    }

    dojo.io.script.get({
      url : this.bundleDataUrl,
      preventCache : true
    }).then(
      dojo.hitch(this, function(bundleData) {
        dfd.resolve(this._processBundleData(bundleData));
      }),
      function() { dfd.reject('Could not load local bundle data'); }
    );

    return dfd.promise;
  },

  /**
   * @private
   *
   * This method is run once the bundled data has been loaded. Because bundled
   * data is formatted as a regular JavaScript file, not as JSON, it generally
   * assigns the data to a location in the toura namespace (for example, to
   * toura.data.local). This method should be implemented by subclasses so they
   * can specify this location once the data has been loaded; subclasses should
   * return the data:
   *
   *   return toura.data.local;
   *
   * The returned data will be used by _getBundleData to resolve its deferred.
   *
   * @returns {Object}
   */
  _processBundleData : function(data) {
    console.warn('_processBundleData was not implemented by', this.declaredClass);
    return data;
  },

  /**
   * @private
   *
   * This method loads and stores the bundled data.
   *
   * @returns {Promise}
   */
  _initializeData : function() {
    var dfd = new dojo.Deferred();

    this._getBundleData().then(

      dojo.hitch(this, function(data) {

        console.log('toura.models._Updateable::_initializeData() got', data);

        if (!data) {
          dfd.resolve(false);
          return;
        }

        dojo.when(this._store(data), function() {
          dfd.resolve(true);
        });

      })

    );

    return dfd.promise;
  },

  /**
   * @private
   *
   * Instructions for storing the data. This should be extended by
   * subclasses if necessary.
   */
  _store : function(sourceData) {
    this.lastUpdated = new Date().getTime();
    this._items = sourceData.items;
    this._setLocalVersion(sourceData && sourceData.version || 0);
  },

  /**
   * @private
   *
   * Parse the major version out of a version string as a number.
   */
  _parseMajorVersion: function(versionString) {
    return +versionString.split('.')[0];
  },

  /**
   * @private
   *
   * Things to do once we know the data's ready -- to be implemented by
   * subclasses if necessary.
   */
  _onDataReady : function() { }

});


}

if(!dojo._hasResource['toura.models.Tour']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.models.Tour'] = true;
dojo.provide('toura.models.Tour');



dojo.declare('toura.models.Tour', [ toura.models._Updateable ], {
  storageKey : 'tour',

  _store : function(data) {
    this.inherited(arguments);

    var dfd = new dojo.Deferred();

    if (data.app) {
      toura.app.DeviceStorage.set('app', data.app);
    }

    if (data.items) {
      toura.app.DeviceStorage.set('tour', data.items)
        .then(function() { dfd.resolve(true); });
    }

    return dfd.promise;
  },

  getItems : function() {
    if (this._items) {
      return this._items;
    }

    var dfd = new dojo.Deferred();

    toura.app.DeviceStorage.get('tour')
      .then(dojo.hitch(this, function(items) {
        if (toura.extraRawTourData && dojo.isArray(toura.extraRawTourData)) {
          dojo.forEach(toura.extraRawTourData, function(item) { items.push(item); });
        }

        this._items = items;
        dfd.resolve(items);
      }));

    return dfd.promise;
  },

  _processBundleData : function() {
    return toura.data.local;
  },

  _onDataReady : function() {
    toura.app.Config.set('app', toura.app.DeviceStorage.get('app'));
  }
});


}

if(!dojo._hasResource['toura.app.Bootstrapper']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.app.Bootstrapper'] = true;
dojo.provide('toura.app.Bootstrapper');







toura.app.Bootstrapper = function() {
  var dfd = new dojo.Deferred(),
      app = toura.app,
      tour;

  // open up the database connection so we can work with it
  app.DeviceStorage.init(app.Config.get("id"));
  // app.DeviceStorage.drop();

  tour = toura.app.Tour = new toura.models.Tour({
    bundleDataUrl : toura.localDataUrl || ('./data/tour.js' + (app.Phonegap.present ? '.jet' : '')),
    remoteDataUrl : app.Config.get('updateUrl'),
    remoteVersionUrl : app.Config.get('versionUrl')
  });

  dojo.subscribe('/page/transition/end', function() {
    // how long has it been since we last checked for an update?
    var lastChecked = tour.lastChecked,
        now = new Date().getTime(),
        since = now - lastChecked,
        maxTime = 1000 * 60 * 60 * (toura.otaInterval || 8), // 8 hours
        outdated = since > maxTime;

    if (!outdated) { return; }

    tour.bootstrap().then(function(gotUpdate) {
      if (!gotUpdate) { return; }

      dojo.when(toura.app.Tour.getItems(), function(data) {
        toura.app.Data.loadData(data);

        alert(
          dojo.i18n.getLocalization(
            "toura", "toura", toura.app.Config.get("locale")
          ).OTA_UPDATE_NOTICE
        );

        toura.app.Router.home();
      });
    });
  });

  tour.bootstrap().then(dfd.resolve, dfd.reject);

  return dfd.promise;
};

}

if(!dojo._hasResource["dojo.store.util.QueryResults"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.store.util.QueryResults"] = true;
dojo.provide("dojo.store.util.QueryResults");

dojo.getObject("store.util", true, dojo);

dojo.store.util.QueryResults = function(results){
	// summary:
	//		A function that wraps the results of a store query with additional
	//		methods.
	//
	// description:
	//		QueryResults is a basic wrapper that allows for array-like iteration
	//		over any kind of returned data from a query.  While the simplest store
	//		will return a plain array of data, other stores may return deferreds or
	//		promises; this wrapper makes sure that *all* results can be treated
	//		the same.
	//
	//		Additional methods include `forEach`, `filter` and `map`.
	//
	// returns: Object
	//		An array-like object that can be used for iterating over.
	//
	// example:
	//		Query a store and iterate over the results.
	//
	//	|	store.query({ prime: true }).forEach(function(item){
	//	|		//	do something
	//	|	});
	
	if(!results){
		return results;
	}
	// if it is a promise it may be frozen
	if(results.then){
		results = dojo.delegate(results);
	}
	function addIterativeMethod(method){
		if(!results[method]){
			results[method] = function(){
				var args = arguments;
				return dojo.when(results, function(results){
					Array.prototype.unshift.call(args, results);
					return dojo.store.util.QueryResults(dojo[method].apply(dojo, args));
				});
			};
		}
	}
	addIterativeMethod("forEach");
	addIterativeMethod("filter");
	addIterativeMethod("map");
	if(!results.total){
		results.total = dojo.when(results, function(results){
			return results.length;
		});
	}
	return results;
};

}

if(!dojo._hasResource["dojo.store.util.SimpleQueryEngine"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.store.util.SimpleQueryEngine"] = true;
dojo.provide("dojo.store.util.SimpleQueryEngine");

dojo.getObject("store.util", true, dojo);

/*=====
dojo.store.util.SimpleQueryEngine.__sortInformation = function(attribute, descending){
	// summary:
	//		An object describing what attribute to sort on, and the direction of the sort.
	// attribute: String
	//		The name of the attribute to sort on.
	// descending: Boolean
	//		The direction of the sort.  Default is false.
	this.attribute = attribute;
	this.descending = descending;
};

dojo.store.util.SimpleQueryEngine.__queryOptions = function(sort, start, count){
	// summary:
	//		Optional object with additional parameters for query results.
	// sort: dojo.store.util.SimpleQueryEngine.__sortInformation[]?
	//		A list of attributes to sort on, as well as direction
	// start: Number?
	//		The first result to begin iteration on
	// count: Number?
	//		The number of how many results should be returned.
	this.sort = sort;
	this.start = start;
	this.count = count;
};
=====*/

dojo.store.util.SimpleQueryEngine = function(query, options){
	// summary:
	//		Simple query engine that matches using filter functions, named filter
	//		functions or objects by name-value on a query object hash
	//
	// description:
	//		The SimpleQueryEngine provides a way of getting a QueryResults through
	//		the use of a simple object hash as a filter.  The hash will be used to
	//		match properties on data objects with the corresponding value given. In
	//		other words, only exact matches will be returned.
	//
	//		This function can be used as a template for more complex query engines;
	//		for example, an engine can be created that accepts an object hash that
	//		contains filtering functions, or a string that gets evaluated, etc.
	//
	//		When creating a new dojo.store, simply set the store's queryEngine
	//		field as a reference to this function.
	//
	// query: Object
	//		An object hash with fields that may match fields of items in the store.
	//		Values in the hash will be compared by normal == operator, but regular expressions
	//		or any object that provides a test() method are also supported and can be
	// 		used to match strings by more complex expressions
	// 		(and then the regex's or object's test() method will be used to match values).
	//
	// options: dojo.store.util.SimpleQueryEngine.__queryOptions?
	//		An object that contains optional information such as sort, start, and count.
	//
	// returns: Function
	//		A function that caches the passed query under the field "matches".  See any
	//		of the "query" methods on dojo.stores.
	//
	// example:
	//		Define a store with a reference to this engine, and set up a query method.
	//
	//	|	var myStore = function(options){
	//	|		//	...more properties here
	//	|		this.queryEngine = dojo.store.util.SimpleQueryEngine;
	//	|		//	define our query method
	//	|		this.query = function(query, options){
	//	|			return dojo.store.util.QueryResults(this.queryEngine(query, options)(this.data));
	//	|		};
	//	|	};

	// create our matching query function
	switch(typeof query){
		default:
			throw new Error("Can not query with a " + typeof query);
		case "object": case "undefined":
			var queryObject = query;
			query = function(object){
				for(var key in queryObject){
					var required = queryObject[key];
					if(required && required.test){
						if(!required.test(object[key])){
							return false;
						}
					}else if(required != object[key]){
						return false;
					}
				}
				return true;
			};
			break;
		case "string":
			// named query
			if(!this[query]){
				throw new Error("No filter function " + query + " was found in store");
			}
			query = this[query];
			// fall through
		case "function":
			// fall through
	}
	function execute(array){
		// execute the whole query, first we filter
		var results = dojo.filter(array, query);
		// next we sort
		if(options && options.sort){
			results.sort(function(a, b){
				for(var sort, i=0; sort = options.sort[i]; i++){
					var aValue = a[sort.attribute];
					var bValue = b[sort.attribute];
					if (aValue != bValue) {
						return !!sort.descending == aValue > bValue ? -1 : 1;
					}
				}
				return 0;
			});
		}
		// now we paginate
		if(options && (options.start || options.count)){
			var total = results.length;
			results = results.slice(options.start || 0, (options.start || 0) + (options.count || Infinity));
			results.total = total;
		}
		return results;
	}
	execute.matches = query;
	return execute;
};

}

if(!dojo._hasResource["dojo.store.Memory"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.store.Memory"] = true;
dojo.provide("dojo.store.Memory");




dojo.declare("dojo.store.Memory", null, {
	constructor: function(/*dojo.store.Memory*/ options){
		// summary:
		//		This is a basic in-memory object store.
		// options:
		//		This provides any configuration information that will be mixed into the store.
		// 		This should generally include the data property to provide the starting set of data.
		this.index = {};
		dojo.mixin(this, options);
		this.setData(this.data || []);
	},
	// data: Array
	//		The array of all the objects in the memory store
	data:null,

	// idProperty: String
	//		Indicates the property to use as the identity property. The values of this
	//		property should be unique.
	idProperty: "id",

	// index: Object
	//		An index of data by id
	index:null,

	// queryEngine: Function
	//		Defines the query engine to use for querying the data store
	queryEngine: dojo.store.util.SimpleQueryEngine,
	get: function(id){
		//	summary:
		//		Retrieves an object by its identity
		//	id: Number
		//		The identity to use to lookup the object
		//	returns: Object
		//		The object in the store that matches the given id.
		return this.index[id];
	},
	getIdentity: function(object){
		// 	summary:
		//		Returns an object's identity
		// 	object: Object
		//		The object to get the identity from
		//	returns: Number
		return object[this.idProperty];
	},
	put: function(object, options){
		// 	summary:
		//		Stores an object
		// 	object: Object
		//		The object to store.
		// 	options: Object?
		//		Additional metadata for storing the data.  Includes an "id"
		//		property if a specific id is to be used.
		//	returns: Number
		var id = options && options.id || object[this.idProperty] || Math.random();
		this.index[id] = object;
		var data = this.data,
			idProperty = this.idProperty;
		for(var i = 0, l = data.length; i < l; i++){
			if(data[i][idProperty] == id){
				data[i] = object;
				return id;
			}
		}
		this.data.push(object);
		return id;
	},
	add: function(object, options){
		// 	summary:
		//		Creates an object, throws an error if the object already exists
		// 	object: Object
		//		The object to store.
		// 	options: Object?
		//		Additional metadata for storing the data.  Includes an "id"
		//		property if a specific id is to be used.
		//	returns: Number
		if(this.index[options && options.id || object[this.idProperty]]){
			throw new Error("Object already exists");
		}
		return this.put(object, options);
	},
	remove: function(id){
		// 	summary:
		//		Deletes an object by its identity
		// 	id: Number
		//		The identity to use to delete the object
		delete this.index[id];
		var data = this.data,
			idProperty = this.idProperty;
		for(var i = 0, l = data.length; i < l; i++){
			if(data[i][idProperty] == id){
				data.splice(i, 1);
				return;
			}
		}
	},
	query: function(query, options){
		// 	summary:
		//		Queries the store for objects.
		// 	query: Object
		//		The query to use for retrieving objects from the store.
		//	options: dojo.store.util.SimpleQueryEngine.__queryOptions?
		//		The optional arguments to apply to the resultset.
		//	returns: dojo.store.util.QueryResults
		//		The results of the query, extended with iterative methods.
		//
		// 	example:
		// 		Given the following store:
		//
		// 	|	var store = new dojo.store.Memory({
		// 	|		data: [
		// 	|			{id: 1, name: "one", prime: false },
		//	|			{id: 2, name: "two", even: true, prime: true},
		//	|			{id: 3, name: "three", prime: true},
		//	|			{id: 4, name: "four", even: true, prime: false},
		//	|			{id: 5, name: "five", prime: true}
		//	|		]
		//	|	});
		//
		//	...find all items where "prime" is true:
		//
		//	|	var results = store.query({ prime: true });
		//
		//	...or find all items where "even" is true:
		//
		//	|	var results = store.query({ even: true });
		return dojo.store.util.QueryResults(this.queryEngine(query, options)(this.data));
	},
	setData: function(data){
		// 	summary:
		//		Sets the given data as the source for this store, and indexes it
		//	data: Object[]
		//		An array of objects to use as the source of data.
		if(data.items){
			// just for convenience with the data format IFRS expects
			this.idProperty = data.identifier;
			data = this.data = data.items;
		}else{
			this.data = data;
		}

		for(var i = 0, l = data.length; i < l; i++){
			var object = data[i];
			this.index[object[this.idProperty]] = object;
		}
	}
});

}

if(!dojo._hasResource["dojo.date"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.date"] = true;
dojo.provide("dojo.date");

dojo.getObject("date", true, dojo);

/*=====
dojo.date = {
	// summary: Date manipulation utilities
}
=====*/

dojo.date.getDaysInMonth = function(/*Date*/dateObject){
	//	summary:
	//		Returns the number of days in the month used by dateObject
	var month = dateObject.getMonth();
	var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	if(month == 1 && dojo.date.isLeapYear(dateObject)){ return 29; } // Number
	return days[month]; // Number
};

dojo.date.isLeapYear = function(/*Date*/dateObject){
	//	summary:
	//		Determines if the year of the dateObject is a leap year
	//	description:
	//		Leap years are years with an additional day YYYY-02-29, where the
	//		year number is a multiple of four with the following exception: If
	//		a year is a multiple of 100, then it is only a leap year if it is
	//		also a multiple of 400. For example, 1900 was not a leap year, but
	//		2000 is one.

	var year = dateObject.getFullYear();
	return !(year%400) || (!(year%4) && !!(year%100)); // Boolean
};

// FIXME: This is not localized
dojo.date.getTimezoneName = function(/*Date*/dateObject){
	//	summary:
	//		Get the user's time zone as provided by the browser
	// dateObject:
	//		Needed because the timezone may vary with time (daylight savings)
	//	description:
	//		Try to get time zone info from toString or toLocaleString method of
	//		the Date object -- UTC offset is not a time zone.  See
	//		http://www.twinsun.com/tz/tz-link.htm Note: results may be
	//		inconsistent across browsers.

	var str = dateObject.toString(); // Start looking in toString
	var tz = ''; // The result -- return empty string if nothing found
	var match;

	// First look for something in parentheses -- fast lookup, no regex
	var pos = str.indexOf('(');
	if(pos > -1){
		tz = str.substring(++pos, str.indexOf(')'));
	}else{
		// If at first you don't succeed ...
		// If IE knows about the TZ, it appears before the year
		// Capital letters or slash before a 4-digit year
		// at the end of string
		var pat = /([A-Z\/]+) \d{4}$/;
		if((match = str.match(pat))){
			tz = match[1];
		}else{
		// Some browsers (e.g. Safari) glue the TZ on the end
		// of toLocaleString instead of putting it in toString
			str = dateObject.toLocaleString();
			// Capital letters or slash -- end of string,
			// after space
			pat = / ([A-Z\/]+)$/;
			if((match = str.match(pat))){
				tz = match[1];
			}
		}
	}

	// Make sure it doesn't somehow end up return AM or PM
	return (tz == 'AM' || tz == 'PM') ? '' : tz; // String
};

// Utility methods to do arithmetic calculations with Dates

dojo.date.compare = function(/*Date*/date1, /*Date?*/date2, /*String?*/portion){
	//	summary:
	//		Compare two date objects by date, time, or both.
	//	description:
	//  	Returns 0 if equal, positive if a > b, else negative.
	//	date1:
	//		Date object
	//	date2:
	//		Date object.  If not specified, the current Date is used.
	//	portion:
	//		A string indicating the "date" or "time" portion of a Date object.
	//		Compares both "date" and "time" by default.  One of the following:
	//		"date", "time", "datetime"

	// Extra step required in copy for IE - see #3112
	date1 = new Date(+date1);
	date2 = new Date(+(date2 || new Date()));

	if(portion == "date"){
		// Ignore times and compare dates.
		date1.setHours(0, 0, 0, 0);
		date2.setHours(0, 0, 0, 0);
	}else if(portion == "time"){
		// Ignore dates and compare times.
		date1.setFullYear(0, 0, 0);
		date2.setFullYear(0, 0, 0);
	}
	
	if(date1 > date2){ return 1; } // int
	if(date1 < date2){ return -1; } // int
	return 0; // int
};

dojo.date.add = function(/*Date*/date, /*String*/interval, /*int*/amount){
	//	summary:
	//		Add to a Date in intervals of different size, from milliseconds to years
	//	date: Date
	//		Date object to start with
	//	interval:
	//		A string representing the interval.  One of the following:
	//			"year", "month", "day", "hour", "minute", "second",
	//			"millisecond", "quarter", "week", "weekday"
	//	amount:
	//		How much to add to the date.

	var sum = new Date(+date); // convert to Number before copying to accomodate IE (#3112)
	var fixOvershoot = false;
	var property = "Date";

	switch(interval){
		case "day":
			break;
		case "weekday":
			//i18n FIXME: assumes Saturday/Sunday weekend, but this is not always true.  see dojo.cldr.supplemental

			// Divide the increment time span into weekspans plus leftover days
			// e.g., 8 days is one 5-day weekspan / and two leftover days
			// Can't have zero leftover days, so numbers divisible by 5 get
			// a days value of 5, and the remaining days make up the number of weeks
			var days, weeks;
			var mod = amount % 5;
			if(!mod){
				days = (amount > 0) ? 5 : -5;
				weeks = (amount > 0) ? ((amount-5)/5) : ((amount+5)/5);
			}else{
				days = mod;
				weeks = parseInt(amount/5);
			}
			// Get weekday value for orig date param
			var strt = date.getDay();
			// Orig date is Sat / positive incrementer
			// Jump over Sun
			var adj = 0;
			if(strt == 6 && amount > 0){
				adj = 1;
			}else if(strt == 0 && amount < 0){
			// Orig date is Sun / negative incrementer
			// Jump back over Sat
				adj = -1;
			}
			// Get weekday val for the new date
			var trgt = strt + days;
			// New date is on Sat or Sun
			if(trgt == 0 || trgt == 6){
				adj = (amount > 0) ? 2 : -2;
			}
			// Increment by number of weeks plus leftover days plus
			// weekend adjustments
			amount = (7 * weeks) + days + adj;
			break;
		case "year":
			property = "FullYear";
			// Keep increment/decrement from 2/29 out of March
			fixOvershoot = true;
			break;
		case "week":
			amount *= 7;
			break;
		case "quarter":
			// Naive quarter is just three months
			amount *= 3;
			// fallthrough...
		case "month":
			// Reset to last day of month if you overshoot
			fixOvershoot = true;
			property = "Month";
			break;
//		case "hour":
//		case "minute":
//		case "second":
//		case "millisecond":
		default:
			property = "UTC"+interval.charAt(0).toUpperCase() + interval.substring(1) + "s";
	}

	if(property){
		sum["set"+property](sum["get"+property]()+amount);
	}

	if(fixOvershoot && (sum.getDate() < date.getDate())){
		sum.setDate(0);
	}

	return sum; // Date
};

dojo.date.difference = function(/*Date*/date1, /*Date?*/date2, /*String?*/interval){
	//	summary:
	//		Get the difference in a specific unit of time (e.g., number of
	//		months, weeks, days, etc.) between two dates, rounded to the
	//		nearest integer.
	//	date1:
	//		Date object
	//	date2:
	//		Date object.  If not specified, the current Date is used.
	//	interval:
	//		A string representing the interval.  One of the following:
	//			"year", "month", "day", "hour", "minute", "second",
	//			"millisecond", "quarter", "week", "weekday"
	//		Defaults to "day".

	date2 = date2 || new Date();
	interval = interval || "day";
	var yearDiff = date2.getFullYear() - date1.getFullYear();
	var delta = 1; // Integer return value

	switch(interval){
		case "quarter":
			var m1 = date1.getMonth();
			var m2 = date2.getMonth();
			// Figure out which quarter the months are in
			var q1 = Math.floor(m1/3) + 1;
			var q2 = Math.floor(m2/3) + 1;
			// Add quarters for any year difference between the dates
			q2 += (yearDiff * 4);
			delta = q2 - q1;
			break;
		case "weekday":
			var days = Math.round(dojo.date.difference(date1, date2, "day"));
			var weeks = parseInt(dojo.date.difference(date1, date2, "week"));
			var mod = days % 7;

			// Even number of weeks
			if(mod == 0){
				days = weeks*5;
			}else{
				// Weeks plus spare change (< 7 days)
				var adj = 0;
				var aDay = date1.getDay();
				var bDay = date2.getDay();

				weeks = parseInt(days/7);
				mod = days % 7;
				// Mark the date advanced by the number of
				// round weeks (may be zero)
				var dtMark = new Date(date1);
				dtMark.setDate(dtMark.getDate()+(weeks*7));
				var dayMark = dtMark.getDay();

				// Spare change days -- 6 or less
				if(days > 0){
					switch(true){
						// Range starts on Sat
						case aDay == 6:
							adj = -1;
							break;
						// Range starts on Sun
						case aDay == 0:
							adj = 0;
							break;
						// Range ends on Sat
						case bDay == 6:
							adj = -1;
							break;
						// Range ends on Sun
						case bDay == 0:
							adj = -2;
							break;
						// Range contains weekend
						case (dayMark + mod) > 5:
							adj = -2;
					}
				}else if(days < 0){
					switch(true){
						// Range starts on Sat
						case aDay == 6:
							adj = 0;
							break;
						// Range starts on Sun
						case aDay == 0:
							adj = 1;
							break;
						// Range ends on Sat
						case bDay == 6:
							adj = 2;
							break;
						// Range ends on Sun
						case bDay == 0:
							adj = 1;
							break;
						// Range contains weekend
						case (dayMark + mod) < 0:
							adj = 2;
					}
				}
				days += adj;
				days -= (weeks*2);
			}
			delta = days;
			break;
		case "year":
			delta = yearDiff;
			break;
		case "month":
			delta = (date2.getMonth() - date1.getMonth()) + (yearDiff * 12);
			break;
		case "week":
			// Truncate instead of rounding
			// Don't use Math.floor -- value may be negative
			delta = parseInt(dojo.date.difference(date1, date2, "day")/7);
			break;
		case "day":
			delta /= 24;
			// fallthrough
		case "hour":
			delta /= 60;
			// fallthrough
		case "minute":
			delta /= 60;
			// fallthrough
		case "second":
			delta /= 1000;
			// fallthrough
		case "millisecond":
			delta *= date2.getTime() - date1.getTime();
	}

	// Round for fractional values and DST leaps
	return Math.round(delta); // Number (integer)
};

}

if(!dojo._hasResource["dojo.cldr.supplemental"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.cldr.supplemental"] = true;
dojo.provide("dojo.cldr.supplemental");


dojo.getObject("cldr.supplemental", true, dojo);

dojo.cldr.supplemental.getFirstDayOfWeek = function(/*String?*/locale){
// summary: Returns a zero-based index for first day of the week
// description:
//		Returns a zero-based index for first day of the week, as used by the local (Gregorian) calendar.
//		e.g. Sunday (returns 0), or Monday (returns 1)

	// from http://www.unicode.org/cldr/data/common/supplemental/supplementalData.xml:supplementalData/weekData/firstDay
	var firstDay = {/*default is 1=Monday*/
		mv:5,
		ae:6,af:6,bh:6,dj:6,dz:6,eg:6,er:6,et:6,iq:6,ir:6,jo:6,ke:6,kw:6,
		ly:6,ma:6,om:6,qa:6,sa:6,sd:6,so:6,sy:6,tn:6,ye:6,
		ar:0,as:0,az:0,bw:0,ca:0,cn:0,fo:0,ge:0,gl:0,gu:0,hk:0,
		il:0,'in':0,jm:0,jp:0,kg:0,kr:0,la:0,mh:0,mn:0,mo:0,mp:0,
		mt:0,nz:0,ph:0,pk:0,sg:0,th:0,tt:0,tw:0,um:0,us:0,uz:0,
		vi:0,zw:0
// variant. do not use?		gb:0,
	};

	var country = dojo.cldr.supplemental._region(locale);
	var dow = firstDay[country];
	return (dow === undefined) ? 1 : dow; /*Number*/
};

dojo.cldr.supplemental._region = function(/*String?*/locale){
	locale = dojo.i18n.normalizeLocale(locale);
	var tags = locale.split('-');
	var region = tags[1];
	if(!region){
		// IE often gives language only (#2269)
		// Arbitrary mappings of language-only locales to a country:
		region = {de:"de", en:"us", es:"es", fi:"fi", fr:"fr", he:"il", hu:"hu", it:"it",
			ja:"jp", ko:"kr", nl:"nl", pt:"br", sv:"se", zh:"cn"}[tags[0]];
	}else if(region.length == 4){
		// The ISO 3166 country code is usually in the second position, unless a
		// 4-letter script is given. See http://www.ietf.org/rfc/rfc4646.txt
		region = tags[2];
	}
	return region;
};

dojo.cldr.supplemental.getWeekend = function(/*String?*/locale){
// summary: Returns a hash containing the start and end days of the weekend
// description:
//		Returns a hash containing the start and end days of the weekend according to local custom using locale,
//		or by default in the user's locale.
//		e.g. {start:6, end:0}

	// from http://www.unicode.org/cldr/data/common/supplemental/supplementalData.xml:supplementalData/weekData/weekend{Start,End}
	var weekendStart = {/*default is 6=Saturday*/
		'in':0,
		af:4,dz:4,ir:4,om:4,sa:4,ye:4,
		ae:5,bh:5,eg:5,il:5,iq:5,jo:5,kw:5,ly:5,ma:5,qa:5,sd:5,sy:5,tn:5
	};

	var weekendEnd = {/*default is 0=Sunday*/
		af:5,dz:5,ir:5,om:5,sa:5,ye:5,
		ae:6,bh:5,eg:6,il:6,iq:6,jo:6,kw:6,ly:6,ma:6,qa:6,sd:6,sy:6,tn:6
	};

	var country = dojo.cldr.supplemental._region(locale);
	var start = weekendStart[country];
	var end = weekendEnd[country];
	if(start === undefined){start=6;}
	if(end === undefined){end=0;}
	return {start:start, end:end}; /*Object {start,end}*/
};

}

if(!dojo._hasResource["dojo.regexp"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.regexp"] = true;
dojo.provide("dojo.regexp");

dojo.getObject("regexp", true, dojo);

/*=====
dojo.regexp = {
	// summary: Regular expressions and Builder resources
};
=====*/

dojo.regexp.escapeString = function(/*String*/str, /*String?*/except){
	//	summary:
	//		Adds escape sequences for special characters in regular expressions
	// except:
	//		a String with special characters to be left unescaped

	return str.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, function(ch){
		if(except && except.indexOf(ch) != -1){
			return ch;
		}
		return "\\" + ch;
	}); // String
};

dojo.regexp.buildGroupRE = function(/*Object|Array*/arr, /*Function*/re, /*Boolean?*/nonCapture){
	//	summary:
	//		Builds a regular expression that groups subexpressions
	//	description:
	//		A utility function used by some of the RE generators. The
	//		subexpressions are constructed by the function, re, in the second
	//		parameter.  re builds one subexpression for each elem in the array
	//		a, in the first parameter. Returns a string for a regular
	//		expression that groups all the subexpressions.
	// arr:
	//		A single value or an array of values.
	// re:
	//		A function. Takes one parameter and converts it to a regular
	//		expression.
	// nonCapture:
	//		If true, uses non-capturing match, otherwise matches are retained
	//		by regular expression. Defaults to false

	// case 1: a is a single value.
	if(!(arr instanceof Array)){
		return re(arr); // String
	}

	// case 2: a is an array
	var b = [];
	for(var i = 0; i < arr.length; i++){
		// convert each elem to a RE
		b.push(re(arr[i]));
	}

	 // join the REs as alternatives in a RE group.
	return dojo.regexp.group(b.join("|"), nonCapture); // String
};

dojo.regexp.group = function(/*String*/expression, /*Boolean?*/nonCapture){
	// summary:
	//		adds group match to expression
	// nonCapture:
	//		If true, uses non-capturing match, otherwise matches are retained
	//		by regular expression.
	return "(" + (nonCapture ? "?:":"") + expression + ")"; // String
};

}

if(!dojo._hasResource["dojo.date.locale"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.date.locale"] = true;
dojo.provide("dojo.date.locale");







dojo.getObject("date.locale", true, dojo);

// Localization methods for Date.   Honor local customs using locale-dependent dojo.cldr data.


// Load the bundles containing localization information for
// names and formats

//NOTE: Everything in this module assumes Gregorian calendars.
// Other calendars will be implemented in separate modules.

(function(){
	// Format a pattern without literals
	function formatPattern(dateObject, bundle, options, pattern){
		return pattern.replace(/([a-z])\1*/ig, function(match){
			var s, pad,
				c = match.charAt(0),
				l = match.length,
				widthList = ["abbr", "wide", "narrow"];
			switch(c){
				case 'G':
					s = bundle[(l < 4) ? "eraAbbr" : "eraNames"][dateObject.getFullYear() < 0 ? 0 : 1];
					break;
				case 'y':
					s = dateObject.getFullYear();
					switch(l){
						case 1:
							break;
						case 2:
							if(!options.fullYear){
								s = String(s); s = s.substr(s.length - 2);
								break;
							}
							// fallthrough
						default:
							pad = true;
					}
					break;
				case 'Q':
				case 'q':
					s = Math.ceil((dateObject.getMonth()+1)/3);
//					switch(l){
//						case 1: case 2:
							pad = true;
//							break;
//						case 3: case 4: // unimplemented
//					}
					break;
				case 'M':
					var m = dateObject.getMonth();
					if(l<3){
						s = m+1; pad = true;
					}else{
						var propM = ["months", "format", widthList[l-3]].join("-");
						s = bundle[propM][m];
					}
					break;
				case 'w':
					var firstDay = 0;
					s = dojo.date.locale._getWeekOfYear(dateObject, firstDay); pad = true;
					break;
				case 'd':
					s = dateObject.getDate(); pad = true;
					break;
				case 'D':
					s = dojo.date.locale._getDayOfYear(dateObject); pad = true;
					break;
				case 'E':
					var d = dateObject.getDay();
					if(l<3){
						s = d+1; pad = true;
					}else{
						var propD = ["days", "format", widthList[l-3]].join("-");
						s = bundle[propD][d];
					}
					break;
				case 'a':
					var timePeriod = (dateObject.getHours() < 12) ? 'am' : 'pm';
					s = options[timePeriod] || bundle['dayPeriods-format-wide-' + timePeriod];
					break;
				case 'h':
				case 'H':
				case 'K':
				case 'k':
					var h = dateObject.getHours();
					// strange choices in the date format make it impossible to write this succinctly
					switch (c){
						case 'h': // 1-12
							s = (h % 12) || 12;
							break;
						case 'H': // 0-23
							s = h;
							break;
						case 'K': // 0-11
							s = (h % 12);
							break;
						case 'k': // 1-24
							s = h || 24;
							break;
					}
					pad = true;
					break;
				case 'm':
					s = dateObject.getMinutes(); pad = true;
					break;
				case 's':
					s = dateObject.getSeconds(); pad = true;
					break;
				case 'S':
					s = Math.round(dateObject.getMilliseconds() * Math.pow(10, l-3)); pad = true;
					break;
				case 'v': // FIXME: don't know what this is. seems to be same as z?
				case 'z':
					// We only have one timezone to offer; the one from the browser
					s = dojo.date.locale._getZone(dateObject, true, options);
					if(s){break;}
					l=4;
					// fallthrough... use GMT if tz not available
				case 'Z':
					var offset = dojo.date.locale._getZone(dateObject, false, options);
					var tz = [
						(offset<=0 ? "+" : "-"),
						dojo.string.pad(Math.floor(Math.abs(offset)/60), 2),
						dojo.string.pad(Math.abs(offset)% 60, 2)
					];
					if(l==4){
						tz.splice(0, 0, "GMT");
						tz.splice(3, 0, ":");
					}
					s = tz.join("");
					break;
//				case 'Y': case 'u': case 'W': case 'F': case 'g': case 'A': case 'e':
//					console.log(match+" modifier unimplemented");
				default:
					throw new Error("dojo.date.locale.format: invalid pattern char: "+pattern);
			}
			if(pad){ s = dojo.string.pad(s, l); }
			return s;
		});
	}

/*=====
	dojo.date.locale.__FormatOptions = function(){
	//	selector: String
	//		choice of 'time','date' (default: date and time)
	//	formatLength: String
	//		choice of long, short, medium or full (plus any custom additions).  Defaults to 'short'
	//	datePattern:String
	//		override pattern with this string
	//	timePattern:String
	//		override pattern with this string
	//	am: String
	//		override strings for am in times
	//	pm: String
	//		override strings for pm in times
	//	locale: String
	//		override the locale used to determine formatting rules
	//	fullYear: Boolean
	//		(format only) use 4 digit years whenever 2 digit years are called for
	//	strict: Boolean
	//		(parse only) strict parsing, off by default
		this.selector = selector;
		this.formatLength = formatLength;
		this.datePattern = datePattern;
		this.timePattern = timePattern;
		this.am = am;
		this.pm = pm;
		this.locale = locale;
		this.fullYear = fullYear;
		this.strict = strict;
	}
=====*/

dojo.date.locale._getZone = function(/*Date*/dateObject, /*boolean*/getName, /*dojo.date.locale.__FormatOptions?*/options){
	// summary:
	//		Returns the zone (or offset) for the given date and options.  This
	//		is broken out into a separate function so that it can be overridden
	//		by timezone-aware code.
	//
	// dateObject:
	//		the date and/or time being formatted.
	//
	// getName:
	//		Whether to return the timezone string (if true), or the offset (if false)
	//
	// options:
	//		The options being used for formatting
	if(getName){
		return dojo.date.getTimezoneName(dateObject);
	}else{
		return dateObject.getTimezoneOffset();
	}
};


dojo.date.locale.format = function(/*Date*/dateObject, /*dojo.date.locale.__FormatOptions?*/options){
	// summary:
	//		Format a Date object as a String, using locale-specific settings.
	//
	// description:
	//		Create a string from a Date object using a known localized pattern.
	//		By default, this method formats both date and time from dateObject.
	//		Formatting patterns are chosen appropriate to the locale.  Different
	//		formatting lengths may be chosen, with "full" used by default.
	//		Custom patterns may be used or registered with translations using
	//		the dojo.date.locale.addCustomFormats method.
	//		Formatting patterns are implemented using [the syntax described at
	//		unicode.org](http://www.unicode.org/reports/tr35/tr35-4.html#Date_Format_Patterns)
	//
	// dateObject:
	//		the date and/or time to be formatted.  If a time only is formatted,
	//		the values in the year, month, and day fields are irrelevant.  The
	//		opposite is true when formatting only dates.

	options = options || {};

	var locale = dojo.i18n.normalizeLocale(options.locale),
		formatLength = options.formatLength || 'short',
		bundle = dojo.date.locale._getGregorianBundle(locale),
		str = [],
		sauce = dojo.hitch(this, formatPattern, dateObject, bundle, options);
	if(options.selector == "year"){
		return _processPattern(bundle["dateFormatItem-yyyy"] || "yyyy", sauce);
	}
	var pattern;
	if(options.selector != "date"){
		pattern = options.timePattern || bundle["timeFormat-"+formatLength];
		if(pattern){str.push(_processPattern(pattern, sauce));}
	}
	if(options.selector != "time"){
		pattern = options.datePattern || bundle["dateFormat-"+formatLength];
		if(pattern){str.push(_processPattern(pattern, sauce));}
	}

	return str.length == 1 ? str[0] : bundle["dateTimeFormat-"+formatLength].replace(/\{(\d+)\}/g,
		function(match, key){ return str[key]; }); // String
};

dojo.date.locale.regexp = function(/*dojo.date.locale.__FormatOptions?*/options){
	// summary:
	//		Builds the regular needed to parse a localized date

	return dojo.date.locale._parseInfo(options).regexp; // String
};

dojo.date.locale._parseInfo = function(/*dojo.date.locale.__FormatOptions?*/options){
	options = options || {};
	var locale = dojo.i18n.normalizeLocale(options.locale),
		bundle = dojo.date.locale._getGregorianBundle(locale),
		formatLength = options.formatLength || 'short',
		datePattern = options.datePattern || bundle["dateFormat-" + formatLength],
		timePattern = options.timePattern || bundle["timeFormat-" + formatLength],
		pattern;
	if(options.selector == 'date'){
		pattern = datePattern;
	}else if(options.selector == 'time'){
		pattern = timePattern;
	}else{
		pattern = bundle["dateTimeFormat-"+formatLength].replace(/\{(\d+)\}/g,
			function(match, key){ return [timePattern, datePattern][key]; });
	}

	var tokens = [],
		re = _processPattern(pattern, dojo.hitch(this, _buildDateTimeRE, tokens, bundle, options));
	return {regexp: re, tokens: tokens, bundle: bundle};
};

dojo.date.locale.parse = function(/*String*/value, /*dojo.date.locale.__FormatOptions?*/options){
	// summary:
	//		Convert a properly formatted string to a primitive Date object,
	//		using locale-specific settings.
	//
	// description:
	//		Create a Date object from a string using a known localized pattern.
	//		By default, this method parses looking for both date and time in the string.
	//		Formatting patterns are chosen appropriate to the locale.  Different
	//		formatting lengths may be chosen, with "full" used by default.
	//		Custom patterns may be used or registered with translations using
	//		the dojo.date.locale.addCustomFormats method.
	//
	//		Formatting patterns are implemented using [the syntax described at
	//		unicode.org](http://www.unicode.org/reports/tr35/tr35-4.html#Date_Format_Patterns)
	//		When two digit years are used, a century is chosen according to a sliding
	//		window of 80 years before and 20 years after present year, for both `yy` and `yyyy` patterns.
	//		year < 100CE requires strict mode.
	//
	// value:
	//		A string representation of a date

	// remove non-printing bidi control chars from input and pattern
	var controlChars = /[\u200E\u200F\u202A\u202E]/g,
		info = dojo.date.locale._parseInfo(options),
		tokens = info.tokens, bundle = info.bundle,
		re = new RegExp("^" + info.regexp.replace(controlChars, "") + "$",
			info.strict ? "" : "i"),
		match = re.exec(value && value.replace(controlChars, ""));

	if(!match){ return null; } // null

	var widthList = ['abbr', 'wide', 'narrow'],
		result = [1970,0,1,0,0,0,0], // will get converted to a Date at the end
		amPm = "",
		valid = dojo.every(match, function(v, i){
		if(!i){return true;}
		var token=tokens[i-1];
		var l=token.length;
		switch(token.charAt(0)){
			case 'y':
				if(l != 2 && options.strict){
					//interpret year literally, so '5' would be 5 A.D.
					result[0] = v;
				}else{
					if(v<100){
						v = Number(v);
						//choose century to apply, according to a sliding window
						//of 80 years before and 20 years after present year
						var year = '' + new Date().getFullYear(),
							century = year.substring(0, 2) * 100,
							cutoff = Math.min(Number(year.substring(2, 4)) + 20, 99),
							num = (v < cutoff) ? century + v : century - 100 + v;
						result[0] = num;
					}else{
						//we expected 2 digits and got more...
						if(options.strict){
							return false;
						}
						//interpret literally, so '150' would be 150 A.D.
						//also tolerate '1950', if 'yyyy' input passed to 'yy' format
						result[0] = v;
					}
				}
				break;
			case 'M':
				if(l>2){
					var months = bundle['months-format-' + widthList[l-3]].concat();
					if(!options.strict){
						//Tolerate abbreviating period in month part
						//Case-insensitive comparison
						v = v.replace(".","").toLowerCase();
						months = dojo.map(months, function(s){ return s.replace(".","").toLowerCase(); } );
					}
					v = dojo.indexOf(months, v);
					if(v == -1){
//						console.log("dojo.date.locale.parse: Could not parse month name: '" + v + "'.");
						return false;
					}
				}else{
					v--;
				}
				result[1] = v;
				break;
			case 'E':
			case 'e':
				var days = bundle['days-format-' + widthList[l-3]].concat();
				if(!options.strict){
					//Case-insensitive comparison
					v = v.toLowerCase();
					days = dojo.map(days, function(d){return d.toLowerCase();});
				}
				v = dojo.indexOf(days, v);
				if(v == -1){
//					console.log("dojo.date.locale.parse: Could not parse weekday name: '" + v + "'.");
					return false;
				}

				//TODO: not sure what to actually do with this input,
				//in terms of setting something on the Date obj...?
				//without more context, can't affect the actual date
				//TODO: just validate?
				break;
			case 'D':
				result[1] = 0;
				// fallthrough...
			case 'd':
				result[2] = v;
				break;
			case 'a': //am/pm
				var am = options.am || bundle['dayPeriods-format-wide-am'],
					pm = options.pm || bundle['dayPeriods-format-wide-pm'];
				if(!options.strict){
					var period = /\./g;
					v = v.replace(period,'').toLowerCase();
					am = am.replace(period,'').toLowerCase();
					pm = pm.replace(period,'').toLowerCase();
				}
				if(options.strict && v != am && v != pm){
//					console.log("dojo.date.locale.parse: Could not parse am/pm part.");
					return false;
				}

				// we might not have seen the hours field yet, so store the state and apply hour change later
				amPm = (v == pm) ? 'p' : (v == am) ? 'a' : '';
				break;
			case 'K': //hour (1-24)
				if(v == 24){ v = 0; }
				// fallthrough...
			case 'h': //hour (1-12)
			case 'H': //hour (0-23)
			case 'k': //hour (0-11)
				//TODO: strict bounds checking, padding
				if(v > 23){
//					console.log("dojo.date.locale.parse: Illegal hours value");
					return false;
				}

				//in the 12-hour case, adjusting for am/pm requires the 'a' part
				//which could come before or after the hour, so we will adjust later
				result[3] = v;
				break;
			case 'm': //minutes
				result[4] = v;
				break;
			case 's': //seconds
				result[5] = v;
				break;
			case 'S': //milliseconds
				result[6] = v;
//				break;
//			case 'w':
//TODO				var firstDay = 0;
//			default:
//TODO: throw?
//				console.log("dojo.date.locale.parse: unsupported pattern char=" + token.charAt(0));
		}
		return true;
	});

	var hours = +result[3];
	if(amPm === 'p' && hours < 12){
		result[3] = hours + 12; //e.g., 3pm -> 15
	}else if(amPm === 'a' && hours == 12){
		result[3] = 0; //12am -> 0
	}

	//TODO: implement a getWeekday() method in order to test
	//validity of input strings containing 'EEE' or 'EEEE'...

	var dateObject = new Date(result[0], result[1], result[2], result[3], result[4], result[5], result[6]); // Date
	if(options.strict){
		dateObject.setFullYear(result[0]);
	}

	// Check for overflow.  The Date() constructor normalizes things like April 32nd...
	//TODO: why isn't this done for times as well?
	var allTokens = tokens.join(""),
		dateToken = allTokens.indexOf('d') != -1,
		monthToken = allTokens.indexOf('M') != -1;

	if(!valid ||
		(monthToken && dateObject.getMonth() > result[1]) ||
		(dateToken && dateObject.getDate() > result[2])){
		return null;
	}

	// Check for underflow, due to DST shifts.  See #9366
	// This assumes a 1 hour dst shift correction at midnight
	// We could compare the timezone offset after the shift and add the difference instead.
	if((monthToken && dateObject.getMonth() < result[1]) ||
		(dateToken && dateObject.getDate() < result[2])){
		dateObject = dojo.date.add(dateObject, "hour", 1);
	}

	return dateObject; // Date
};

function _processPattern(pattern, applyPattern, applyLiteral, applyAll){
	//summary: Process a pattern with literals in it

	// Break up on single quotes, treat every other one as a literal, except '' which becomes '
	var identity = function(x){return x;};
	applyPattern = applyPattern || identity;
	applyLiteral = applyLiteral || identity;
	applyAll = applyAll || identity;

	//split on single quotes (which escape literals in date format strings)
	//but preserve escaped single quotes (e.g., o''clock)
	var chunks = pattern.match(/(''|[^'])+/g),
		literal = pattern.charAt(0) == "'";

	dojo.forEach(chunks, function(chunk, i){
		if(!chunk){
			chunks[i]='';
		}else{
			chunks[i]=(literal ? applyLiteral : applyPattern)(chunk.replace(/''/g, "'"));
			literal = !literal;
		}
	});
	return applyAll(chunks.join(''));
}

function _buildDateTimeRE(tokens, bundle, options, pattern){
	pattern = dojo.regexp.escapeString(pattern);
	if(!options.strict){ pattern = pattern.replace(" a", " ?a"); } // kludge to tolerate no space before am/pm
	return pattern.replace(/([a-z])\1*/ig, function(match){
		// Build a simple regexp.  Avoid captures, which would ruin the tokens list
		var s,
			c = match.charAt(0),
			l = match.length,
			p2 = '', p3 = '';
		if(options.strict){
			if(l > 1){ p2 = '0' + '{'+(l-1)+'}'; }
			if(l > 2){ p3 = '0' + '{'+(l-2)+'}'; }
		}else{
			p2 = '0?'; p3 = '0{0,2}';
		}
		switch(c){
			case 'y':
				s = '\\d{2,4}';
				break;
			case 'M':
				s = (l>2) ? '\\S+?' : p2+'[1-9]|1[0-2]';
				break;
			case 'D':
				s = p2+'[1-9]|'+p3+'[1-9][0-9]|[12][0-9][0-9]|3[0-5][0-9]|36[0-6]';
				break;
			case 'd':
				s = '3[01]|[12]\\d|'+p2+'[1-9]';
				break;
			case 'w':
				s = p2+'[1-9]|[1-4][0-9]|5[0-3]';
				break;
			case 'E':
				s = '\\S+';
				break;
			case 'h': //hour (1-12)
				s = p2+'[1-9]|1[0-2]';
				break;
			case 'k': //hour (0-11)
				s = p2+'\\d|1[01]';
				break;
			case 'H': //hour (0-23)
				s = p2+'\\d|1\\d|2[0-3]';
				break;
			case 'K': //hour (1-24)
				s = p2+'[1-9]|1\\d|2[0-4]';
				break;
			case 'm':
			case 's':
				s = '[0-5]\\d';
				break;
			case 'S':
				s = '\\d{'+l+'}';
				break;
			case 'a':
				var am = options.am || bundle['dayPeriods-format-wide-am'],
					pm = options.pm || bundle['dayPeriods-format-wide-pm'];
				if(options.strict){
					s = am + '|' + pm;
				}else{
					s = am + '|' + pm;
					if(am != am.toLowerCase()){ s += '|' + am.toLowerCase(); }
					if(pm != pm.toLowerCase()){ s += '|' + pm.toLowerCase(); }
					if(s.indexOf('.') != -1){ s += '|' + s.replace(/\./g, ""); }
				}
				s = s.replace(/\./g, "\\.");
				break;
			default:
			// case 'v':
			// case 'z':
			// case 'Z':
				s = ".*";
//				console.log("parse of date format, pattern=" + pattern);
		}

		if(tokens){ tokens.push(match); }

		return "(" + s + ")"; // add capture
	}).replace(/[\xa0 ]/g, "[\\s\\xa0]"); // normalize whitespace.  Need explicit handling of \xa0 for IE.
}
})();

(function(){
var _customFormats = [];
dojo.date.locale.addCustomFormats = function(/*String*/packageName, /*String*/bundleName){
	// summary:
	//		Add a reference to a bundle containing localized custom formats to be
	//		used by date/time formatting and parsing routines.
	//
	// description:
	//		The user may add custom localized formats where the bundle has properties following the
	//		same naming convention used by dojo.cldr: `dateFormat-xxxx` / `timeFormat-xxxx`
	//		The pattern string should match the format used by the CLDR.
	//		See dojo.date.locale.format() for details.
	//		The resources must be loaded by dojo.requireLocalization() prior to use

	_customFormats.push({pkg:packageName,name:bundleName});
};

dojo.date.locale._getGregorianBundle = function(/*String*/locale){
	var gregorian = {};
	dojo.forEach(_customFormats, function(desc){
		var bundle = dojo.i18n.getLocalization(desc.pkg, desc.name, locale);
		gregorian = dojo.mixin(gregorian, bundle);
	}, this);
	return gregorian; /*Object*/
};
})();

dojo.date.locale.addCustomFormats("dojo.cldr","gregorian");

dojo.date.locale.getNames = function(/*String*/item, /*String*/type, /*String?*/context, /*String?*/locale){
	// summary:
	//		Used to get localized strings from dojo.cldr for day or month names.
	//
	// item:
	//	'months' || 'days'
	// type:
	//	'wide' || 'narrow' || 'abbr' (e.g. "Monday", "Mon", or "M" respectively, in English)
	// context:
	//	'standAlone' || 'format' (default)
	// locale:
	//	override locale used to find the names

	var label,
		lookup = dojo.date.locale._getGregorianBundle(locale),
		props = [item, context, type];
	if(context == 'standAlone'){
		var key = props.join('-');
		label = lookup[key];
		// Fall back to 'format' flavor of name
		if(label[0] == 1){ label = undefined; } // kludge, in the absence of real aliasing support in dojo.cldr
	}
	props[1] = 'format';

	// return by copy so changes won't be made accidentally to the in-memory model
	return (label || lookup[props.join('-')]).concat(); /*Array*/
};

dojo.date.locale.isWeekend = function(/*Date?*/dateObject, /*String?*/locale){
	// summary:
	//	Determines if the date falls on a weekend, according to local custom.

	var weekend = dojo.cldr.supplemental.getWeekend(locale),
		day = (dateObject || new Date()).getDay();
	if(weekend.end < weekend.start){
		weekend.end += 7;
		if(day < weekend.start){ day += 7; }
	}
	return day >= weekend.start && day <= weekend.end; // Boolean
};

// These are used only by format and strftime.  Do they need to be public?  Which module should they go in?

dojo.date.locale._getDayOfYear = function(/*Date*/dateObject){
	// summary: gets the day of the year as represented by dateObject
	return dojo.date.difference(new Date(dateObject.getFullYear(), 0, 1, dateObject.getHours()), dateObject) + 1; // Number
};

dojo.date.locale._getWeekOfYear = function(/*Date*/dateObject, /*Number*/firstDayOfWeek){
	if(arguments.length == 1){ firstDayOfWeek = 0; } // Sunday

	var firstDayOfYear = new Date(dateObject.getFullYear(), 0, 1).getDay(),
		adj = (firstDayOfYear - firstDayOfWeek + 7) % 7,
		week = Math.floor((dojo.date.locale._getDayOfYear(dateObject) + adj - 1) / 7);

	// if year starts on the specified day, start counting weeks at 1
	if(firstDayOfYear == firstDayOfWeek){ week++; }

	return week; // Number
};

}

if(!dojo._hasResource['toura.models.Favorite']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.models.Favorite'] = true;
dojo.provide('toura.models.Favorite');



dojo.declare('toura.models.Favorite', [], {
  constructor : function(obj) {
    var added = new Date(),
        favorite = {
          id : obj.id,
          type : 'node',
          name : obj.name,
          added : added.getTime(),
          displayDate : dojo.date.locale.format(added, {
            datePattern : 'd MMMM yyy',
            timePattern : 'H:m'
          })
        };

    dojo.mixin(this, favorite);
  }
});

}

if(!dojo._hasResource['toura.app.user.Favorites']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.app.user.Favorites'] = true;
dojo.provide('toura.app.user.Favorites');






(function(){

var ds = toura.app.DeviceStorage;

dojo.declare('toura.app.user.Favorites', [], {
  constructor : function() {
    this._init();

    this.subscriptions = [
      dojo.subscribe('/favorite/add', this, '_addFavorite'),
      dojo.subscribe('/favorite/remove', this, '_removeFavorite'),
      dojo.subscribe('/favorites/clear', this, '_empty'),
      dojo.subscribe('/data/loaded', this, '_refresh')
    ];
  },

  hasFavorites : function() {
    return !!this.store.data.length;
  },

  _init : function() {
    var favs = ds.get('favorites');
    this.store = new dojo.store.Memory({
      data : favs || []
    });

    this._refresh();
  },

  _refresh : function() {
    dojo.forEach(this.store.data, function(item) {
      if (!toura.app.Data.getById(item.id)) {
        item.deleted = true;
        this.store.put(item);
      }
    }, this);

    this.onRefresh(this.store.data);
  },

  onRefresh : function(data) {
    // stub
  },

  load : function(sortProp, sortDescending) {
    if (!sortProp) {
      sortProp = 'added';
      sortDescending = true;
    }
    return this._sort(sortProp || 'added', sortDescending);
  },

  isFavorite : function(obj) {
    return !!obj && !!obj.id && !!this.store.get(obj.id);
  },

  _removeFavorite : function(obj) {
    console.log('toura.app.user.Favorites::_removeFavorite()', obj);
    // allow passing in object or object id
    var id = dojo.isString(obj) ? obj : obj.id;
    this.store.remove(id);
    this._save();
  },

  _empty : function() {
    this._save([]);
    this._init();
  },

  _save : function(whatToSave) {
    console.log('will try to save', this.store.data);
    ds.set('favorites', whatToSave || this.store.data);
  },

  _addFavorite : function(obj) {
    console.log('toura.app.user.Favorites::_addFavorite()', obj);
    if (this.isFavorite(obj)) { return; }

    this.store.add(new toura.models.Favorite(obj));
    this._save();
  },

  _sort : function(prop, descending) {
    if (!prop) {
      throw new Error('toura.app.user.Favorites::_sort requires a property for sorting');
    }

    var data = [].concat(this.store.data),
        sortedData = this._makeModels(
          data[0] && data[0][prop] ? data.sort(function(a, b) {
            a = a[prop];
            b = b[prop];

            if (a < b) { return descending ? 1 : -1; }
            if (a > b) { return descending ? -1 : 1; }

            return 0;
          }) : data
        );
    return sortedData;
  },

  _makeModels : function(data) {
    return dojo.map(data, function(item) {
      return dojo.mixin({
        model : toura.app.Data.getModel(item.id)
      }, item);
    }, this);
  },

  destroy : function() {
    dojo.forEach(this.subscriptions, dojo.unsubscribe);
  }
});

}());

dojo.subscribe('/app/ready', function() {
  toura.app.user.Favorites = new toura.app.user.Favorites();
});

}

if(!dojo._hasResource['toura.ui.BackgroundImage']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.ui.BackgroundImage'] = true;
dojo.provide('toura.ui.BackgroundImage');



dojo.declare('toura.ui.BackgroundImage', [toura._View], {
  // These attributes must be present on the dom element
  imageUrl : '',
  imageHeight : '',
  imageWidth : '',

  resizeMethod : 'contain',
  isLoaded : false,
  loadOnInit : false,

  postCreate : function() {
    this.inherited(arguments);

    if (this.loadOnInit) {
      this.loadImage();
    }
  },

  loadImage : function() {
    if (this.isLoaded) { return; }

    dojo.style(this.domNode, {
      'backgroundImage': 'url(' + this.imageUrl + ')',
      'backgroundRepeat': 'no-repeat'
    });

    if (!toura.app.Has.cssBackgroundContain()) {
      this._resizeImage();

      this.subscription = this.subscription || dojo.subscribe('/window/resize', this, function() {
        this._resizeImage();
      });
    }

    this.isLoaded = true;
  },

  unloadImage : function() {
    dojo.style(this.domNode, 'backgroundImage', null);
    this.isLoaded = false;
    if (this.subscription) {
      dojo.unsubscribe(this.subscription);
    }
  },

  _setBackgroundImageAttr : function(imageProps) {
    if (!imageProps) { return; }

    dojo.mixin(this, {
      imageUrl : imageProps.url,
      imageWidth : imageProps.width,
      imageHeight : imageProps.height
    });
  },

  _resizeImage : function() {
    var areaDimensions = this._getDimensions(),
      imgDimensions = {
        width: this.imageWidth,
        height: this.imageHeight
      },
      newDimensions = this._calculateDimensions(areaDimensions, imgDimensions);

    dojo.style(this.domNode, 'webkitBackgroundSize', newDimensions.width + 'px ' + newDimensions.height + 'px');
  },

  _calculateDimensions : function(areaDimensions, imageDimensions) {
    var imageRatio = imageDimensions.width/imageDimensions.height,
        areaRatio = areaDimensions.width/areaDimensions.height;

    if (this.resizeMethod === 'contain') {
      if (imageRatio < areaRatio) {
        return this._fitToHeight(areaDimensions, imageDimensions);
      } else {
        return this._fitToWidth(areaDimensions, imageDimensions);
      }
    } else { // resizeMethod === 'cover'
      if (imageRatio < areaRatio) {
        return this._fitToWidth(areaDimensions, imageDimensions);
      } else {
        return this._fitToHeight(areaDimensions, imageDimensions);
      }
    }
  },

  _fitToWidth : function(areaDimensions, imageDimensions) {
    return {
      width : areaDimensions.width,
      height :  Math.ceil(imageDimensions.height * (areaDimensions.width / imageDimensions.width))
    };
  },

  _fitToHeight : function(areaDimensions, imageDimensions) {
    return {
      width : Math.ceil(imageDimensions.width * (areaDimensions.height / imageDimensions.height)),
      height : areaDimensions.height
    };
  },

  _getDimensions : function() {
    this.dimensions = this.dimensions || {
      width: dojo.style(this.domNode, 'width'),
      height: dojo.style(this.domNode, 'height')
    };

    return this.dimensions;
  },

  destroy : function() {
    this.inherited(arguments);
    if (this.subscription) {
      dojo.unsubscribe(this.subscription);
    }
  }

});


}

if(!dojo._hasResource['toura.pageControllers._Page']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.pageControllers._Page'] = true;
dojo.provide('toura.pageControllers._Page');




dojo.declare('toura.pageControllers._Page', [ toura._View, toura.ui.BackgroundImage ], {
  'class' : 'page',
  widgetsInTemplate : true,

  init : function(pageState) {
    // stub for subclasses
    this.initialized = true;
  },

  postMixInProperties : function() {
    this.inherited(arguments);

    if (!this.device) {
      throw 'No device defined for page controller';
    }
  },

  postCreate : function() {
    this.setupNav();

    this._doPlacements();
    this._setup();
    this._applyBackgroundImage();

    this.inherited(arguments);
  },

  _doPlacements : function() {
    this.componentStartups = [];

    dojo.forEach(this.placements || [], function(arr) {
      if (arr.length < 3) {
        console.error('Not enough information for placement', arr);
        return;
      }

      var target = this[arr[2]],
          data = arr[1],
          C = toura.components[arr[0]],
          component,
          position = arr[3] || 'last';

      if (target && C) {
        component = this.adopt(C, data);
        this[arr[2]] = component.placeAt(target, position);
        if (component.startup) {
          this.componentStartups.push(dojo.hitch(component, 'startup'));
        }
      }
    }, this);
  },

  // stub for implementation
  _setup : function() {},

  _applyBackgroundImage : function() {
    var img = this._getBackgroundImage();
    if (!img) { return; }

    this.set('backgroundImage', img);
    this.set('resizeMethod', 'cover');
    this.loadImage();
  },

  _getBackgroundImage : function() {
    var appBgImg = toura.app.Config.get('app').backgroundImage,
        img;

    if (!appBgImg) {
      console.warn('toura.pageControllers._Page::_getBackgroundImage: No bg image specified for app.');
      return;
    }

    appBgImg = appBgImg[this.device.type];

    if (!appBgImg) {
      console.warn('toura.pageControllers._Page::_getBackgroundImage: No bg image specified for type.');
      return;
    }

    img = toura.app.Data.getModel(appBgImg, 'backgroundImage');

    return this.device.type === 'phone' ? img.gallery : img.original;
  },

  _getDimensions : function() {
    return toura.app.UI.viewport;
  },

  // stub. Should be implemented by subclasses
  setupNav : function() {},

  startup : function() {
    this.inherited(arguments);

    dojo.forEach(this.componentStartups, function(fn) {
      fn();
    });
  }

});

}

if(!dojo._hasResource['toura.app.user.Facebook.android']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.app.user.Facebook.android'] = true;
dojo.provide('toura.app.user.Facebook.android');

toura.app.user.Facebook.android = {
  init : function(appId) {
    this.appId = appId;
    // https://github.com/jos3000/phonegap-plugins/tree/master/Android/Facebook

    (function(){
      /**
       * Constructor
       */
      function Facebook() {}

      /**
       * Logs into facebook
       *
       * @param app_id        Your facebook app_id
       * @param callback      called when logged in
       */
      Facebook.prototype.authorize = function(app_id, callback) {
        PhoneGap.exec(callback, null, "FacebookAuth", "authorize", [app_id]);
      };

      Facebook.prototype.request = function(path, callback) {
        PhoneGap.exec(callback, null, "FacebookAuth", "request", [path]);
      };

      Facebook.prototype.getAccess = function(callback) {
        PhoneGap.exec(callback, null, "FacebookAuth", "getAccess", []);
      };

      /**
       * Load Plugin
       */
      PhoneGap.addConstructor(function() {
        PhoneGap.addPlugin("facebook", new Facebook());
        PluginManager.addService("FacebookAuth", "com.phonegap.plugins.facebook.FacebookAuth");
      });

    }());
  },

  _realGetAuth : function() {
    var dfd = new dojo.Deferred();

    window.plugins.facebook.authorize(this.appId, dojo.hitch(this, function(res) {
      if (res.token) {
        this.token = res.token;
        dfd.resolve(res.token);
      } else {
        window.plugins.facebook.getAccess(dojo.hitch(this, function(res) {
          if(!res.token) {
            dfd.reject();
            return;
          }

          this.token = res.token;
          dfd.resolve(res.token);
        }));
      }
    }));

    return dfd;
  }
};


}

if(!dojo._hasResource['toura.app.user.Facebook.ios']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.app.user.Facebook.ios'] = true;
dojo.provide('toura.app.user.Facebook.ios');



toura.app.user.Facebook.ios = {
  init : function(appId) {
    this.authUrl = 'https://graph.facebook.com/oauth/authorize?' +

      // parameters to pass when asking fb for auth
      dojo.objectToQuery({
        client_id : appId,
        redirect_uri : 'https://www.facebook.com/connect/login_success.html',
        response_type : 'token',
        scope : 'publish_stream,offline_access'
      });

    this.childBrowser = toura.app.Phonegap.browser.getBrowser();
  },

  _realGetAuth : function() {
    var dfd = new dojo.Deferred();

    this.childBrowser.showWebPage(this.authUrl);

    this.childBrowser.onLocationChange = dojo.hitch(this, function(loc) {
      var token = this._findToken(loc);
      if (!token) {
        dfd.reject();
        return;
      }

      this.childBrowser.close();
      dfd.resolve(token);
    });

    return dfd;
  },

  // listen for childbrowser to go to successful login url
  _findToken : function(loc) {
    if (loc.indexOf('login_success')) {
      var params = dojo.queryToObject(unescape(loc).split('#')[1]);
      return params.access_token;
    }

    return false;
  }
};

}

if(!dojo._hasResource['toura.app.user.Facebook.browser']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.app.user.Facebook.browser'] = true;
dojo.provide('toura.app.user.Facebook.browser');

toura.app.user.Facebook.browser = {
  init : function(appId) {
    if (!toura.features.socialInBrowser) { return; }

    window.fbAsyncInit = function() {
      FB.init({ appId : appId });
    };

    var e = document.createElement('script');
    e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
    e.async = true;
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(e, s);
  },

  _realGetAuth : function() {
    var dfd = new dojo.Deferred();

    if (FB) {
      FB.login(function(resp) {
        dfd.resolve(resp.session && resp.session.access_token);
      }, { perms : 'publish_stream' });
    } else {
      dfd.resolve();
    }

    return dfd;
  },

  _postMessage : function(msg) {
    var dfd = new dojo.Deferred();

    if (FB) {
      FB.api('/me/feed', 'post', { message : msg }, function(resp) {
        if (!resp || resp.error) {
          dfd.reject(resp && resp.error);
        } else {
          dfd.resolve();
        }
      });
    } else {
      dfd.resolve();
    }

    return dfd.promise;
  }
};

}

if(!dojo._hasResource['toura.app.user.Facebook.base']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.app.user.Facebook.base'] = true;
dojo.provide('toura.app.user.Facebook.base');








dojo.declare('toura.app.user.Facebook.base', [], {
  token : null,

  constructor : function() {
    var self = this;

    this.device = toura.app.Config.get('device');

    dojo.mixin(this, toura.app.user.Facebook[
      toura.app.Phonegap.present ? this.device.os : 'browser'
    ]);

    var key = toura.app.Config.get('app').facebookApiKey;

    if (key) {
      this.init(key);
    } else {
      this.disabled = true;
    }
  },

  isAuthenticated : function() {
    console.log('toura.app.user.Facebook::isAuthenticated()');
    return !!this.token;
  },

  postMessage : function(msg) {
    console.log('toura.app.user.Facebook::postMessage()');

    if (!msg) { return; }

    var dfd = new dojo.Deferred();

    dojo.when(this._getAuth(), dojo.hitch(this, function(t) {
      this.token = t;
      this._postMessage(msg, t).then(dfd.resolve, dfd.reject);
    }));

    return dfd.promise;
  },

  _postMessage : function(msg, token) {
    var url = 'https://graph.facebook.com/me/feed' + '?' + dojo.objectToQuery({
      message : msg,
      link : '',
      picture : ''
    }) + '&access_token=' + token;

    return dojo.xhrPost({ url : url });
  },

  _getAuth : function() {
    console.log('toura.app.user.Facebook::_getAuth()');
    return this.token || this._realGetAuth().promise;
  }
});

}

if(!dojo._hasResource['vendor.sha']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['vendor.sha'] = true;
dojo.provide('vendor.sha');
/* A JavaScript implementation of the SHA family of hashes, as defined in FIPS
 * PUB 180-2 as well as the corresponding HMAC implementation as defined in
 * FIPS PUB 198a
 *
 * Version 1.3 Copyright Brian Turek 2008-2010
 * Distributed under the BSD License
 * See http://jssha.sourceforge.net/ for more information
 *
 * Several functions taken from Paul Johnson
 */
(function(){var charSize=8,b64pad="",hexCase=0,Int_64=function(a,b){this.highOrder=a;this.lowOrder=b},str2binb=function(a){var b=[],mask=(1<<charSize)-1,length=a.length*charSize,i;for(i=0;i<length;i+=charSize){b[i>>5]|=(a.charCodeAt(i/charSize)&mask)<<(32-charSize-(i%32))}return b},hex2binb=function(a){var b=[],length=a.length,i,num;for(i=0;i<length;i+=2){num=parseInt(a.substr(i,2),16);if(!isNaN(num)){b[i>>3]|=num<<(24-(4*(i%8)))}else{return"INVALID HEX STRING"}}return b},binb2hex=function(a){var b=(hexCase)?"0123456789ABCDEF":"0123456789abcdef",str="",length=a.length*4,i,srcByte;for(i=0;i<length;i+=1){srcByte=a[i>>2]>>((3-(i%4))*8);str+=b.charAt((srcByte>>4)&0xF)+b.charAt(srcByte&0xF)}return str},binb2b64=function(a){var b="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"+"0123456789+/",str="",length=a.length*4,i,j,triplet;for(i=0;i<length;i+=3){triplet=(((a[i>>2]>>8*(3-i%4))&0xFF)<<16)|(((a[i+1>>2]>>8*(3-(i+1)%4))&0xFF)<<8)|((a[i+2>>2]>>8*(3-(i+2)%4))&0xFF);for(j=0;j<4;j+=1){if(i*8+j*6<=a.length*32){str+=b.charAt((triplet>>6*(3-j))&0x3F)}else{str+=b64pad}}}return str},rotl_32=function(x,n){return(x<<n)|(x>>>(32-n))},rotr_32=function(x,n){return(x>>>n)|(x<<(32-n))},rotr_64=function(x,n){if(n<=32){return new Int_64((x.highOrder>>>n)|(x.lowOrder<<(32-n)),(x.lowOrder>>>n)|(x.highOrder<<(32-n)))}else{return new Int_64((x.lowOrder>>>n)|(x.highOrder<<(32-n)),(x.highOrder>>>n)|(x.lowOrder<<(32-n)))}},shr_32=function(x,n){return x>>>n},shr_64=function(x,n){if(n<=32){return new Int_64(x.highOrder>>>n,x.lowOrder>>>n|(x.highOrder<<(32-n)))}else{return new Int_64(0,x.highOrder<<(32-n))}},parity_32=function(x,y,z){return x^y^z},ch_32=function(x,y,z){return(x&y)^(~x&z)},ch_64=function(x,y,z){return new Int_64((x.highOrder&y.highOrder)^(~x.highOrder&z.highOrder),(x.lowOrder&y.lowOrder)^(~x.lowOrder&z.lowOrder))},maj_32=function(x,y,z){return(x&y)^(x&z)^(y&z)},maj_64=function(x,y,z){return new Int_64((x.highOrder&y.highOrder)^(x.highOrder&z.highOrder)^(y.highOrder&z.highOrder),(x.lowOrder&y.lowOrder)^(x.lowOrder&z.lowOrder)^(y.lowOrder&z.lowOrder))},sigma0_32=function(x){return rotr_32(x,2)^rotr_32(x,13)^rotr_32(x,22)},sigma0_64=function(x){var a=rotr_64(x,28),rotr34=rotr_64(x,34),rotr39=rotr_64(x,39);return new Int_64(a.highOrder^rotr34.highOrder^rotr39.highOrder,a.lowOrder^rotr34.lowOrder^rotr39.lowOrder)},sigma1_32=function(x){return rotr_32(x,6)^rotr_32(x,11)^rotr_32(x,25)},sigma1_64=function(x){var a=rotr_64(x,14),rotr18=rotr_64(x,18),rotr41=rotr_64(x,41);return new Int_64(a.highOrder^rotr18.highOrder^rotr41.highOrder,a.lowOrder^rotr18.lowOrder^rotr41.lowOrder)},gamma0_32=function(x){return rotr_32(x,7)^rotr_32(x,18)^shr_32(x,3)},gamma0_64=function(x){var a=rotr_64(x,1),rotr8=rotr_64(x,8),shr7=shr_64(x,7);return new Int_64(a.highOrder^rotr8.highOrder^shr7.highOrder,a.lowOrder^rotr8.lowOrder^shr7.lowOrder)},gamma1_32=function(x){return rotr_32(x,17)^rotr_32(x,19)^shr_32(x,10)},gamma1_64=function(x){var a=rotr_64(x,19),rotr61=rotr_64(x,61),shr6=shr_64(x,6);return new Int_64(a.highOrder^rotr61.highOrder^shr6.highOrder,a.lowOrder^rotr61.lowOrder^shr6.lowOrder)},safeAdd_32_2=function(x,y){var a=(x&0xFFFF)+(y&0xFFFF),msw=(x>>>16)+(y>>>16)+(a>>>16);return((msw&0xFFFF)<<16)|(a&0xFFFF)},safeAdd_32_4=function(a,b,c,d){var e=(a&0xFFFF)+(b&0xFFFF)+(c&0xFFFF)+(d&0xFFFF),msw=(a>>>16)+(b>>>16)+(c>>>16)+(d>>>16)+(e>>>16);return((msw&0xFFFF)<<16)|(e&0xFFFF)},safeAdd_32_5=function(a,b,c,d,e){var f=(a&0xFFFF)+(b&0xFFFF)+(c&0xFFFF)+(d&0xFFFF)+(e&0xFFFF),msw=(a>>>16)+(b>>>16)+(c>>>16)+(d>>>16)+(e>>>16)+(f>>>16);return((msw&0xFFFF)<<16)|(f&0xFFFF)},safeAdd_64_2=function(x,y){var a,msw,lowOrder,highOrder;a=(x.lowOrder&0xFFFF)+(y.lowOrder&0xFFFF);msw=(x.lowOrder>>>16)+(y.lowOrder>>>16)+(a>>>16);lowOrder=((msw&0xFFFF)<<16)|(a&0xFFFF);a=(x.highOrder&0xFFFF)+(y.highOrder&0xFFFF)+(msw>>>16);msw=(x.highOrder>>>16)+(y.highOrder>>>16)+(a>>>16);highOrder=((msw&0xFFFF)<<16)|(a&0xFFFF);return new Int_64(highOrder,lowOrder)},safeAdd_64_4=function(a,b,c,d){var e,msw,lowOrder,highOrder;e=(a.lowOrder&0xFFFF)+(b.lowOrder&0xFFFF)+(c.lowOrder&0xFFFF)+(d.lowOrder&0xFFFF);msw=(a.lowOrder>>>16)+(b.lowOrder>>>16)+(c.lowOrder>>>16)+(d.lowOrder>>>16)+(e>>>16);lowOrder=((msw&0xFFFF)<<16)|(e&0xFFFF);e=(a.highOrder&0xFFFF)+(b.highOrder&0xFFFF)+(c.highOrder&0xFFFF)+(d.highOrder&0xFFFF)+(msw>>>16);msw=(a.highOrder>>>16)+(b.highOrder>>>16)+(c.highOrder>>>16)+(d.highOrder>>>16)+(e>>>16);highOrder=((msw&0xFFFF)<<16)|(e&0xFFFF);return new Int_64(highOrder,lowOrder)},safeAdd_64_5=function(a,b,c,d,e){var f,msw,lowOrder,highOrder;f=(a.lowOrder&0xFFFF)+(b.lowOrder&0xFFFF)+(c.lowOrder&0xFFFF)+(d.lowOrder&0xFFFF)+(e.lowOrder&0xFFFF);msw=(a.lowOrder>>>16)+(b.lowOrder>>>16)+(c.lowOrder>>>16)+(d.lowOrder>>>16)+(e.lowOrder>>>16)+(f>>>16);lowOrder=((msw&0xFFFF)<<16)|(f&0xFFFF);f=(a.highOrder&0xFFFF)+(b.highOrder&0xFFFF)+(c.highOrder&0xFFFF)+(d.highOrder&0xFFFF)+(e.highOrder&0xFFFF)+(msw>>>16);msw=(a.highOrder>>>16)+(b.highOrder>>>16)+(c.highOrder>>>16)+(d.highOrder>>>16)+(e.highOrder>>>16)+(f>>>16);highOrder=((msw&0xFFFF)<<16)|(f&0xFFFF);return new Int_64(highOrder,lowOrder)},coreSHA1=function(f,g){var W=[],a,b,c,d,e,T,ch=ch_32,parity=parity_32,maj=maj_32,rotl=rotl_32,safeAdd_2=safeAdd_32_2,i,t,safeAdd_5=safeAdd_32_5,appendedMessageLength,H=[0x67452301,0xefcdab89,0x98badcfe,0x10325476,0xc3d2e1f0],K=[0x5a827999,0x5a827999,0x5a827999,0x5a827999,0x5a827999,0x5a827999,0x5a827999,0x5a827999,0x5a827999,0x5a827999,0x5a827999,0x5a827999,0x5a827999,0x5a827999,0x5a827999,0x5a827999,0x5a827999,0x5a827999,0x5a827999,0x5a827999,0x6ed9eba1,0x6ed9eba1,0x6ed9eba1,0x6ed9eba1,0x6ed9eba1,0x6ed9eba1,0x6ed9eba1,0x6ed9eba1,0x6ed9eba1,0x6ed9eba1,0x6ed9eba1,0x6ed9eba1,0x6ed9eba1,0x6ed9eba1,0x6ed9eba1,0x6ed9eba1,0x6ed9eba1,0x6ed9eba1,0x6ed9eba1,0x6ed9eba1,0x8f1bbcdc,0x8f1bbcdc,0x8f1bbcdc,0x8f1bbcdc,0x8f1bbcdc,0x8f1bbcdc,0x8f1bbcdc,0x8f1bbcdc,0x8f1bbcdc,0x8f1bbcdc,0x8f1bbcdc,0x8f1bbcdc,0x8f1bbcdc,0x8f1bbcdc,0x8f1bbcdc,0x8f1bbcdc,0x8f1bbcdc,0x8f1bbcdc,0x8f1bbcdc,0x8f1bbcdc,0xca62c1d6,0xca62c1d6,0xca62c1d6,0xca62c1d6,0xca62c1d6,0xca62c1d6,0xca62c1d6,0xca62c1d6,0xca62c1d6,0xca62c1d6,0xca62c1d6,0xca62c1d6,0xca62c1d6,0xca62c1d6,0xca62c1d6,0xca62c1d6,0xca62c1d6,0xca62c1d6,0xca62c1d6,0xca62c1d6];f[g>>5]|=0x80<<(24-(g%32));f[(((g+65)>>9)<<4)+15]=g;appendedMessageLength=f.length;for(i=0;i<appendedMessageLength;i+=16){a=H[0];b=H[1];c=H[2];d=H[3];e=H[4];for(t=0;t<80;t+=1){if(t<16){W[t]=f[t+i]}else{W[t]=rotl(W[t-3]^W[t-8]^W[t-14]^W[t-16],1)}if(t<20){T=safeAdd_5(rotl(a,5),ch(b,c,d),e,K[t],W[t])}else if(t<40){T=safeAdd_5(rotl(a,5),parity(b,c,d),e,K[t],W[t])}else if(t<60){T=safeAdd_5(rotl(a,5),maj(b,c,d),e,K[t],W[t])}else{T=safeAdd_5(rotl(a,5),parity(b,c,d),e,K[t],W[t])}e=d;d=c;c=rotl(b,30);b=a;a=T}H[0]=safeAdd_2(a,H[0]);H[1]=safeAdd_2(b,H[1]);H[2]=safeAdd_2(c,H[2]);H[3]=safeAdd_2(d,H[3]);H[4]=safeAdd_2(e,H[4])}return H},coreSHA2=function(j,k,l){var a,b,c,d,e,f,g,h,T1,T2,H,numRounds,lengthPosition,i,t,binaryStringInc,binaryStringMult,safeAdd_2,safeAdd_4,safeAdd_5,gamma0,gamma1,sigma0,sigma1,ch,maj,Int,K,W=[],appendedMessageLength;if(l==="SHA-224"||l==="SHA-256"){numRounds=64;lengthPosition=(((k+65)>>9)<<4)+15;binaryStringInc=16;binaryStringMult=1;Int=Number;safeAdd_2=safeAdd_32_2;safeAdd_4=safeAdd_32_4;safeAdd_5=safeAdd_32_5;gamma0=gamma0_32;gamma1=gamma1_32;sigma0=sigma0_32;sigma1=sigma1_32;maj=maj_32;ch=ch_32;K=[0x428A2F98,0x71374491,0xB5C0FBCF,0xE9B5DBA5,0x3956C25B,0x59F111F1,0x923F82A4,0xAB1C5ED5,0xD807AA98,0x12835B01,0x243185BE,0x550C7DC3,0x72BE5D74,0x80DEB1FE,0x9BDC06A7,0xC19BF174,0xE49B69C1,0xEFBE4786,0x0FC19DC6,0x240CA1CC,0x2DE92C6F,0x4A7484AA,0x5CB0A9DC,0x76F988DA,0x983E5152,0xA831C66D,0xB00327C8,0xBF597FC7,0xC6E00BF3,0xD5A79147,0x06CA6351,0x14292967,0x27B70A85,0x2E1B2138,0x4D2C6DFC,0x53380D13,0x650A7354,0x766A0ABB,0x81C2C92E,0x92722C85,0xA2BFE8A1,0xA81A664B,0xC24B8B70,0xC76C51A3,0xD192E819,0xD6990624,0xF40E3585,0x106AA070,0x19A4C116,0x1E376C08,0x2748774C,0x34B0BCB5,0x391C0CB3,0x4ED8AA4A,0x5B9CCA4F,0x682E6FF3,0x748F82EE,0x78A5636F,0x84C87814,0x8CC70208,0x90BEFFFA,0xA4506CEB,0xBEF9A3F7,0xC67178F2];if(l==="SHA-224"){H=[0xc1059ed8,0x367cd507,0x3070dd17,0xf70e5939,0xffc00b31,0x68581511,0x64f98fa7,0xbefa4fa4]}else{H=[0x6A09E667,0xBB67AE85,0x3C6EF372,0xA54FF53A,0x510E527F,0x9B05688C,0x1F83D9AB,0x5BE0CD19]}}else if(l==="SHA-384"||l==="SHA-512"){numRounds=80;lengthPosition=(((k+128)>>10)<<5)+31;binaryStringInc=32;binaryStringMult=2;Int=Int_64;safeAdd_2=safeAdd_64_2;safeAdd_4=safeAdd_64_4;safeAdd_5=safeAdd_64_5;gamma0=gamma0_64;gamma1=gamma1_64;sigma0=sigma0_64;sigma1=sigma1_64;maj=maj_64;ch=ch_64;K=[new Int(0x428a2f98,0xd728ae22),new Int(0x71374491,0x23ef65cd),new Int(0xb5c0fbcf,0xec4d3b2f),new Int(0xe9b5dba5,0x8189dbbc),new Int(0x3956c25b,0xf348b538),new Int(0x59f111f1,0xb605d019),new Int(0x923f82a4,0xaf194f9b),new Int(0xab1c5ed5,0xda6d8118),new Int(0xd807aa98,0xa3030242),new Int(0x12835b01,0x45706fbe),new Int(0x243185be,0x4ee4b28c),new Int(0x550c7dc3,0xd5ffb4e2),new Int(0x72be5d74,0xf27b896f),new Int(0x80deb1fe,0x3b1696b1),new Int(0x9bdc06a7,0x25c71235),new Int(0xc19bf174,0xcf692694),new Int(0xe49b69c1,0x9ef14ad2),new Int(0xefbe4786,0x384f25e3),new Int(0x0fc19dc6,0x8b8cd5b5),new Int(0x240ca1cc,0x77ac9c65),new Int(0x2de92c6f,0x592b0275),new Int(0x4a7484aa,0x6ea6e483),new Int(0x5cb0a9dc,0xbd41fbd4),new Int(0x76f988da,0x831153b5),new Int(0x983e5152,0xee66dfab),new Int(0xa831c66d,0x2db43210),new Int(0xb00327c8,0x98fb213f),new Int(0xbf597fc7,0xbeef0ee4),new Int(0xc6e00bf3,0x3da88fc2),new Int(0xd5a79147,0x930aa725),new Int(0x06ca6351,0xe003826f),new Int(0x14292967,0x0a0e6e70),new Int(0x27b70a85,0x46d22ffc),new Int(0x2e1b2138,0x5c26c926),new Int(0x4d2c6dfc,0x5ac42aed),new Int(0x53380d13,0x9d95b3df),new Int(0x650a7354,0x8baf63de),new Int(0x766a0abb,0x3c77b2a8),new Int(0x81c2c92e,0x47edaee6),new Int(0x92722c85,0x1482353b),new Int(0xa2bfe8a1,0x4cf10364),new Int(0xa81a664b,0xbc423001),new Int(0xc24b8b70,0xd0f89791),new Int(0xc76c51a3,0x0654be30),new Int(0xd192e819,0xd6ef5218),new Int(0xd6990624,0x5565a910),new Int(0xf40e3585,0x5771202a),new Int(0x106aa070,0x32bbd1b8),new Int(0x19a4c116,0xb8d2d0c8),new Int(0x1e376c08,0x5141ab53),new Int(0x2748774c,0xdf8eeb99),new Int(0x34b0bcb5,0xe19b48a8),new Int(0x391c0cb3,0xc5c95a63),new Int(0x4ed8aa4a,0xe3418acb),new Int(0x5b9cca4f,0x7763e373),new Int(0x682e6ff3,0xd6b2b8a3),new Int(0x748f82ee,0x5defb2fc),new Int(0x78a5636f,0x43172f60),new Int(0x84c87814,0xa1f0ab72),new Int(0x8cc70208,0x1a6439ec),new Int(0x90befffa,0x23631e28),new Int(0xa4506ceb,0xde82bde9),new Int(0xbef9a3f7,0xb2c67915),new Int(0xc67178f2,0xe372532b),new Int(0xca273ece,0xea26619c),new Int(0xd186b8c7,0x21c0c207),new Int(0xeada7dd6,0xcde0eb1e),new Int(0xf57d4f7f,0xee6ed178),new Int(0x06f067aa,0x72176fba),new Int(0x0a637dc5,0xa2c898a6),new Int(0x113f9804,0xbef90dae),new Int(0x1b710b35,0x131c471b),new Int(0x28db77f5,0x23047d84),new Int(0x32caab7b,0x40c72493),new Int(0x3c9ebe0a,0x15c9bebc),new Int(0x431d67c4,0x9c100d4c),new Int(0x4cc5d4be,0xcb3e42b6),new Int(0x597f299c,0xfc657e2a),new Int(0x5fcb6fab,0x3ad6faec),new Int(0x6c44198c,0x4a475817)];if(l==="SHA-384"){H=[new Int(0xcbbb9d5d,0xc1059ed8),new Int(0x0629a292a,0x367cd507),new Int(0x9159015a,0x3070dd17),new Int(0x0152fecd8,0xf70e5939),new Int(0x67332667,0xffc00b31),new Int(0x98eb44a87,0x68581511),new Int(0xdb0c2e0d,0x64f98fa7),new Int(0x047b5481d,0xbefa4fa4)]}else{H=[new Int(0x6a09e667,0xf3bcc908),new Int(0xbb67ae85,0x84caa73b),new Int(0x3c6ef372,0xfe94f82b),new Int(0xa54ff53a,0x5f1d36f1),new Int(0x510e527f,0xade682d1),new Int(0x9b05688c,0x2b3e6c1f),new Int(0x1f83d9ab,0xfb41bd6b),new Int(0x5be0cd19,0x137e2179)]}}j[k>>5]|=0x80<<(24-k%32);j[lengthPosition]=k;appendedMessageLength=j.length;for(i=0;i<appendedMessageLength;i+=binaryStringInc){a=H[0];b=H[1];c=H[2];d=H[3];e=H[4];f=H[5];g=H[6];h=H[7];for(t=0;t<numRounds;t+=1){if(t<16){W[t]=new Int(j[t*binaryStringMult+i],j[t*binaryStringMult+i+1])}else{W[t]=safeAdd_4(gamma1(W[t-2]),W[t-7],gamma0(W[t-15]),W[t-16])}T1=safeAdd_5(h,sigma1(e),ch(e,f,g),K[t],W[t]);T2=safeAdd_2(sigma0(a),maj(a,b,c));h=g;g=f;f=e;e=safeAdd_2(d,T1);d=c;c=b;b=a;a=safeAdd_2(T1,T2)}H[0]=safeAdd_2(a,H[0]);H[1]=safeAdd_2(b,H[1]);H[2]=safeAdd_2(c,H[2]);H[3]=safeAdd_2(d,H[3]);H[4]=safeAdd_2(e,H[4]);H[5]=safeAdd_2(f,H[5]);H[6]=safeAdd_2(g,H[6]);H[7]=safeAdd_2(h,H[7])}switch(l){case"SHA-224":return[H[0],H[1],H[2],H[3],H[4],H[5],H[6]];case"SHA-256":return H;case"SHA-384":return[H[0].highOrder,H[0].lowOrder,H[1].highOrder,H[1].lowOrder,H[2].highOrder,H[2].lowOrder,H[3].highOrder,H[3].lowOrder,H[4].highOrder,H[4].lowOrder,H[5].highOrder,H[5].lowOrder];case"SHA-512":return[H[0].highOrder,H[0].lowOrder,H[1].highOrder,H[1].lowOrder,H[2].highOrder,H[2].lowOrder,H[3].highOrder,H[3].lowOrder,H[4].highOrder,H[4].lowOrder,H[5].highOrder,H[5].lowOrder,H[6].highOrder,H[6].lowOrder,H[7].highOrder,H[7].lowOrder];default:return[]}},jsSHA=function(a,b){this.sha1=null;this.sha224=null;this.sha256=null;this.sha384=null;this.sha512=null;this.strBinLen=null;this.strToHash=null;if("HEX"===b){if(0!==(a.length%2)){return"TEXT MUST BE IN BYTE INCREMENTS"}this.strBinLen=a.length*4;this.strToHash=hex2binb(a)}else if(("ASCII"===b)||('undefined'===typeof(b))){this.strBinLen=a.length*charSize;this.strToHash=str2binb(a)}else{return"UNKNOWN TEXT INPUT TYPE"}};jsSHA.prototype={getHash:function(a,b){var c=null,message=this.strToHash.slice();switch(b){case"HEX":c=binb2hex;break;case"B64":c=binb2b64;break;default:return"FORMAT NOT RECOGNIZED"}switch(a){case"SHA-1":if(null===this.sha1){this.sha1=coreSHA1(message,this.strBinLen)}return c(this.sha1);case"SHA-224":if(null===this.sha224){this.sha224=coreSHA2(message,this.strBinLen,a)}return c(this.sha224);case"SHA-256":if(null===this.sha256){this.sha256=coreSHA2(message,this.strBinLen,a)}return c(this.sha256);case"SHA-384":if(null===this.sha384){this.sha384=coreSHA2(message,this.strBinLen,a)}return c(this.sha384);case"SHA-512":if(null===this.sha512){this.sha512=coreSHA2(message,this.strBinLen,a)}return c(this.sha512);default:return"HASH NOT RECOGNIZED"}},getHMAC:function(a,b,c,d){var e,keyToUse,blockByteSize,blockBitSize,i,retVal,lastArrayIndex,keyBinLen,hashBitSize,keyWithIPad=[],keyWithOPad=[];switch(d){case"HEX":e=binb2hex;break;case"B64":e=binb2b64;break;default:return"FORMAT NOT RECOGNIZED"}switch(c){case"SHA-1":blockByteSize=64;hashBitSize=160;break;case"SHA-224":blockByteSize=64;hashBitSize=224;break;case"SHA-256":blockByteSize=64;hashBitSize=256;break;case"SHA-384":blockByteSize=128;hashBitSize=384;break;case"SHA-512":blockByteSize=128;hashBitSize=512;break;default:return"HASH NOT RECOGNIZED"}if("HEX"===b){if(0!==(a.length%2)){return"KEY MUST BE IN BYTE INCREMENTS"}keyToUse=hex2binb(a);keyBinLen=a.length*4}else if("ASCII"===b){keyToUse=str2binb(a);keyBinLen=a.length*charSize}else{return"UNKNOWN KEY INPUT TYPE"}blockBitSize=blockByteSize*8;lastArrayIndex=(blockByteSize/4)-1;if(blockByteSize<(keyBinLen/8)){if("SHA-1"===c){keyToUse=coreSHA1(keyToUse,keyBinLen)}else{keyToUse=coreSHA2(keyToUse,keyBinLen,c)}keyToUse[lastArrayIndex]&=0xFFFFFF00}else if(blockByteSize>(keyBinLen/8)){keyToUse[lastArrayIndex]&=0xFFFFFF00}for(i=0;i<=lastArrayIndex;i+=1){keyWithIPad[i]=keyToUse[i]^0x36363636;keyWithOPad[i]=keyToUse[i]^0x5C5C5C5C}if("SHA-1"===c){retVal=coreSHA1(keyWithIPad.concat(this.strToHash),blockBitSize+this.strBinLen);retVal=coreSHA1(keyWithOPad.concat(retVal),blockBitSize+hashBitSize)}else{retVal=coreSHA2(keyWithIPad.concat(this.strToHash),blockBitSize+this.strBinLen,c);retVal=coreSHA2(keyWithOPad.concat(retVal),blockBitSize+hashBitSize,c)}return(e(retVal))}};window.jsSHA=jsSHA}());

}

if(!dojo._hasResource['toura.app.user.Twitter']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.app.user.Twitter'] = true;
/* jslint bitwise:false */
dojo.provide('toura.app.user.Twitter');




(function(){

var user;

dojo.declare('toura.app.user.Twitter', [], {

  constructor: function() {
    var config = {
      customerKey : toura.app.Config.get('app').twitterCustomerKey,
      customerSecret : toura.app.Config.get('app').twitterCustomerSecret
    };

    if (config.customerKey && config.customerSecret) {
      this.twitterConfig = config;
      if (toura.app.Phonegap.present) {
        this.childBrowser = toura.app.Phonegap.browser.getBrowser();
      }
    } else {
      this.disabled = true;
    }
  },

  setUserInfo : function(u) {
    console.log('toura.app.user.Twitter::setUserInfo()');
    if (u.username && u.password) {
      user = u;
      return true;
    }

    return false;
  },

  isAuthenticated : function() {
    console.log('toura.app.user.Twitter::isAuthenticated()');

    if (toura.app.Phonegap.present) {
      return !!(this.oauth_token && this.oauth_token_secret);
    }

    // always return false for desktop for now;
    // this will make it easier to dev the auth fields
    // in a browser
    return false;
  },

  postMessage : function(msg) {
    console.log('toura.app.user.Twitter::postMessage()');

    if (!msg) { return; }

    if (toura.silenceSharing) {
      console.log('sharing silenced; twitter message would have been', msg);
    }

    var dfd = new dojo.Deferred();

    dojo.when(this._getAuth(), dojo.hitch(this, function(t) {
      this._postMessage(msg, t).then(dfd.resolve, dfd.reject);
    }));

    return dfd.promise;
  },

  _postMessage : function(msg, t) {
    // TODO: twitter won't let you send the same status update twice in succession
    // may want to do some error checking for this
    console.log('toura.app.user.Twitter::_postMessage()');

    var postRequest = new toura.app.user._TwitterAPI({
          customerKey : this.twitterConfig.customerKey,
          consumerSecret : this.twitterConfig.customerSecret
        }),
        auth = this._getAuthTokenFields(),
        dfd = new dojo.Deferred();

    postRequest.setAuth(auth);

    if (!postRequest.setupUpdate(msg)) {
      dfd.reject();
    } else {
      dojo.xhrPost({
        url : postRequest.getPostTarget(),
        headers : postRequest.getAuthHeader(),
        load : dfd.resolve
      });
    }

    return dfd.promise;
  },

  _getAuthTokenFields : function() {
    console.log('toura.app.user.Twitter::_getAuthTokenFields()');
    // TODO: this only has meaning on device
    return {
      oauth_token : this.oauth_token,
      oauth_token_secret : this.oauth_token_secret
    };
  },

  _getAuth :  function() {
    console.log('toura.app.user.Twitter::_getAuth()');

    var dfd = new dojo.Deferred(),
        authRequest;

    // outside phonegap, we can assume auth will happen automatically
    if (!toura.app.Phonegap.present) {
      dfd.resolve(true);
      return dfd.promise;
    }

    if (this.isAuthenticated()) {
      return this._getAuthTokenFields();
    }

    if (!user) {
      console.error('user not found');
      return;
    }

    authRequest = new toura.app.user._TwitterAPI({
      customerKey : this.twitterConfig.customerKey,
      consumerSecret : this.twitterConfig.customerSecret
    });

    authRequest.setupAuthPost(user.username, user.password);

    dojo.xhrPost({
      url : authRequest.getPostTarget(),
      headers : authRequest.getAuthHeader()
    })
    .then(dojo.hitch(this, function(params) {
      var oauthFields = dojo.queryToObject(params);

      dojo.mixin(this, oauthFields);

      dfd.resolve({
        oauth_token : this.oauth_token,
        oauth_token_secret : this.oauth_token_secret
      });

    }), dfd.reject);

    return dfd.promise;
  }
});

}());

dojo.declare('toura.app.user._TwitterAPI', null, {

  // this is all based on https://gist.github.com/447636 by @alunny

  sigBaseTemplate : "POST&" +
    "{{ path }}&" +
    "oauth_consumer_key%3D" + "{{ customer_key }}" + "%26" +
    "oauth_nonce%3D" + "{{ nonce }}" + "%26" +
    "oauth_signature_method%3DHMAC-SHA1%26oauth_timestamp%3D" + "{{ time }}" + "%26" +
    "{{ optional_token }}" +
    "oauth_version%3D1.0%26" +
    "{{ post_body }}",

  authTemplate : "OAuth " +
    "oauth_nonce=\"" + "{{ nonce }}" + "\", " +
    "oauth_signature_method=\"HMAC-SHA1\", " +
    "oauth_timestamp=\"" + "{{ time }}" + "\", " +
    "oauth_consumer_key=\"" + "{{ customer_key }}" + "\", " +
    "{{ optional_token }}" +
    "oauth_signature=\"" + "{{ signature }}" + "\", " +
    "oauth_version=\"1.0\"",

  constructor : function(config) {
    this.config = config;
    this.consumerSecret = this.config.consumerSecret + "&";

    this.nonce = this._createNonce();
    this.timestamp = (new Date((new Date()).toUTCString())).getTime() / 1000;
  },

  _encode : function (str) {
    return encodeURIComponent(str)
              .replace(/!/g, '%21').replace(/'/g, '%27')
              .replace(/\(/g, '%28').replace(/\)/g, '%29')
              .replace(/\*/g, '%2A');
  },

  _createNonce : function() {
    var nonce = [],
        length = 5; // arbitrary - looks like a good length

    while (length--) {
      nonce.push((((1+Math.random())*0x10000)).toString(16).substring(1));
    }

    return nonce.join("");
  },

  getPostTarget : function() {
    return [ this.path, this.postBody ].join("?");
  },

  setSignature : function(secret) {
    var hmacGen = new jsSHA(this.signatureBaseString, "ASCII");
    this.signature = hmacGen.getHMAC(secret, "ASCII", "SHA-1", "B64") + "%3D";
  },

  setupBaseString : function(token) {
    var tokenReplacement = token ? "oauth_token%3D" + token + "%26" : "";

    this.signatureBaseString = this.sigBaseTemplate
            .split("{{ path }}").join(encodeURIComponent(this.path))
            .split("{{ customer_key }}").join(this.config.customerKey)
            .split("{{ optional_token }}").join(tokenReplacement)
            .split("{{ nonce }}").join(this.nonce)
            .split("{{ time }}").join(this.timestamp)
            .split("{{ post_body }}").join(encodeURIComponent(this.postBody));
  },

  setupAuthHeader : function(token) {
    var tokenReplacement = token ? 'oauth_token="' + token + '", ' : '';

    this.authHeader = this.authTemplate
            .split("{{ nonce }}").join(this.nonce)
            .split("{{ customer_key }}").join(this.config.customerKey)
            .split("{{ optional_token }}").join(tokenReplacement)
            .split("{{ time }}").join(this.timestamp)
            .split("{{ signature }}").join(this.signature);

  },

  getAuthHeader : function() {
    return { 'Authorization' : this.authHeader };
  },

  setupAuthPost : function(user, pw) {
    this.path = "https://api.twitter.com/oauth/access_token";
    this.postBody = "x_auth_mode=client_auth&" +
                    "x_auth_password=" + this._encode(pw) + "&" +
                    "x_auth_username=" + this._encode(user);

    this.setupBaseString();
    this.setSignature(this.consumerSecret);
    this.setupAuthHeader();

    return true;
  },

  setupUpdate : function(status) {
    this.path = "http://api.twitter.com/1/statuses/update.json";
    this.postBody = "status=" + this._encode(status);

    if (!this.token || !this.tokenSecret) {
      return false;
    }

    this.setupBaseString(this.token);
    this.setSignature(this.consumerSecret + this.tokenSecret);
    this.setupAuthHeader(this.token);

    return true;
  },

  setAuth : function(auth) {
    this.token = auth.oauth_token;
    this.tokenSecret = auth.oauth_token_secret;
  }
});

(function(){
  if (window.device && window.device.phonegap) { return; }
  if (!toura.features.socialInBrowser) { return; }

  var key = toura.app.Config.get('app').twitter_anywhere_key;

  if (!key) { return; }

  // this lets us use the Twitter @Anywhere API on desktop
  var s = document.createElement('script');

  // twitter anywhere url & params
  var authUrl = '//platform.twitter.com/anywhere.js?' +

    dojo.objectToQuery({
      id : key,
      v : 1
    });

  // embed script
  s.src = document.location.protocol + authUrl;
  s.async = true;

  document.body.appendChild(s);
}());

}

if(!dojo._hasResource['toura.app.Sharing']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.app.Sharing'] = true;
dojo.provide('toura.app.Sharing');







toura.app.Sharing = {
  lastPost : {},

  getMessage : function(svc, obj) {
    console.log('toura.app.Sharing::getMessage', arguments);

    var app = toura.app.Config.get('app'),
        defaultTmpl = app.sharingText || toura.sharingText || "${sharingURL}",
        consumed = 0,
        ret;

    // allow for case where no object is passed
    obj = obj || { "name" : app.name };

    // use default sharing url if one isn't present on the object
    console.log('app sharing URL is ' + app.sharingUrl);
    obj.sharingURL = obj.sharingURL || app.sharingUrl || toura.sharingURL;

    if (!obj.sharingURL) {
      console.error('No sharing URL defined for object or app. This will end badly.');
    }

    if (!defaultTmpl) {
      console.error('No sharing text template defined. This will end badly.');
    }

    if (svc === 'twitter') {
      // account for the sharing url
      consumed += obj.sharingURL.length;

      // truncate the part that comes before the sharing URL
      ret = dojo.string.substitute(defaultTmpl, obj).split(obj.sharingURL);

      // acount for anything after the sharing URL
      if (ret[1]) { consumed += ret[1].length; }

      // reassemble the message
      ret = [
        dojo.trim(ret[0].substr(0, 140 - consumed)),
        obj.sharingURL,
        ret[1] || ''
      ].join(' ');
    } else {
      // yay services that don't require short messages
      ret = dojo.string.substitute(defaultTmpl, obj) + ' ' + obj.sharingURL;
    }

    return ret;
  },

  share : function(service, params, node) {
    console.log('toura.app.Sharing::share()');

    var dfd = new dojo.Deferred(),
        svc = service.name,
        doit = true,
        before = service.beforePost ? !!service.beforePost(params) : true;

    if (before !== true) {
      console.log('beforePost was not true');
      dfd.reject(service.beforePostError);
      doit = false;
    }

    if (this.lastPost[svc] && (this.lastPost[svc] === params.msg)) {
      console.log('the message is a duplicate');
      dfd.reject('The message is a duplicate.');
      doit = false;
    }

    if (doit) {
      console.log('doing it');
      this.lastPost[svc] = params.msg;

      service.api.postMessage(params.msg)
        .then(dojo.hitch(this, function() {
          dojo.publish('/share', [
            [ svc, node.id, params.msg ].join(': ')
          ]);
          dfd.resolve();
        }));
    }

    return dfd.promise;
  },

  getServices : function() {
    var i18n = dojo.i18n.getLocalization('toura', 'toura', toura.app.Config.get('locale')),
        services = [];

    if (!toura.app.user.Twitter.disabled) {
      services.push({
        name : 'twitter',
        api : toura.app.user.Twitter,
        requireAuth : !toura.app.user.Twitter.isAuthenticated(),
        maxLength : 140,
        beforePost : function(params) {
          return !!toura.app.user.Twitter.setUserInfo(params);
        },
        beforePostError : i18n.TWITTER_AUTHENTICATION_ERROR
      });
    }

    if (!toura.app.user.Facebook.disabled) {
      services.push({
        name : 'facebook',
        api : toura.app.user.Facebook
      });
    }

    return services;
  }
};

dojo.subscribe('/app/ready', function() {
  toura.app.user.Facebook = new toura.app.user.Facebook.base();
  toura.app.user.Twitter = new toura.app.user.Twitter();
});

}

if(!dojo._hasResource['toura.components.buttons._Button']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components.buttons._Button'] = true;
dojo.provide('toura.components.buttons._Button');





dojo.declare('toura.components.buttons._Button', [ toura.components._Component ], {
  templateString : dojo.cache("toura.components.buttons", "_Button/_Button.haml", "%a.button{ title: i18n_text }\n"),

  url : '#',
  i18n_text : '',
  preventWhenAnimating : false,

  setupConnections : function() {
    this._setupTouch(this.domNode, '_handleClick');
  },

  _handleClick : function(e) {
    if (e) {
      e.preventDefault();
    }

    if (this.preventWhenAnimating && toura.animating) {
      return;
    }

    this.onClick(e);
  },

  onClick : function(e) {
    if (this.url && this.url !== '#') {
      toura.app.Router.go(this.url);
    }
  }
});


}

if(!dojo._hasResource['toura.components.buttons.HomeButton']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components.buttons.HomeButton'] = true;
dojo.provide('toura.components.buttons.HomeButton');



dojo.declare('toura.components.buttons.HomeButton', [ toura.components.buttons._Button ], {
  preventWhenAnimating : true,

  onClick : function(e) {
    e.preventDefault();
    toura.app.Router.home();
  }
});

}

if(!dojo._hasResource['toura.components.buttons.SearchButton']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components.buttons.SearchButton'] = true;
dojo.provide('toura.components.buttons.SearchButton');



dojo.declare('toura.components.buttons.SearchButton', [ toura.components.buttons._Button ], {
  "class" : 'search',
  url : toura.app.URL.search(),
  preventWhenAnimating : true
});


}

if(!dojo._hasResource['toura.components.buttons.FontSize']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components.buttons.FontSize'] = true;
dojo.provide('toura.components.buttons.FontSize');



dojo.declare('toura.components.buttons.FontSize', [ toura.components.buttons._Button ], {
  sizes : [
    'small',
    'medium',
    'large'
  ],

  "class" : 'font-size',

  defaultSize : 'medium',
  sizePrefix : 'font-size-',

  onClick : function(e) {
    e.preventDefault();

    var b = dojo.body(),
        currentSize = toura.app.UI.fontSize || (this.sizePrefix + this.defaultSize),
        currentSizeIndex = dojo.indexOf(this.sizes, currentSize.replace(this.sizePrefix, '')),
        newSize = this.sizePrefix + (this.sizes[ currentSizeIndex + 1 ] || this.sizes[0]);

    toura.app.UI.set('fontSize', newSize);
  },

  initializeStrings : function() {
    this.i18n_font = this.getString('FONT');
  }

});

}

if(!dojo._hasResource['toura.components.SocialMessage']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components.SocialMessage'] = true;
dojo.provide('toura.components.SocialMessage');



dojo.declare('toura.components.SocialMessage', [ toura.components._Component ], {
  templateString : dojo.cache("toura.components", "SocialMessage/SocialMessage.haml", "%form.component.social-message\n  :if requireAuth\n    %fieldset.auth\n      %input{ type : 'text', name : 'username', placeholder : 'username', dojoAttachPoint : 'username', autocapitalize : 'off', autocorrect : 'off' }\n      %input{ type : 'password', name : 'password', placeholder : 'password', dojoAttachPoint : 'password' }\n\n\n  %textarea{ dojoAttachPoint : 'message', name : 'msg', autocorrect : 'off' }= messageText\n\n  :if maxLength\n    .count{ dojoAttachPoint : 'count' }= availLength\n\n  %fieldset.buttons\n    %input.highlight{ type : 'submit', dojoAttachPoint : 'submitBtn', value : i18n_submitLabel }\n    %input{ type : 'reset', dojoAttachPoint : 'cancelBtn', value : i18n_cancelLabel }\n"),

  requireAuth : false,
  maxLength : false,

  errorClass : 'error',
  warningClass : 'warning',

  prepareData : function() {
    this.messageText = this.messageText || '';
    this.availLength = this.maxLength - this.messageText.length;
  },

  setupConnections : function() {
    this.connect(this.submitBtn, 'click', '_onSubmit');
    this.connect(this.cancelBtn, 'click', '_onCancel');

    dojo.forEach(['keyup', 'change'], dojo.hitch(this, function(e) {
      this.connect(this.message, e, '_resize');
    }));

    if (this.maxLength) {
      this.connect(this.message, 'keyup', '_updateCharCount');
    }
  },

  _updateCharCount : function(e) {
    var len = this.message.value.length,
        warn = this.maxLength - len < 11,
        error = this.maxLength - len <= 0;

    this.count.innerHTML = this.maxLength - len;

    dojo[error ? 'addClass' : 'removeClass'](this.count, this.errorClass);
    dojo[warn && !error ? 'addClass' : 'removeClass'](this.count, this.warningClass);
  },

  _onSubmit : function(e) {
    e.preventDefault();

    var params = {
          msg : this.message.value,
          username : this.username && this.username.value,
          password : this.password && this.password.value
        },
        errors;

    params.msg = dojo.trim(params.msg);

    errors = this._validate(params);

    if (!errors.length) {
      this.onSubmit(params);
      return;
    }

    this._handleErrors(errors);
  },

  _validate : function(params) {
    var errors = [];

    // TODO: i18n
    if (this.requireAuth) {
      if (!params.username) {
        errors.push(this.i18n_usernameRequired);
      }

      if (!params.password) {
        errors.push(this.i18n_passwordRequired);
      }

      if (errors.length) {
        errors.push(this.i18n_privacy);
      }
    }

    if (!params.msg) {
      errors.push(this.i18n_messageRequired);
    }

    if (this.maxLength && params.msg.length > this.maxLength) {
      errors.push(this.i18n_messageLength);
    }

    return errors;
  },

  _resize : function() {
    var msg = this.message;
    msg.style.height = 'auto';
    msg.style.height = msg.scrollHeight + 'px';
  },

  _handleErrors : function(errors) {
    alert(errors.join('\n'));
  },

  onSubmit : function(params) {
    console.log(params);
  },

  _onCancel : function() {
    this.onCancel();
  },

  onCancel : function() {
    console.log('toura.components.SocialMessage::onCancel()');
  },

  initializeStrings : function() {
    this.i18n_submitLabel = this.getString('SEND');
    this.i18n_cancelLabel = this.getString('CANCEL');

    this.i18n_usernameRequired = this.getString('SOCIAL_USERNAME_REQUIRED');
    this.i18n_passwordRequired = this.getString('SOCIAL_PASSWORD_REQUIRED');
    this.i18n_privacy = this.getString('SOCIAL_PRIVACY');
    this.i18n_messageRequired = this.getString('SOCIAL_MESSAGE_REQUIRED');
    this.i18n_messageLength = this.getString('SOCIAL_MESSAGE_LENGTH');
  }

});



}

if(!dojo._hasResource['toura.components.MoreDrawer']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components.MoreDrawer'] = true;
dojo.provide('toura.components.MoreDrawer');










dojo.declare('toura.components.MoreDrawer', [ toura.components._Component ], {
  templateString : dojo.cache("toura.components", "MoreDrawer/MoreDrawer.haml", ".component.more-drawer\n  :if phone\n    %section\n      %menu\n        =helpers.homeButton\n        =helpers.fontSizeButton\n        =helpers.searchButton\n\n    %section\n      %menu\n        =helpers.favoriteButton\n        =helpers.sharingButtons\n\n  :if tablet\n    %section\n      %menu\n        =helpers.fontSizeButton\n        =helpers.favoriteButton\n        =helpers.sharingButtons\n\n  %section{ dojoAttachPoint : 'shareSection' }\n"),

  helpers : {
    sharingButtons : dojo.cache("toura.components", "MoreDrawer/_SharingButtons.haml", "%li.facebook\n  %a{ dojoAttachPoint : 'facebook' }\n\n%li.twitter\n  %a{ dojoAttachPoint : 'twitter' }\n\n%li.email\n  %a{ dojoAttachPoint : 'email', href : '#' }\n"),
    favoriteButton : dojo.cache("toura.components", "MoreDrawer/_FavoriteButton.haml", "%li.favorite\n  %input{ type : 'checkbox', dojoAttachPoint : 'favorite' }\n"),
    homeButton : dojo.cache("toura.components", "MoreDrawer/_HomeButton.haml", "%li.home\n  %a{ dojoType : 'toura.components.buttons.HomeButton', dojoAttachPoint : 'homeButton' }\n"),
    fontSizeButton : dojo.cache("toura.components", "MoreDrawer/_FontSizeButton.haml", "%li.font-size\n  %a{ dojoType : 'toura.components.buttons.FontSize' }\n"),
    searchButton : dojo.cache("toura.components", "MoreDrawer/_SearchButton.haml", "%li.search\n  %a{ dojoType : 'toura.components.buttons.SearchButton', dojoAttachPoint : 'searchButton' }\n")
  },

  widgetsInTemplate : true,

  isHidden : true,

  prepareData : function() {
    this.sharingDisabled = !toura.features.sharing;
    this.favoritesDisabled = !toura.features.favorites;
    this.fontSizeDisabled = !toura.features.fontSize;

    if (!this.sharingDisabled) {
      this.socialMediaServices = toura.app.Sharing.getServices();

      if (!this.socialMediaServices.length) {
        this.sharingDisabled = true;
      }
    }

    this.helpers.sharingButtons = this.sharingDisabled ? '' : this.helpers.sharingButtons;
    this.helpers.favoriteButton = this.favoritesDisabled ? '' : this.helpers.favoriteButton;
    this.helpers.fontSizeButton = this.fontSizeDisabled ? '' : this.helpers.fontSizeButton;

    this.inherited(arguments);
  },

  setupConnections : function() {
    var touch = toura.app.UI.hasTouch,
        evt = touch ? 'touchstart' : 'click',
        prevent = function(e) { e.preventDefault(); };

    if (!this.sharingDisabled) {
      dojo.forEach(this.socialMediaServices, function(service) {
        var socialButton = this[service.name];
        if (!socialButton) { return; }
        this.connect(socialButton, evt, dojo.hitch(this, '_handleSocialMessageClick', service));
        if (touch) { this.connect(socialButton, 'click', prevent); }
      }, this);

      this._createMailLink();
      this.hide(this.shareSection);
    }

    if (!this.favoritesDisabled) {
      // set up favorite button
      this.connect(this.favorite, evt, '_handleFavorite');

      if (touch) {
        this.connect(this.favorite, 'click', prevent);
      }
    }
  },

  adjustMarkup : function() {
    if (this.sharingDisabled) { return; }

    dojo.forEach(['facebook', 'twitter'], function(svcName) {
      var enabled = dojo.filter(this.socialMediaServices, function(svc) {
        return svc.name === svcName;
      });

      if (!enabled.length) {
        dojo.destroy(this.query('.' + svcName)[0]);
      }
    }, this);
  },

  _createMailLink : function() {
    if (!this.email) { return; }
    dojo.attr(this.email, 'href', 'mailto:?' + dojo.objectToQuery({
      subject : toura.app.Config.get('app').name,
      body : toura.app.Sharing.getMessage('email', this.node)
    }));

    this.connect(this.email, 'click', function() {
      dojo.publish('/share', [
        [ 'email', this.node.id ].join(': ')
      ]);
    });
  },

  _handleSocialMessageClick : function(service) {
    console.log('toura.components.MoreDrawer::_handleSocialMessageClick()');

    toura.app.Phonegap.network.isReachable().then(dojo.hitch(this, function(isReachable) {
      if (!isReachable) {
        alert(this.i18n_noNetwork);
        return;
      }

      if (this.socialMessage) {
        var same = this.socialMessage.name === service.name;

        this.orphan(this.socialMessage, true);
        delete this.socialMessage;

        if (same) {
          dojo.removeClass(this[service.name], 'active');
          return;
        }
      }

      // mark which button was clicked
      dojo.addClass(this[service.name], 'active');

      var params = dojo.mixin({
            messageText : toura.app.Sharing.getMessage(service.name, this.node)
          }, service),

          socialMessage = this.socialMessage =
          this.adopt(toura.components.SocialMessage, params);

      socialMessage.placeAt(this.shareSection);
      this.show(this.shareSection);

      this.connect(socialMessage, 'onSubmit', function(params) {
        toura.app.Sharing.share(service, params, this.node)
          .then(
            // sharing was successful
            dojo.hitch(this, function() {
              this.hide(this.shareSection);
            }),
            // sharing failed
            function(msg) {
              // TODO: i18n
              if (msg) { alert(msg); }
            }
          );
      });

      this.connect(socialMessage, 'onCancel', function() {
        this.hide(this.shareSection);
        this.orphan(socialMessage, true);
        delete this.socialMessage;
      });
    }), function() {
      alert(this.i18n_noNetwork);
    });
  },

  _handleFavorite : function(e) {
    console.log('toura.components.MoreDrawer::_handleFavorite');

    if (!this.node) { return; }

    var n = this.node,
        isFav = toura.app.user.Favorites.isFavorite(n),
        topic = '/favorite/' + (isFav ? 'remove' : 'add');

    dojo.publish(topic, [ n ]);
    this.favorite.checked = !isFav;
  },

  _setNodeAttr : function(node) {
    this.node = node;
    if (this.favorite) {
      this.favorite.checked = toura.app.user.Favorites.isFavorite(node);
    }
  },

  toggle : function() {
    if (!this.isHidden) {
      dojo.publish('/MoreDrawer/hide');
      this.hide(this.shareSection);
    } else {
      dojo.publish('/MoreDrawer/show');
    }

    this.inherited(arguments);
  },

  initializeStrings : function() {
    this.i18n_noNetwork = this.getString('NO_NETWORK');
  }

});

}

if(!dojo._hasResource['toura.components.buttons.MoreDrawerButton']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components.buttons.MoreDrawerButton'] = true;
dojo.provide('toura.components.buttons.MoreDrawerButton');



dojo.declare('toura.components.buttons.MoreDrawerButton', [ toura.components.buttons._Button ], {
  initializeStrings : function() {
    this.i18n_text = this.getString('MORE');
  }
});

}

if(!dojo._hasResource['toura.components.buttons.BackButton']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components.buttons.BackButton'] = true;
dojo.provide('toura.components.buttons.BackButton');



dojo.declare('toura.components.buttons.BackButton', [ toura.components.buttons._Button ], {
  preventWhenAnimating : true,

  onClick : function(e) {
    e.preventDefault();

    if (toura.features.disableBackButton) { return; }
    toura.app.Router.back();
  },

  initializeStrings : function() {
    this.i18n_text = this.getString('BACK');
  }

});

}

if(!dojo._hasResource['toura.components.PageNav']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components.PageNav'] = true;
dojo.provide('toura.components.PageNav');








dojo.declare('toura.components.PageNav', [ toura.components._Component ], {
  templateString : dojo.cache("toura.components", "PageNav/PageNav.haml", "%nav.component.page-nav\n  .top\n    :if tablet\n      %ul\n        %li.back\n          %a{ dojoType : 'toura.components.buttons.BackButton', dojoAttachPoint : 'backButton' }\n        %li.home\n          %a{ dojoType : 'toura.components.buttons.HomeButton', dojoAttachPoint : 'homeButton' }\n\n      %h1\n        %span{ dojoAttachPoint : 'titleElement' }= title\n\n      %ul\n        :if shareable\n          %li.more\n            %a{ dojoType : 'toura.components.buttons.MoreDrawerButton', dojoAttachPoint : 'moreDrawerButton' }\n\n        %li.search\n          %a{ href : searchUrl }\n\n    :if phone\n      .back\n        %a{ dojoType : 'toura.components.buttons.BackButton', dojoAttachPoint : 'backButton' }\n\n      %h1\n        %span{ dojoAttachPoint : 'titleElement' }= title\n\n      :if shareable\n        .more\n          %a{ dojoType : 'toura.components.buttons.MoreDrawerButton', dojoAttachPoint : 'moreDrawerButton' }\n\n      :if !shareable\n        .home\n          %a{ dojoType : 'toura.components.buttons.BackButton', dojoAttachPoint : 'backButton' }\n\n  :if shareable\n    %div{ dojoType : 'toura.components.MoreDrawer', dojoAttachPoint : 'moreDrawer' }\n"),
  widgetsInTemplate : true,
  shareable : true,

  prepareData : function() {
    this.searchUrl = toura.app.URL.search();
    this.homeUrl = toura.app.URL.home();

    this.title = this.node ? this.node.name : this.title;
    this.shareable = this.node && this.node.shareable;
  },

  setupConnections : function() {
    if (this.moreDrawerButton) {
      this.connect(this.moreDrawerButton, 'onClick', '_showMoreDrawer');
    }
  },

  setupSubscriptions : function() {
    this.subscribe('/button/menu', '_showMoreDrawer');
  },

  setupChildComponents : function() {
    if (this.shareable) {
      this.moreDrawer.set('node', this.node);
    }
  },

  initializeStrings : function() {
    this.i18n_more = this.getString('MORE');
  },

  _showMoreDrawer : function(e) {
    if (e) { e.preventDefault(); }
    this.moreDrawer.toggle();
  },

  attributeMap : {
    screenTitle : {
      node : 'titleElement',
      type : 'innerHTML'
    }
  }
});

}

if(!dojo._hasResource['toura.pageControllers.Debug']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.pageControllers.Debug'] = true;
dojo.provide('toura.pageControllers.Debug');




dojo.declare('toura.pageControllers.Debug', [ toura.pageControllers._Page ], {
  templateString : dojo.cache("toura.pageControllers", "Debug/Debug.haml", ".page.debug\n  .header{ dojoAttachPoint : 'pageNav' }\n\n  .body\n    %div{ dojoType : 'toura.ui.Scrollable' }\n      %div\n        %table{ dojoAttachPoint : 'deviceInfo' }\n\n        %ul.actions\n          %li{ dojoAttachEvent : 'click:_weinre' } weinre\n          %li{ dojoAttachEvent : 'click:_resetDB' } reset\n\n        %div{ dojoAttachPoint : 'status' }\n\n"),

  postMixInProperties : function() {
    var html = [],
        tpl = function(k, v) {
          return '<tr><th>{k}</th><td>{v}</td></tr>'.replace('{k}', k).replace('{v}', v);
        },
        header = function(t) {
          return '<tr><th colspan=2>' + t + '</th></tr>';
        },
        k;

    html.push(header('Device'));

    if (window.device) {
      dojo.forIn(window.device, function(k, v) {
        html.push(tpl(k, v));
      });
    }

    html.push(tpl('UA', window.navigator.userAgent));
    html.push(tpl('Device Type', this.device.type));
    html.push(tpl('Device OS', this.device.os));

    var app = toura.app.Config.get('app');

    html.push(header('App'));
    html.push(tpl('Build Date', toura.app.Config.get('buildDate')));
    html.push(tpl('Data Version', toura.app.Tour._getLocalVersion()));

    dojo.forIn(app, function(k, v) {
      html.push(tpl(k, v));
    });

    html.push(header('Features'));

    dojo.forIn(toura.features, function(k, v) {
      html.push(tpl(k, v ? 'true' : 'false'));
    });

    this.info = html.join('');
    this.inherited(arguments);
  },

  postCreate : function() {
    this.inherited(arguments);
    this.deviceInfo.innerHTML = this.info;
  },

  _weinre : function() {
    this.status.innerHTML = 'debugging at ' + toura.app._Debug.weinre.init();
  },

  _resetDB : function() {
    toura.app.DeviceStorage.drop();
    window.location.reload();
  },

  setupNav : function() {
    this.adopt(toura.components.PageNav, {
      title : 'Debug',
      shareable : false
    }, this.pageNav);
  }
});


}

if(!dojo._hasResource['toura.components.SearchInput']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components.SearchInput'] = true;
dojo.provide('toura.components.SearchInput');






dojo.declare('toura.components.SearchInput', [ toura.components._Component ], {
  templateString : dojo.cache("toura.components", "SearchInput/SearchInput.haml", ".component.search-input\n  %a.back{ dojoType : 'toura.components.buttons.BackButton' }\n  %form.search{ dojoAttachPoint : 'searchForm' }\n    %input{ type : 'search', name : 'query', placeholder : i18n_placeholderText, autocorrect : 'off', dojoAttachPoint : 'queryInput' }\n    %input{ type : 'submit', value : 'Search', dojoAttachPoint : 'searchButton' }\n"),
  _oldValue : null,

  keybuffer : 3,
  debounceTime : 300,
  timeout : null,
  widgetsInTemplate : true,

  setupConnections : function() {
    this.connect(this.queryInput, 'focus', function(){
      // ios shifts the page to the left when the field gets focus
      window.scrollTo(0, 0);
      this.queryInput.value = '';
    });

    this.connect(this.queryInput, 'keyup', '_handleInput');

    if (toura.app.UI.hasTouch) {
      this.connect(this.searchButton, 'touchstart', '_handleSubmit');
    }

    this.connect(this.searchForm, 'submit', '_handleSubmit');
  },

  _setSearchTermAttr : function(term) {
    this.queryInput.value = term || '';
  },

  _handleInput : function() {
    if (dojo.trim(this.queryInput.value).length < this.keybuffer) {
      return;
    }

    clearTimeout(this.timeout);

    this.timeout = setTimeout(dojo.hitch(this, function() {
      this._search(this.queryInput.value);
    }), this.debounceTime);
  },

  _handleSubmit : function(e) {
    e.preventDefault();
    e.stopPropagation();
    var q = this.queryInput.value;

    if (/^toura:./.test(q)) {
      console.log('found toura:');
      dojo.publish('/debug/user', [ q ]);
      return;
    }

    this._search(q);
  },

  _search : function(q) {
    q = dojo.trim(q);
    if (!q) { return; }
    if (q === this._oldValue) { return; }

    this.search(q);

  },

  search : function(q) {
    // stub for connections, so we can announce
    // the search to other components
  },

  initializeStrings : function() {
    this.i18n_placeholderText = this.getString('SEARCH_PLACEHOLDER_TEXT');
  }
});

}

if(!dojo._hasResource['toura.components._Results']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components._Results'] = true;
dojo.provide('toura.components._Results');





dojo.declare('toura.components._Results', [ toura.components._Component, toura.ui.Scrollable ], {
  postCreate : function() {
    this.inherited(arguments);
    this.refreshScroller();
  },

  _truncate : function(text) {
    return toura.util.truncate(text, 200);
  }
});

}

if(!dojo._hasResource['toura.components.SearchResults']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components.SearchResults'] = true;
dojo.provide('toura.components.SearchResults');



dojo.declare('toura.components.SearchResults', [ toura.components._Results ], {
  templateString : dojo.cache("toura.components", "SearchResults/SearchResults.haml", ".component.search-results\n  %ul{ dojoAttachPoint : 'resultsContainer' }\n"),
  resultTemplate : Haml(dojo.cache("toura.components", "SearchResults/Result.haml", "%li{ class : type }\n  %a.text{ href : url }\n    %h2= nodeTitle\n    %p= displayText\n")),

  handleClicks : true,
  resultsToShow : 25,

  postCreate : function() {
    this.clickableNode = this.resultsContainer;
    this.inherited(arguments);
  },

  _setResultsAttr : function(results) {
    if (results && !dojo.isArray(results)) {
      throw new Error('toura.components.SearchResults::_setResultsAttr: results argument must be an array');
    }

    dojo.empty(this.resultsContainer);

    if (!results) {
      // there is no results array at all
      this._handleEmptySearch();
      return;
    }

    if (!results.length) {
      this._handleNoResults();
      return;
    }

    var moreResults = results.length > this.resultsToShow;

    this.results = results = results.slice(0, this.resultsToShow);

    this.resultsContainer.innerHTML = dojo.map(results, function(r) {
      var result = dojo.mixin({}, r),
          a = result.asset;

      result.thumbnailURL = a && a.featured && a.featured.url;
      result.displayText = this._truncate(result.displayText);

      return this.resultTemplate(result);
    }, this).join('');

    if (moreResults) {
      moreResults = dojo.create('li', {
        innerHTML : this.i18n_moreResults,
        className : 'more-results'
      });
      dojo.place(moreResults, this.resultsContainer, 'last');
    }

    this.refreshScroller();
  },

  _handleNoResults : function() {
    this.resultsContainer.innerHTML = '<li>' + this.i18n_noResults + '</li>';
  },

  _handleEmptySearch : function() {
    this.resultsContainer.innerHTML = '<li>' + this.i18n_instructions + '</li>';
  },

  initializeStrings : function() {
    this.i18n_instructions = this.getString('SEARCH_INSTRUCTIONS');
    this.i18n_noResults = this.getString('SEARCH_NO_RESULTS');
    this.i18n_moreResults = this.getString('SEARCH_MORE_RESULTS');
  }
});

}

if(!dojo._hasResource['toura.pageControllers.search.Search']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.pageControllers.search.Search'] = true;
dojo.provide('toura.pageControllers.search.Search');






dojo.declare('toura.pageControllers.search.Search', [ toura.pageControllers._Page ], {
  templateString : dojo.cache("toura.pageControllers.search", "Search/Search.haml", "%li.page.search\n  .header.input{ dojoAttachPoint : 'searchInput' }\n  .results{ dojoAttachPoint : 'searchResults' }\n"),

  lastSearchTerm : null,

  type : 'search',

  postMixInProperties : function() {
    this.inherited(arguments);

    this.placements = [
      [ 'SearchInput', {}, 'searchInput' ],
      [ 'SearchResults', {}, 'searchResults' ]
    ];
  },

  postCreate : function() {
    this.inherited(arguments);

    this.connect(this.searchInput, 'search', '_handleSearch');

    if (toura.lastSearchTerm) {
      this._handleSearch(toura.lastSearchTerm);
    }
  },

  _handleSearch : function(term) {
    if (term === this.lastSearchTerm) { return; }
    this.set('searchTerm', term);
    this.searchResults.set('results', toura.app.Data.search(term));
  },

  _setSearchTermAttr : function(term) {
    this.lastSearchTerm = toura.lastSearchTerm = term;
    this.searchInput.set('searchTerm', term);
  },

  init : function(term) {
    if (!term) { return; }
    this._handleSearch(term);
  }
});

}

if(!dojo._hasResource['toura.components.buttons.DeleteButton']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components.buttons.DeleteButton'] = true;
dojo.provide('toura.components.buttons.DeleteButton');



dojo.declare('toura.components.buttons.DeleteButton', [ toura.components.buttons._Button ], {
  templateString : dojo.cache("toura.components.buttons", "DeleteButton/DeleteButton.haml", "%div.button{ title: i18n_text }\n"),

  objId : '',
  deleting: false,

  onClick : function(e) {
    if (this.deleting) {
      this.onDelete(this.objId, this.domNode);
      return;
    }

    dojo.addClass(this.domNode, 'deleting');
    this.deleting = true;
  },

  initializeStrings : function() {
    this.i18n_text = this.getString('DELETE');
  },

  onDelete : function(id, deleteNode) {
    // stub for implementation
  }
});


}

if(!dojo._hasResource['toura.components.Favorites']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components.Favorites'] = true;
dojo.provide('toura.components.Favorites');





dojo.declare('toura.components.Favorites', [ toura.components._Results ], {
  templateString : dojo.cache("toura.components", "Favorites/Favorites.haml", ".component.favorites\n  %ul{ dojoAttachPoint : 'favoritesList' }\n    :if favorites.length\n\n      :each fav in favorites\n        %li{ class : fav.type }\n\n          %a{ href : fav.model.url }\n            :if fav.img\n              .img{ dojoType : 'toura.ui.BackgroundImage', imageUrl : fav.img, imageHeight : '50px', imageWidth : '67px', resizeMethod : 'cover', loadOnInit : true }\n\n            :if !fav.img\n              .img.default\n\n            .text\n              %h2= fav.name\n\n              :if fav.displayText\n                %p= fav.displayText\n\n          .delete{ dojoType : 'toura.components.buttons.DeleteButton', objId : fav.id, dojoAttachEvent : 'onDelete: _deleteFavorite' }\n\n    :if !favorites.length\n      %li= i18n_noFavorites\n"),
  handleClicks : true,
  widgetsInTemplate : true,

  prepareData : function() {
    this.favorites = dojo.filter(this.favorites || [], function(fav) {
      return !fav.deleted;
    });

    this.favorites = dojo.map(this.favorites, function(fav) {
      fav.img = fav.model.featuredImage && fav.model.featuredImage.small.url;

      fav.displayText = fav.model.bodyText && fav.model.bodyText.body ?
        this._truncate(fav.model.bodyText.body) : false;

      return fav;
    }, this);
  },

  initializeStrings : function() {
    this.i18n_noFavorites = this.getString('FAVORITES_NO_FAVORITES');
  },

  _deleteFavorite : function(id, deleteNode) {
    dojo.publish('/favorite/remove', [ id ]);
    dojo.destroy(deleteNode.parentNode);
  }
});


}

if(!dojo._hasResource['toura.pageControllers.favorites.Favorites']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.pageControllers.favorites.Favorites'] = true;
dojo.provide('toura.pageControllers.favorites.Favorites');






dojo.declare('toura.pageControllers.favorites.Favorites', [ toura.pageControllers._Page ], {
  templateString : dojo.cache("toura.pageControllers.favorites", "Favorites/Favorites.haml", "%li.page.favorites\n  %div{ dojoAttachPoint : 'pageNav' }\n\n  .pane.bottom\n    %div{ dojoAttachPoint : 'favorites' }\n"),

  postMixInProperties :  function() {
    this.placements = [
      [
        'Favorites',
        { favorites : toura.app.user.Favorites.load() },
        'favorites',
        'replace'
      ]
    ];

    this.inherited(arguments);
  },

  setupNav : function() {
    this.adopt(toura.components.PageNav, {
      shareable : false,
      title: this.i18n_favorites
    }).placeAt(this.pageNav, 'replace');
  },

  initializeStrings : function() {
    this.i18n_favorites = this.getString('FAVORITES');
  }
});

}

if(!dojo._hasResource['toura.pageControllers.node._Node']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.pageControllers.node._Node'] = true;
dojo.provide('toura.pageControllers.node._Node');




dojo.declare('toura.pageControllers.node._Node', [ toura.pageControllers._Page ], {
  templateString : '%div',
  shareable : true,

  postMixInProperties : function() {
    this.inherited(arguments);

    if (!this.node) {
      this.node = this.baseObj;
    }

    this.node.shareable = this.shareable;
  },

  postCreate : function() {
    this.inherited(arguments);

    if (this.baseObj && this.baseObj.id) {
      this.addClass('page-' + this.baseObj.id);
    }
  },

  _getDimensions : function() {
    return toura.app.UI.viewport;
  },

  // @override
  _getBackgroundImage : function() {
    if (!this.node.backgroundImage) { return; }

    var img = this.node.backgroundImage[this.device.type];

    if (img) {
      return this.device.type === 'phone' ? img.gallery : img.original;
    }

    return this.inherited(arguments);
  },

  setupNav : function() {
    this.inherited(arguments);

    if (!this.pageNav) { return; }

    // don't create page nav on home node pages
    if (this.node.id === toura.app.Config.get('app').homeNodeId) {
      dojo.destroy(this.pageNav);
      return;
    }

    this.adopt(toura.components.PageNav, {
      shareable : this.shareable,
      node : this.node
    }).placeAt(this.pageNav, 'replace');
  }
});

}

if(!dojo._hasResource['toura.pageControllers.node._ImageGalleryPage']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.pageControllers.node._ImageGalleryPage'] = true;
dojo.provide('toura.pageControllers.node._ImageGalleryPage');

dojo.declare('toura.pageControllers.node._ImageGalleryPage', [], {
  /**
   * This is a mixin to give common image gallery behavior
   * to a page controller. It should not be used on its own.
   */
  _imageGalleryPageSetup : function(config) {
    var caption = config.caption,
        fullScreen = config.fullScreen,
        gallery = config.gallery,
        setCaption = function(image) {
          if (!caption) { return; }
          caption.set('content', image && image.caption || '');

          // this is to make the scroller reveal all the content. there's
          // probably a better way to do this.
          dojo.style(caption.domNode, 'height', null);
          dojo.style(caption.domNode, 'height', (caption.domNode.clientHeight + 50) + 'px');
        };

    this.connect(gallery, 'onShowDetail', function(imageIndex) {
      fullScreen.set('active', true);
      fullScreen.set('currentImageIndex', imageIndex);

      dojo.publish('/ImageGalleryPage/detail/show');
      toura.app.UI.set('siblingNavVisible', false);
      dojo.addClass(this.mainScreen, 'hidden');
    });

    this.connect(fullScreen, 'onHideDetail', function(imageIndex) {
      var image = this.node.images[imageIndex];

      gallery.set('active', true);
      gallery.scrollToIndex(imageIndex);
      setCaption(image);

      dojo.publish('/ImageGalleryPage/detail/hide');
      toura.app.UI.set('siblingNavVisible', true);
      dojo.removeClass(this.mainScreen, 'hidden');
    });

    this.connect(this, 'init', function(pageState) {
      this.connect(gallery, 'onScrollEnd', function(imageIndex) {
        var image = this.node.images[imageIndex];
        setCaption(image);
        dojo.publish('/content/update');
      });

      if (!pageState || !pageState.assetId) { return; }

      var imageId = pageState.assetId,
          index;

      if (!imageId) { return; }

      var image = dojo.filter(this.node.images, function(image, i) {
        if (image.id === imageId) {
          index = i;
          return image;
        }
      })[0];

      if (!image) { return; }

      this.connect(gallery, 'onScrollerSetupComplete', function() {
        setTimeout(function() {
          gallery.scrollToIndex(index);
          setCaption(image);
        }, 100);
      });
    });
  }
});


}

if(!dojo._hasResource['toura.components.BodyText']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components.BodyText'] = true;
dojo.provide('toura.components.BodyText');



dojo.declare('toura.components.BodyText', [ toura.components._Component ], {
  templateString : dojo.cache("toura.components", "BodyText/BodyText.haml", ".component.body-text\n  %div{ dojoAttachPoint : 'bodyTextContainer' }= bodyText\n"),

  prepareData : function() {
    this.bodyText = this.bodyText || this._getBodyText();
  },

  adjustMarkup : function() {
    if (!dojo.trim(this.bodyText)) {
      this.addClass('empty');
    }
  },

  _getBodyText : function() {
    if (!this.node) { return ''; }
    return this.node.bodyText ? this.node.bodyText.body : '';
  },

  setupConnections : function() {
    this.query('a[rel="external"]').attr('target', '_blank');
    this.connect(this.domNode, 'click', '_handleClick');
  },

  _handleClick : function(e) {
    var t = e.target,
        href,
        rel;

    if (t.nodeName.toLowerCase() !== 'a') { return; }

    rel = dojo.attr(t, 'rel');

    if (rel && rel === 'external') {
      // allow links w/rel="external" not to go to child browser
      return;
    }

    href = dojo.attr(t, 'href');

    if (/^http/.test(href)) {
      e.preventDefault();
      // show the link in child browser by default
      toura.app.Phonegap.browser.url(href);
      return;
    }
  },

  _setContentAttr : function(val) {
    this.bodyTextContainer.innerHTML = val;
    dojo[val ? 'removeClass' : 'addClass'](this.domNode, 'empty');
  }
});

}

if(!dojo._hasResource['toura.components.AudioCaption']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components.AudioCaption'] = true;
dojo.provide('toura.components.AudioCaption');



dojo.declare('toura.components.AudioCaption', [ toura.components.BodyText ], {
  "class" : 'audio-caption',

  _getBodyText : function() {
    if (!this.node || !this.node.audios) { return ''; }
    return this.node.audios[0] ? (this.node.audios[0].caption || '') : '';
  }
});


}

if(!dojo._hasResource['toura.components.ImageCaption']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components.ImageCaption'] = true;
dojo.provide('toura.components.ImageCaption');



dojo.declare('toura.components.ImageCaption', [ toura.components.BodyText ], {
  "class" : 'image-caption',

  _getBodyText : function() {
    if (!this.node || !this.node.images) { return ''; }
    return this.node.images[0] ? (this.node.images[0].caption || '') : '';
  }
});

}

if(!dojo._hasResource['toura.components._ImageGallery']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components._ImageGallery'] = true;
dojo.provide('toura.components._ImageGallery');



/**
 * This is a mixin to be used with components that include
 * a set of images. It should not be used on its own.
 */
dojo.declare('toura.components._ImageGallery', [], {
  widgetsInTemplate : true,

  postCreate : function() {
    this.inherited(arguments);
  },

  startup : function() {
    this._setWidth();
    this._setupClick();
    this.subscribe('/window/resize', '_setWidth');
  },

  _setWidth : function() {
    // TODO: get list items from dom instead of depending on class name
    this.widthItems = this.widthItems || this.query('.image');
    this.widthItems.style('width', toura.app.UI.viewport.width + 'px');
  },

  _setCurrentImageIndexAttr : function(imageIndex) {
    this.bgImgs = this.bgImgs || dojo.filter(dijit.findWidgets(this.domNode), function(w) {
      return w.isInstanceOf(toura.ui.BackgroundImage);
    });

    dojo.forEach(this.bgImgs, function(bgImg, i) {
      if (imageIndex !== null && i >= imageIndex - 1 && i <= imageIndex + 1) {
        bgImg.loadImage();
      } else {
        bgImg.unloadImage();
      }
    }, this);

    this.currentImageIndex = imageIndex;
  },

  _setupClick : function() {
    if (!this._handleClick) { return; }
    if (!this.clickNode) { return; }

    var events = toura.app.UI.hasTouch ? {
      start : 'touchstart',
      move : 'touchmove',
      end : 'touchend'
    } : {
      start : 'mousedown',
      move : 'mousemove',
      end : 'mouseup'
    };

    this.connect(this.clickNode, events.start, function() {
      var c = [],
          moved,
          handle = dojo.hitch(this, '_handleClick'),
          start = new Date().getTime();

      c.push(dojo.connect(this.imageList, events.move, function() {
        moved = true;
      }));

      c.push(dojo.connect(this.imageList, events.end, function(e) {
        dojo.forEach(c, dojo.disconnect);
        if ((new Date().getTime() - start > toura.app.UI.touchMoveDebounce) && moved) { return; }
        handle(e);
      }));
    });
  }

});

}

if(!dojo._hasResource['toura.components._ImageScroller']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components._ImageScroller'] = true;
dojo.provide('toura.components._ImageScroller');





/**
 * This is a mixin to be used with components that include
 * an image scroller. It should not be used on its own.
 */
dojo.declare('toura.components._ImageScroller', [ toura.components._ImageGallery ], {
  postMixInProperties : function() {
    this.inherited(arguments);
    this.useScroller = this.images.length > 1;
  },

  startup : function() {
    this.inherited(arguments);
    this._setupImageScroller();
  },

  _setupImageScroller : function() {
    if (this.useScroller && this.scrollerNode) {

      var self = this,
          node = this.scrollerNode.parentNode,
          scroller;

      scroller = this.scrollerHandle = new iScroll(node, {
        snap : true,
        momentum : false,
        hScrollbar : false,
        onScrollEnd : function() {
          self.set('currentImageIndex', this.currPageX);
          self.onScrollEnd(this.currPageX);
        }
      });

      scroller.refresh();
      this.onScrollerSetupComplete();
    }

    this.set('currentImageIndex', 0);
  },

  onScrollerSetupComplete : function() {
    console.log('toura.components._ImageScroller::onScrollerSetupComplete()');
    // stub for connections
  },

  onScrollEnd : function(imageIndex) {
    // stub for connection
  },

  _setWidth : function() {
    var pageWidth = toura.app.UI.viewport.width,
        scrollerWidth = this.images.length * pageWidth;

    this.scrollerNode.style.width = scrollerWidth + 'px';
    this.query('.image').style('width', pageWidth + 'px');
    if (!this.scrollerHandle) { return; }
    this.scrollerHandle.refresh();
    this.scrollToIndex(this.currentImageIndex);
  },

  scrollToIndex : function(imageIndex) {
    if (!this.scrollerHandle) { return; }
    if (imageIndex === this.currentImageIndex) { return; }
    this.scrollerHandle.scrollToPage(imageIndex, 0, '0ms');
    this.set('currentImageIndex', imageIndex);
  },

  refresh : function() {
    if (!this.scrollerHandle) { return; }
    this.scrollerHandle.refresh();
  },

  destroy : function() {
    if (this.scrollerHandle) { this.scrollerHandle.destroy(); }
    this.inherited(arguments);
  }
});

}

if(!dojo._hasResource['toura.components.ImageGallery']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components.ImageGallery'] = true;
dojo.provide('toura.components.ImageGallery');




dojo.declare('toura.components.ImageGallery', [ toura.components._Component, toura.components._ImageScroller ], {
  templateString : dojo.cache("toura.components", "ImageGallery/ImageGallery.haml", ".component.image-gallery\n  %ol{ dojoAttachPoint : 'imageList' }\n    :each img in images\n      %li{ class : 'image ' + img.id }\n        .image{ dojoType : 'toura.ui.BackgroundImage', imageUrl : img.url, imageHeight : img.height, imageWidth : img.width }\n"),

  prepareData : function() {
    this.images = dojo.map(this.node.images || [], function(img) {
      return dojo.mixin(img, {
        url : img.gallery.url,
        height : img.gallery.height,
        width : img.gallery.width
      });
    }, this);
  },

  postCreate : function() {
    this.scrollerNode = this.clickNode = this.imageList;
    this.inherited(arguments);
  },

  _handleClick : function() {
    this.onShowDetail(this.currentImageIndex);
  },

  onShowDetail : function(imageIndex) {
    // stub for connection
  }
});

}

if(!dojo._hasResource['toura.components.DetailTitle']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components.DetailTitle'] = true;
dojo.provide('toura.components.DetailTitle');



dojo.declare('toura.components.DetailTitle', [ toura.components._Component ], {
  templateString : dojo.cache("toura.components", "DetailTitle/DetailTitle.haml", ".component.detail-title\n  %a.close{ href : '#', dojoAttachPoint : 'closeButton' }= i18n_close\n  %h1{ dojoAttachPoint : 'titleElement' }= title\n"),

  setupConnections : function() {
    this.connect(this.closeButton, 'click', '_close');
  },

  _close : function(e) {
    // also a stub for connection
    e.preventDefault();
    this.onClose();
  },

  onClose : function() {
    // stub for connection
  },

  initializeStrings : function() {
    this.i18n_close = this.getString('CLOSE');
  },

  attributeMap : {
    screenTitle : {
      node : 'titleElement',
      type : 'innerHTML'
    }
  }
});

}

if(!dojo._hasResource['toura.ui.PinchZoom']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.ui.PinchZoom'] = true;
dojo.provide('toura.ui.PinchZoom');



dojo.declare('toura.ui.PinchZoom', null, {
  zoomMax : 3,

  _makeScroller : function(listItem) {
    var self = this,
        bgImageWidget = dijit.byNode(listItem.firstChild);

    if (this.scroller) {
      this.scroller.destroy();
    }

    this.scroller = new iScroll(listItem, {
      zoom : toura.app.Has.iScrollZoom(),
      onZoomEnd : function() {
        self.onZoomEnd(bgImageWidget, this);
      },
      zoomMin : 0.33,
      zoomMax : this.zoomMax
    });
  },

  onZoomEnd : function(bgImageWidget, scroller) {
    if (this.zoomTimeout) { return; }

    this.zoomTimeout = setTimeout(dojo.hitch(this, function() {
      var scale = scroller.scale,
          oldWidth = dojo.style(bgImageWidget.domNode, 'width'),
          oldHeight = dojo.style(bgImageWidget.domNode, 'height'),
          newWidth = oldWidth * scale,
          newHeight = oldHeight * scale,
          newX = scroller.x,
          newY = scroller.y;

      if (bgImageWidget.imageWidth > bgImageWidget.imageHeight) {
        if (newWidth < toura.app.UI.viewport.width) {
          newWidth = toura.app.UI.viewport.width;
          newHeight = newWidth / ratio;
        }
      } else {
        if (newHeight < toura.app.UI.viewport.height) {
          newHeight = toura.app.UI.viewport.height;
          newWidth = newHeight * ratio;
        }
      }

      if (newWidth > toura.app.UI.viewport.width * this.zoomMax) {
        newWidth = oldWidth;
        newHeight = oldHeight;
        newX = newY = 0;
      }

      dojo.style(bgImageWidget.domNode, 'width', newWidth + 'px');
      dojo.style(bgImageWidget.domNode, 'height', newHeight + 'px');
      scroller.zoom(newX, newY, 1, 0);

      clearTimeout(this.zoomTimeout);
      this.zoomTimeout = null;
    }), 0);
  }

});


}

if(!dojo._hasResource['toura.components.ImageDetail']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components.ImageDetail'] = true;
dojo.provide('toura.components.ImageDetail');







dojo.declare('toura.components.ImageDetail', [ toura.components._Component, toura.components._ImageGallery, toura.ui.PinchZoom ], {
  templateString : dojo.cache("toura.components", "ImageDetail/ImageDetail.haml", ".component.image-detail\n  %nav.header{ dojoAttachPoint : 'nav' }\n\n  .content\n    .image-nav.prev{ dojoAttachPoint : 'prevButton' }= i18n_prev\n\n    %ol{ dojoAttachPoint : 'imageList' }\n      :each img in images\n        %li{ class : 'image ' + img.id }\n          .wrapper{ dojoType : 'toura.ui.BackgroundImage', imageUrl : img.url, imageHeight : img.height, imageWidth : img.width }\n\n    .image-nav.next{ dojoAttachPoint : 'nextButton' }= i18n_next\n\n  .caption{ dojoAttachPoint : 'captionContainer' }\n"),
  widgetsInTemplate : true,
  main : false,

  prepareData : function() {
    var device = this.device;

    this.imageCache = {};

    this.images = dojo.map(this.node.images || [], function(img) {
      this.imageCache[img.id] = img;
      return dojo.mixin(img, (device.type === 'tablet' ? {
          url : img.original.url,
          height : img.original.height,
          width : img.original.width
        } : {
          url : img.gallery.url,
          height : img.gallery.height,
          width : img.gallery.width
        })
      );
    }, this);
  },

  postCreate : function() {
    this.nav = this.adopt(
      this.main ? toura.components.PageNav : toura.components.DetailTitle,
      { node : this.node }
    ).placeAt(this.nav, 'replace');

    this.clickNode = this.imageList;
    this.cleanView = this.main ? true : false;

    this._toggleCleanView();
    this.connect(this.nav, 'onClose', '_hideDetail');

    this.connect(this.nextButton, 'click', this._go(1));
    this.connect(this.prevButton, 'click', this._go(-1));

    this.set('active', false);

    this.inherited(arguments);
  },

  showNav : function() {
    this.removeClass('clean');
  },

  _go : function(increment) {
    return dojo.hitch(this, function() {
      this.set('currentImageIndex', this.currentImageIndex + increment);
    });
  },

  _handleClick : function() {
    this._toggleCleanView();
  },

  _hideDetail : function() {
    this.set('active', false);
    this.onHideDetail(this.currentImageIndex);
    if (!this.scroller) { return; }
    this.scroller.zoom(0, 0, 1);
  },

  onHideDetail : function(imageIndex) {
    // stub for connections
    console.log('ImageDetail::onHideDetail()', imageIndex);
  },

  onScrollerSetupComplete : function() {
    this.set('active', false);
  },

  _setActiveAttr : function(active) {
    dojo[active ? 'removeClass' : 'addClass'](this.domNode, 'hidden');
  },

  _toggleCleanView : function() {
    var clean = this.cleanView = !this.cleanView;
    dojo[clean ? 'addClass' : 'removeClass'](this.domNode, 'clean');
  },

  _setCurrentImageIndexAttr : function(imageIndex) {
    this.inherited(arguments);

    var img = this.images[imageIndex];
    this.set('caption', img.caption);
    this.nav.set('screenTitle', img && img.name || '');

    if (this.scroller) { this.scroller.destroy(); }

    this.bgImgs.forEach(function(widget, index) {
      var listItem = widget.domNode.parentNode,
          isCurrentImage = index === imageIndex;

      dojo[isCurrentImage ? 'removeClass' : 'addClass'](listItem, 'hidden');
      if (!isCurrentImage) { return; }
      this._makeScroller(listItem);
    }, this);

    var isFirst = imageIndex === 0,
        isLast = imageIndex === (this.images.length - 1);

    dojo[isFirst ? 'addClass' : 'removeClass'](this.prevButton, 'hidden');
    dojo[isLast ? 'addClass' : 'removeClass'](this.nextButton, 'hidden');
  },

  _setCaptionAttr : function(caption) {
    var container = this.captionContainer;
    this.caption = caption;

    if (caption) {
      container.innerHTML = caption;
      dojo.removeClass(container, 'hidden');
    } else {
      dojo.empty(container);
      dojo.addClass(container, 'hidden');
    }
  },

  initializeStrings : function() {
    this.i18n_prev = this.getString('PREVIOUS');
    this.i18n_next = this.getString('NEXT');
  }

});

}

if(!dojo._hasResource['toura.components._MediaPlayer']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components._MediaPlayer'] = true;
dojo.provide('toura.components._MediaPlayer');



(function() {
var pg = toura.app.Phonegap;

dojo.declare('toura.components._MediaPlayer', [ toura.components._Component ], {
  useHtml5Player : true,

  prepareData : function() {
    this.inherited(arguments);
    this.mediasCache = {};

    this.medias = dojo.map(this.medias || [], function(media) {
      this.mediasCache[media.id] = media = dojo.mixin(media, {
        assetUrl : [ this.baseUrl, media.id ].join('/')
      });
      return media;
    }, this);

    this.media = this.medias[0] || null;
    this.useHtml5Player = toura.app.Has.html5Player();
  },

  setupSubscriptions : function() {
    this.inherited(arguments);
    if (!this.useHtml5Player) { return; }
    this.subscribe('/page/transition/end', '_setupPlayer');
  },

  adjustMarkup : function() {
    if (!this.useHtml5Player) {
      this.addClass('has-html5-player');
    }
  },

  play : function(mediaId) {
    this.set('mediaId', mediaId);
    this._play(this.media);
  },

  _play : function(media) {
    if (this.useHtml5Player) {
      this.player.play();
    }

    dojo.publish('/' + this.playerType + '/play', [ this.media.id ]);
  },

  _pause : function() {
    if (this.useHtml5Player && this.player) {
      this.player.pause();
    }
  },

  _setMediaIdAttr : function(mediaId) {
    var media = this.media = this.mediasCache[mediaId];

    if (this.useHtml5Player && !this.player) {
      this._queuedMedia = media;
      return;
    }

    this._queuedMedia = null;

    if (this.player) {
      this.player.src = media.url;
    }
  },

  _setupPlayer : function() {
    if (!this.useHtml5Player) { return; }
    if (!this.media) { return; }

    var media = this.media,
        domNode = this.domNode,
        player = this.player = dojo.create(
          this.playerType,
          dojo.mixin({ src : media.url }, this.playerSettings)
        ),
        doIt = dojo.partial(dojo.place, player, domNode);

    var c = dojo.connect(player, 'loadstart', this, function() {
      dojo.disconnect(c);
      c = false;
      if (!domNode) { return; }
      doIt();
    });

    // iOS 4.1 fail
    setTimeout(function() {
      if (!c) { return; }
      dojo.disconnect(c);
      doIt();
    }, 100);

  }
});

}());

}

if(!dojo._hasResource['toura.components.AudioPlayer']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components.AudioPlayer'] = true;
dojo.provide('toura.components.AudioPlayer');





dojo.declare('toura.components.AudioPlayer', [ toura.components._MediaPlayer ], {
  templateString : dojo.cache("toura.components", "AudioPlayer/AudioPlayer.haml", ".component.audio-player\n  :if !useHtml5Player\n    %form\n      %input{ type : 'button', class : 'play', dojoAttachPoint : 'controller' }\n"),

  playerType : 'audio',
  isPlaying : false,
  playerSettings : {
    preload : 'auto',
    controls : true,
    autobuffer : true
  },

  prepareData : function() {
    this.medias = this.node.audios || [];
    this.inherited(arguments);
  },

  setupConnections : function() {
    this.inherited(arguments);

    if (!this.useHtml5Player) {
      this.connect(this.controller, 'click', '_handleControllerClick');
    }
  },

  _handleControllerClick : function() {
    if (this.useHtml5Player) { return; }

    if (this.isPlaying) {
      this._pause();
      this.isPlaying = false;
      this.removeClass('playing');
    } else {
      this._play();
      this.isPlaying = true;
      this.addClass('playing');
    }
  },

  _play : function(media) {
    this.inherited(arguments);

    if (this.useHtml5Player) { return; }

    var pg = toura.app.Phonegap;
    pg.audio.destroy();
    pg.audio.play(this.media.url);
  },

  _pause : function() {
    this.inherited(arguments);

    if (!this.useHtml5Player) {
      toura.app.Phonegap.audio.stop();
    }
  },

  teardown : function() {
    if (!this.useHtml5Player) {
      // we used the phonegap player
      toura.app.Phonegap.audio.destroy();
    }
  }

});

}

if(!dojo._hasResource['toura.components.ChildNodes']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components.ChildNodes'] = true;
dojo.provide('toura.components.ChildNodes');



dojo.declare('toura.components.ChildNodes', [ toura.components._Component ], {
  templateString : dojo.cache("toura.components", "ChildNodes/ChildNodes.haml", "%ul.component.child-nodes\n  :each c in children\n    %li\n      %a{ href : '#/node/' + c.id }= c.name\n"),
  handleClicks : true,

  prepareData : function() {
    this.children = this.node.children || [];
  },

  adjustMarkup : function() {
    if (!this.children.length) {
      this.addClass('empty');
    }
  },

  _clickHandler : function(t, e) {
    dojo.addClass(t, 'tapped');
  }
});

}

if(!dojo._hasResource['toura.components.AssetList']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components.AssetList'] = true;
dojo.provide('toura.components.AssetList');



dojo.declare('toura.components.AssetList', [ toura.components._Component ], {
  templateString : dojo.cache("toura.components", "AssetList/AssetList.haml", ".component.asset-list\n  %ul{ dojoAttachPoint : 'list' }\n    :each a in assets\n      %li{ id : 'asset-' + a.id, data-id : a.id }\n        %a{ href : '#' }= a.name\n\n"),
  "class" : 'assets',

  prepareData : function() {
    this.assets = this.assets || (this.type && this.node[this.type]) || [];

    this.assets = dojo.map(this.assets, function(a) {
      return dojo.mixin(a, { assetUrl : this.baseUrl + '/' + a.id });
    }, this);

    this.baseUrl = this.node.assetTypeUrl(this.type);
  },

  setupConnections : function() {
    this.connect(this.domNode, 'touchmove', function() {
      this.handle = null;
    });

    this.connect(this.domNode, 'touchend', function() {
      if (this.handle && dojo.isFunction(this.handle)) {
        this.handle();
      }
    });

    dojo.forEach(this.list.children, function(n) {
      var assetId = dojo.attr(n, 'data-id');

      if (toura.app.UI.hasTouch) {
        this.connect(n, 'touchstart', function() {
          this.handle = dojo.hitch(this, '_onSelect', assetId);
        });

        this.connect(n, 'click', function(e) {
          e.preventDefault();
        });
      } else {
        this.connect(n, 'click', function(e) {
          e.preventDefault();
          this._onSelect(assetId);
        });
      }
    }, this);
  },

  _onSelect : function(assetId) {
    this.set('currentAsset', assetId);
    this.onSelect(assetId);
  },

  onSelect : function(assetId) {
    // stub for connections
  },

  _setCurrentAssetAttr : function(assetId) {
    var item = this.query('#asset-' + assetId)[0];
    this.query('.asset-list li').removeClass('current');
    dojo.addClass(item, 'current');
    this.currentAsset = assetId;
  }
});

}

if(!dojo._hasResource['toura.components.AudioList']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components.AudioList'] = true;
dojo.provide('toura.components.AudioList');



dojo.declare('toura.components.AudioList', [ toura.components.AssetList ], {
  "class" : 'audio-list',

  postMixInProperties : function() {
    this.assets = this.node.audios || [];
    this.inherited(arguments);
  }
});



}

if(!dojo._hasResource['toura.pageControllers.node.Audios1']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.pageControllers.node.Audios1'] = true;
dojo.provide('toura.pageControllers.node.Audios1');













dojo.declare('toura.pageControllers.node.Audios1', [
  toura.pageControllers.node._Node,
  toura.pageControllers.node._ImageGalleryPage
], {

  templateString : dojo.cache("toura.pageControllers.node", "Audios1/Audios1.haml", "%li.page.audios-1\n  .detail.hidden{ dojoAttachPoint : 'detail' }\n\n  .screen.index{ dojoAttachPoint : 'mainScreen' }\n    .header{ dojoAttachPoint : 'pageNav' }\n\n    .body\n      .row-1\n        %div{ dojoAttachPoint : 'imageGallery' }\n\n      .row-2\n        %div{ dojoAttachPoint : 'audioPlayer' }\n\n      .row-3\n        :if phone\n          %div{ dojoType : 'toura.ui.Scrollable' }\n            %div\n              .audio-list{ dojoAttachPoint : 'audioList' }\n              .child-nodes{ dojoAttachPoint : 'childNodes' }\n              .caption{ dojoAttachPoint : 'audioCaption' }\n              .body-text{ dojoAttachPoint : 'bodyText' }\n\n        :if tablet\n          .col-1\n            %div{ dojoType : 'toura.ui.Scrollable' }\n              %div\n                %div{ dojoAttachPoint : 'childNodes' }\n                .text{ dojoAttachPoint : 'audioCaption' }\n                .text{ dojoAttachPoint : 'bodyText' }\n\n          .col-2\n            %div{ dojoType : 'toura.ui.Scrollable' }\n              %div\n                .caption{ dojoAttachPoint : 'imageCaption' }\n                .audio-list{ dojoAttachPoint : 'audioList' }\n"),

  postMixInProperties : function() {
    this.inherited(arguments);

    this.audiosCache = {};

    this.audios = dojo.map(this.node.audios, function(audio, idx) {
      this.audiosCache[audio.id] = audio = dojo.mixin(audio, {
        index : idx
      });
      return audio;
    }, this);

    this.placements = [
      [
        'AudioPlayer',
        { node : this.node },
        'audioPlayer',
        'replace'
      ],

      [
        'ImageGallery',
        { node : this.node },
        'imageGallery'
      ],

      [
        'ImageDetail',
        { node : this.node },
        'detail',
        'replace'
      ],

      [
        'ChildNodes',
        { node : this.node },
        'childNodes',
        'replace'
      ],

      [
        'AudioCaption',
        { node : this.node },
        'audioCaption'
      ],

      [
        'BodyText',
        { node : this.node },
        'bodyText'
      ],

      [
        'ImageCaption',
        { node : this.node },
        'imageCaption'
      ]
    ];

    if (this.node.audios.length > 1) {
      this.placements.push([
        'AudioList',
        { node : this.node },
        'audioList'
      ]);
    } else {
      dojo.destroy(this.audioList);
    }
  },

  postCreate : function() {
    this.inherited(arguments);

    this.connect(this.audioList, 'onSelect', function(assetId) {
      var audio = this._audioById(assetId);
      this.audioPlayer.play(assetId);
      this.audioCaption.set('content', audio.caption || '');
      dojo.publish('/content/update');
    });

    if (this.audioPlayer.useHtml5Player) {
      // we need to hide the player when in full-screen image gallery mode
      this.subscribe('/ImageGalleryPage/detail/show', 'togglePlayer');
      this.subscribe('/ImageGalleryPage/detail/hide', 'togglePlayer');
    }
  },

  _audioById : function(assetId) {
    return this.audiosCache[assetId] || false;
  },

  _setup : function() {
    this._imageGalleryPageSetup({
      gallery : this.imageGallery,
      caption : this.imageCaption,
      fullScreen : this.detail
    });
  },

  init : function(pageState) {
    if (!pageState.assetId || pageState.assetType !== 'audios') { return; }

    var audioId = pageState.assetId,
        audio = this._audioById(audioId);

    if (this.audioList) {
      this.audioList.set('currentAsset', audioId);
    }

    if (this.audioCaption) {
      this.audioCaption.set('content', audio.caption || '');
    }

    this.audioPlayer.set('mediaId', audioId);
  },

  togglePlayer : function() {
    this.audioPlayer.toggle();
  }
});

}

if(!dojo._hasResource['toura._AsyncView']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura._AsyncView'] = true;
dojo.provide('toura._AsyncView');

dojo.declare('toura._AsyncView', [], {
  postMixInProperties : function() {
    this.inherited(arguments);
    this.queue = [];
  },

  _addToQueue : function(fn) {
    this.queue.push(fn);
  },

  _doQueue : function() {
    dojo.forEach(this.queue, function(fn) {
      fn();
    }, this);
  }
});


}

if(!dojo._hasResource["dijit.DialogUnderlay"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.DialogUnderlay"] = true;
dojo.provide("dijit.DialogUnderlay");





dojo.declare(
	"dijit.DialogUnderlay",
	[dijit._Widget, dijit._Templated],
	{
		// summary:
		//		The component that blocks the screen behind a `dijit.Dialog`
		//
		// description:
		// 		A component used to block input behind a `dijit.Dialog`. Only a single
		//		instance of this widget is created by `dijit.Dialog`, and saved as
		//		a reference to be shared between all Dialogs as `dijit._underlay`
		//
		//		The underlay itself can be styled based on and id:
		//	|	#myDialog_underlay { background-color:red; }
		//
		//		In the case of `dijit.Dialog`, this id is based on the id of the Dialog,
		//		suffixed with _underlay.

		// Template has two divs; outer div is used for fade-in/fade-out, and also to hold background iframe.
		// Inner div has opacity specified in CSS file.
		templateString: "<div class='dijitDialogUnderlayWrapper'><div class='dijitDialogUnderlay' dojoAttachPoint='node'></div></div>",

		// Parameters on creation or updatable later

		// dialogId: String
		//		Id of the dialog.... DialogUnderlay's id is based on this id
		dialogId: "",

		// class: String
		//		This class name is used on the DialogUnderlay node, in addition to dijitDialogUnderlay
		"class": "",

		attributeMap: { id: "domNode" },

		_setDialogIdAttr: function(id){
			dojo.attr(this.node, "id", id + "_underlay");
			this._set("dialogId", id);
		},

		_setClassAttr: function(clazz){
			this.node.className = "dijitDialogUnderlay " + clazz;
			this._set("class", clazz);
		},

		postCreate: function(){
			// summary:
			//		Append the underlay to the body
			dojo.body().appendChild(this.domNode);
		},

		layout: function(){
			// summary:
			//		Sets the background to the size of the viewport
			//
			// description:
			//		Sets the background to the size of the viewport (rather than the size
			//		of the document) since we need to cover the whole browser window, even
			//		if the document is only a few lines long.
			// tags:
			//		private

			var is = this.node.style,
				os = this.domNode.style;

			// hide the background temporarily, so that the background itself isn't
			// causing scrollbars to appear (might happen when user shrinks browser
			// window and then we are called to resize)
			os.display = "none";

			// then resize and show
			var viewport = dojo.window.getBox();
			os.top = viewport.t + "px";
			os.left = viewport.l + "px";
			is.width = viewport.w + "px";
			is.height = viewport.h + "px";
			os.display = "block";
		},

		show: function(){
			// summary:
			//		Show the dialog underlay
			this.domNode.style.display = "block";
			this.layout();
			this.bgIframe = new dijit.BackgroundIframe(this.domNode);
		},

		hide: function(){
			// summary:
			//		Hides the dialog underlay
			this.bgIframe.destroy();
			delete this.bgIframe;
			this.domNode.style.display = "none";
		}
	}
);

}

if(!dojo._hasResource['toura.components.GoogleMap']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components.GoogleMap'] = true;
dojo.provide('toura.components.GoogleMap');









(function (dojo) {
  var callbackUuid = 0;

  // Google Maps API v3 reference:
  // https://code.google.com/apis/maps/documentation/javascript/reference.html

  dojo.declare('toura.components.GoogleMap', [ toura.components._Component, toura._AsyncView ], {
    templateString : dojo.cache("toura.components", "GoogleMap/GoogleMap.haml", ".component.google-map\n  .map{ dojoAttachPoint : 'mapNode' }\n"),

    mapType : 'roadmap',
    apiURL : toura.app.URL.protocol() + '://maps.google.com/maps/api/js?v=3.4&sensor=false&callback=',

    prepareData : function() {
      // TODO: different behavior if the network isn't reachable?

      this.googleTries = 0;
      this.pinCache = {};
      this.markerCache = {};
      this.queue = [];
      this.isBuilt = false;

      this.pins = this.node.googleMapPins;

      dojo.forEach(this.pins, function(pin) {
        this.pinCache[pin.id] = pin;
      }, this);
    },

    // this intentionally still uses postcreate rather than a _Component
    // lifecycle method
    postCreate : function () {
      this.inherited(arguments);

      // The script that gets loaded here injects its own additional
      // scripts to the page, so we need to use a slightly custom callback mechanism
      this.callbackName = 'GoogleMapCallback' + (++callbackUuid);
      window[this.callbackName] = dojo.hitch(this, '_buildMap');
      dojo.io.script.get({ url: this.apiURL + this.callbackName });
    },

    _buildMap : function () {
      delete window[this.callbackName];

      this.map = new google.maps.Map(this.mapNode, {
        mapTypeId: this.mapType,
        streetViewControl : false,
        mapTypeControl : false,
        zoom : 0,
        zoomControl : true,
        zoomControlOptions : {
          position: google.maps.ControlPosition.TOP_RIGHT
        }
      });

      var bounds = new google.maps.LatLngBounds();

      this.markers = dojo.map(this.pins || [], function (pin) {
        var position = new google.maps.LatLng(pin.lat, pin.lon),
            marker = new google.maps.Marker({
              map: this.map,
              position: position,
              title: pin.name
            });

        google.maps.event.addListener(
          marker,
          'click',
          dojo.hitch(this, '_showInfo', marker, pin)
        );

        bounds.extend(position);

        this.markerCache[pin.id] = marker;

        return marker;
      }, this);

      if (this.pins.length > 1) {
        this.map.fitBounds(bounds);
      } else {
        if (this.pins[0]) {
          this.map.setCenter(new google.maps.LatLng(this.pins[0].lat, this.pins[0].lon));
          this.map.setZoom(15);
        }
      }

      this.isBuilt = true;
      this._doQueue();
      this.onMapBuilt();
    },

    _showInfo : function (/** google.maps.Marker */ marker, /** toura.models.GoogleMapPin */ pin) {
      var infoWindow;

      if (this.tablet) {
        infoWindow = new google.maps.InfoWindow({
          content : this.pinInfo.domNode
        });

        infoWindow.open(this.map, marker);
      }

      this.onShowInfo(pin);
    },

    onShowInfo : function(pin) {
      // stub
    },

    onMapBuilt : function() {
      // stub
    },

    _setCenterAttr : function(center) {
      center = new google.maps.LatLng(center.lat, center.lng);
      this.map.setCenter(center);
      this.map.setZoom(15);
    },

    _setPinAttr : function(pinId) {
      if (!pinId) { return; }

      if (!this.isBuilt) {
        // stage stuff to run once map is built
        this._addToQueue(dojo.hitch(this, 'set', 'pin', pinId));
        return;
      }

      var marker = this.markerCache[pinId],
          pin = this.pinCache[pinId],
          newCenter = new google.maps.LatLng(pin.lat, pin.lon);

      this.map.panTo(newCenter);
      this._showInfo(marker, pin);
      this.pin = pin;
    },

    teardown : function () {
      if (window.google && window.google.maps && window.google.maps.event) {
        dojo.forEach(this.markers, function (marker) {
          google.maps.event.clearInstanceListeners(marker);
          marker.setMap(null);
        });

        google.maps.event.clearInstanceListeners(this.map);
      }
    }
  });
}(dojo));

}

if(!dojo._hasResource['toura.components.PinCaption']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components.PinCaption'] = true;
dojo.provide('toura.components.PinCaption');



dojo.declare('toura.components.PinCaption', [ toura.components.BodyText ], {
  "class" : 'pin-caption',

  _getBodyText : function() {
    return this.caption || this.inherited(arguments);
  }
});


}

if(!dojo._hasResource['toura.components.PinInfo']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components.PinInfo'] = true;
dojo.provide('toura.components.PinInfo');







dojo.declare('toura.components.PinInfo', [ toura.components._Component ], {
  templateString : dojo.cache("toura.components", "PinInfo/PinInfo.haml", ".component.pin-info\n  .header{ dojoAttachPoint : 'nav' }\n\n  .body\n    %a.directions{ dojoAttachPoint : 'directionsNode', target : '_blank' }= i18n_directions\n    %a.phone-number{ dojoAttachPoint : 'phoneNumberContainerNode' }\n      %span.label= i18n_phone\n      %span{ dojoAttachPoint : 'phoneNumberNode' }\n    %a.website{ dojoAttachPoint : 'websiteContainerNode' }= i18n_website\n\n    .bottom\n      :if phone\n        %div{ dojoType : 'toura.ui.Scrollable', dojoAttachPoint : 'scroller' }\n          %section\n            %header\n              %h2{ dojoAttachPoint : 'nameNode' }\n              %p{ dojoAttachPoint : 'addressNode' }\n            %div{ dojoAttachPoint : 'captionNode' }\n\n      :if tablet\n        %section\n          %header\n            %h2{ dojoAttachPoint : 'nameNode' }\n            %p{ dojoAttachPoint : 'addressNode' }\n          %div{ dojoAttachPoint : 'captionNode' }\n"),
  widgetsInTemplate : true,

  setupChildComponents : function() {
    if (this.scroller) {
      this.scroller.makeScroller();
    }

    this.captionNode = this.adopt(toura.components.PinCaption).placeAt(this.captionNode, 'replace');
    this.detailTitle = this.phone ? this.adopt(toura.components.DetailTitle).placeAt(this.nav, 'replace') : null;
  },

  setupConnections : function() {
    if (this.detailTitle) {
      this.connect(this.detailTitle, 'onClose', '_onClose');
    }

    this.connect(this.websiteContainerNode, 'click', function(e) {
      e.preventDefault();
      toura.app.Phonegap.browser.url(dojo.attr(this.websiteContainerNode, 'data-url'));
    });
  },

  _onClose : function() {
    this.onClose();
  },

  onClose : function() {
    // stub
  },

  _setPinAttr : function(pin) {
    // setting these props triggers the attribute mapping
    if (!pin) { return; }

    this.set('pinName', pin.name);
    this.set('address', pin.address);
    this.set('directionsUrl', toura.app.URL.googleMapAddress(pin.address));
    this.set('phoneNumber', pin.phoneNumber);
    this.set('website', pin.website);

    this.captionNode.set('content', pin.caption || '');

    if (this.detailTitle) {
      this.detailTitle.set('screenTitle', pin.name);
    }

    if (this.scroller) {
      this.scroller.refreshScroller();
    }
  },

  _setPhoneNumberAttr : function(phone) {
    if (!phone) {
      this.hide(this.phoneNumberContainerNode);
      return;
    }

    this.show(this.phoneNumberContainerNode);
    this.phoneNumberNode.innerHTML = phone;
    dojo.attr(this.phoneNumberContainerNode, 'href', toura.app.URL.tel(phone));
  },

  _setWebsiteAttr : function(website) {
    if (!website) {
      this.hide(this.websiteContainerNode);
      return;
    }

    this.show(this.websiteContainerNode);
    dojo.attr(this.websiteContainerNode, 'data-url', website);
  },

  // wires up attachPoints for attribute binding
  attributeMap : {
    pinName : {
      node : 'nameNode',
      type : 'innerHTML'
    },

    address : {
      node : 'addressNode',
      type : 'innerHTML'
    },

    directionsUrl : {
      node : 'directionsNode',
      type : 'attribute',
      attribute : 'href'
    }
  },

  initializeStrings : function() {
    this.i18n_directions = this.getString('DIRECTIONS');
    this.i18n_phone = this.getString('PHONE');
    this.i18n_website = this.getString('WEBSITE');
  }
});

}

if(!dojo._hasResource['toura.pageControllers.node.GoogleMap1']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.pageControllers.node.GoogleMap1'] = true;
dojo.provide('toura.pageControllers.node.GoogleMap1');







dojo.declare('toura.pageControllers.node.GoogleMap1', [ toura.pageControllers.node._Node, toura._AsyncView ], {
  templateString : dojo.cache("toura.pageControllers.node", "GoogleMap1/GoogleMap1.haml", "%li.page.google-map-1\n  :if phone\n    .detail{ dojoAttachPoint : 'detail' }\n\n  .index\n\n    .header{ dojoAttachPoint : 'pageNav' }\n    .body{ dojoAttachPoint : 'body' }\n"),

  postCreate: function () {
    toura.app.Phonegap.network.isReachable('maps.google.com')
      .then(dojo.hitch(this, '_postCreate'));

    toura.app.UI.set('siblingNavVisible', false);
    this.inherited(arguments);
  },

  _postCreate : function(reachable) {
    if (!reachable) {
      this.failure = 'No internet connection found.';
      return;
    }

    var components = toura.components;

    this.googleMap = this.adopt(components.GoogleMap, {
      node : this.node
    }).placeAt(this.body, 'replace');

    this.pinInfo = this.adopt(components.PinInfo, {});

    if (this.phone) {
      // put the pin info on the page
      this.pinInfo.placeAt(this.detail);
    } else {
      // just pass the widget to the map widget to use
      this.googleMap.set('pinInfo', this.pinInfo);
    }

    this.connect(this.googleMap, 'onShowInfo', function(pin) {
      if (this.phone) { dojo.addClass(this.detail, 'active'); }
      this.pinInfo.set('pin', pin);
    });

    this.connect(this.pinInfo, 'onClose', function() {
      if (this.phone) { dojo.removeClass(this.detail, 'active'); }
    });

    this._doQueue();
  },

  _setPin : function(pin) {
    this.googleMap.set('pin', pin);
  },

  init : function(pageState) {
    if (!pageState.assetId) { return; }

    if (!this.googleMap) {
      this._addToQueue(dojo.hitch(this, 'init', pageState));
      return;
    }

    // set the pin if one is indicated in the URL
    this._setPin(pageState.assetId);
    this.inherited(arguments);
  }
});


}

if(!dojo._hasResource['toura.components.VideoList']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components.VideoList'] = true;
dojo.provide('toura.components.VideoList');



dojo.declare('toura.components.VideoList', [ toura.components.AssetList ], {
  "class" : 'video-list',

  postMixInProperties : function() {
    this.assets = this.node.videos || [];
    this.inherited(arguments);
  }
});


}

if(!dojo._hasResource['toura.components.VideoPlayer']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components.VideoPlayer'] = true;
dojo.provide('toura.components.VideoPlayer');




dojo.declare('toura.components.VideoPlayer', [ toura.components._MediaPlayer ], {
  templateString : dojo.cache("toura.components", "VideoPlayer/VideoPlayer.haml", ".component.video-player\n  :if !useHtml5Player\n    .fake-video\n      .play-button{ dojoAttachPoint : 'playButton' }\n      %img.poster{ src : poster, dojoAttachPoint : \"videoPlaceholder\" }\n\n  :if useHtml5Player\n    .overlay{ dojoAttachPoint : 'overlay' }\n"),

  playerType : 'video',
  defaultPoster : './icons/video-poster.png',
  aspectRatio : 3/4,

  playerSettings : {
    controls : true
  },

  prepareData : function() {
    this.medias = this.node.videos || [];
    this.inherited(arguments);

    if (this.useHtml5Player && this.media.poster) {
      this.playerSettings = dojo.mixin(this.playerSettings, {
        poster : this.media.poster
      });
    }

    if (!this.useHtml5Player) {
      this.poster = this.media.poster || this.defaultPoster;
    }
  },

  setupConnections : function() {
    this.inherited(arguments);

    if (this.useHtml5Player) { return; }

    this.connect(this.videoPlaceholder, 'click', '_play');

    this.connect(this.playButton, 'click', '_play');
  },

  startup : function() {
    if (this.useHtml5Player) {
      toura.util.copyStyles(this.player, this.overlay, [ 'width', 'height' ]);
    }
  },

  _play : function(media) {
    this.inherited(arguments);

    if (this.useHtml5Player) { return; }

    toura.app.Phonegap.browser.url(this.media.url);
  },

  _setMediaIdAttr : function(mediaId) {
    this.inherited(arguments);

    this.set('poster', this.media.poster);
  },

  _setPosterAttr : function(poster) {
    if (!this.useHtml5Player) {
      var width = toura.app.UI.viewport.width;

      this.videoPlaceholder.width = width;
      this.videoPlaceholder.src = poster || this.defaultPoster;

      dojo.style(this.playButton, {
        'width': width + 'px',
        'height': Math.floor(width * this.aspectRatio) + 'px'
      });

      return;
    }

    if (this.player) {
      this.player.poster = poster || '';
    }
  }
});

}

if(!dojo._hasResource['toura.components.VideoCaption']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components.VideoCaption'] = true;
dojo.provide('toura.components.VideoCaption');



dojo.declare('toura.components.VideoCaption', [ toura.components.BodyText ], {
  "class" : 'video-caption',

  _getBodyText : function() {
    if (!this.node || !this.node.videos) { return ''; }
    return this.node.videos[0] ? (this.node.videos[0].caption || '') : '';
  }
});



}

if(!dojo._hasResource['toura.pageControllers.node.Videos1']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.pageControllers.node.Videos1'] = true;
dojo.provide('toura.pageControllers.node.Videos1');









dojo.declare('toura.pageControllers.node.Videos1', [ toura.pageControllers.node._Node ], {
  templateString : dojo.cache("toura.pageControllers.node", "Videos1/Videos1.haml", "%li.page.videos-1\n  .screen.index\n    .header{ dojoAttachPoint : 'pageNav' }\n\n    .body\n      .top\n        .content{ dojoAttachPoint : 'videoPlayer' }\n\n      .bottom\n        :if phone\n          %div{ dojoType : 'toura.ui.Scrollable' }\n            %div\n              .video-list{ dojoAttachPoint : 'videoList' }\n              .child-nodes{ dojoAttachPoint : 'childNodes' }\n              .body-text{ dojoAttachPoint : 'videoCaption' }\n              .body-text{ dojoAttachPoint : 'bodyText' }\n\n        :if tablet\n          .col-1\n            %div{ dojoType : 'toura.ui.Scrollable' }\n              %div\n                .body-text{ dojoAttachPoint : 'videoCaption' }\n                .body-text{ dojoAttachPoint : 'bodyText' }\n\n\n          .col-2\n            %div{ dojoType : 'toura.ui.Scrollable' }\n              %div\n                .video-list{ dojoAttachPoint : 'videoList' }\n                .child-nodes{ dojoAttachPoint : 'childNodes' }\n\n"),

  postMixInProperties : function() {
    this.inherited(arguments);

    this.videosCache = {};

    this.videos = dojo.map(this.node.videos, function(video, idx) {
      this.videosCache[video.id] = video = dojo.mixin(video, {
        index : idx
      });
      return video;
    }, this);

    this.placements = [
      [
        'BodyText',
        { node : this.node },
        'bodyText'
      ],
      [
        'VideoCaption',
        { node : this.node },
        'videoCaption'
      ],
      [
        'ChildNodes',
        { node : this.node },
        'childNodes'
      ],
      [
        'VideoPlayer',
        { node : this.node },
        'videoPlayer'
      ]
    ];

    if (this.node.videos.length > 1) {
      this.placements.push([
        'VideoList',
        { node : this.node },
        'videoList'
      ]);
    } else {
      dojo.destroy(this.videoList);
    }
  },

  postCreate : function() {
    this.inherited(arguments);

    this.connect(this.videoList, 'onSelect', function(assetId) {
      var video = this._videoById(assetId);
      this.videoCaption.set('content', video.caption || '');
      this.videoPlayer.play(assetId);
      dojo.publish('/content/update');
    });

    if (this.videoPlayer.useHtml5Player) {
      // we need to hide the video when the more drawer shows :(
      this.subscribe('/MoreDrawer/show', dojo.hitch(this.videoPlayer, 'disable'));
      this.subscribe('/MoreDrawer/hide', dojo.hitch(this.videoPlayer, 'enable'));
    }
  },

  init : function(pageState) {
    if (!pageState.assetId || pageState.assetType !== 'videos') { return; }

    var videoId = pageState.assetId,
        video = this._videoById(videoId);

    if (this.videoList) {
      this.videoList.set('currentAsset', videoId);
    }

    this.videoPlayer.set('mediaId', videoId);
    this.videoCaption.set('content', video.caption || '');
  },

  _videoById : function(assetId) {
    return this.videosCache[assetId] || false;
  }

});

}

if(!dojo._hasResource['toura.containers._LayoutBox']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.containers._LayoutBox'] = true;
dojo.provide('toura.containers._LayoutBox');




dojo.declare('toura.containers._LayoutBox', [ toura._View, toura.ui.BackgroundImage ], {
  templateString : '<div class=layout-box></div>',

  defaultConfig : {
    containerType : 'row', // row || columns || component
    layout : 'normal', // normal | overlay
    size : 'flex', // flex || fixed || full
    scrollable : false
  },

  postMixInProperties : function() {
    // use the default config, but override with any settings that get passed in
    this.config = dojo.mixin(dojo.mixin({}, this.defaultConfig), this.config);
  },

  postCreate : function() {
    this.inherited(arguments);

    var classNames = [
      this.config.containerType + '-container',
      'size-' + this.config.size,
      'layout-' + this.config.layout
    ];

    if (this.config.className) {
      classNames.push(this.config.className);
    }

    this.addClass(classNames);

    if (this.config.backgroundImage && this.backgroundImage) {
      this.loadImage();
    }
  }

});


}

if(!dojo._hasResource['toura.containers.Region']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.containers.Region'] = true;
dojo.provide('toura.containers.Region');




dojo.declare('toura.containers.Region', [ toura.containers._LayoutBox ], {
  templateString : dojo.cache("toura.containers", "Region/Region.haml", ".region\n  .pane{ dojoAttachPoint : 'pane' }\n    .inner{ dojoAttachPoint : 'inner' }\n"),
  config : {},
  _scroller : null,

  postCreate : function() {
    this.inherited(arguments);

    this._placeComponents();
    this._placeRegions();
    this._setupScroller();

    this.addClass(this.boxType);
    this.connect(this.screen, 'startup', 'startup');
  },

  _setupScroller : function() {
    if (this.config.scrollable) {
      this._scroller = new toura.ui.Scrollable({}, this.pane);
    }
  },

  /*
   * Depending on some parameters from the region definition in templates.json,
   * components need to be placed differently in order to get the correct dom
   * structure.
   *
   * Rules:
   *
   * The default placement is to replace the .pane elemement with the component.
   * We don't want the extra dom by placing in .inner
   * BUG: If you place multiple components, only the last component will end up
   * in the dom.
   *
   * If the region has scrollable=true, place the component into the .inner div
   * because iScroll needs that extra wrapper div
   *
   * If containerType==component, place the component directly into .region. We
   * don't need any of the extra container elements because we want the region to
   * take the size of the component itself (used for stuff like PageNav
   */
  _placeComponents : function() {
    // TODO: There is probably a clearer way to get the results we need
    var placement = this.containerType === 'component' ? [this.domNode, 'replace'] :
                    this.config.scrollable ? [this.inner, 'last'] :
                    [this.pane, 'replace'] ;

    if (
      this.config.components &&
      this.config.components.length > 1 &&
      placement[0] === this.pane
    ) {
      console.error("WARNING: you're trying to place more than one component into a non-scrollable region. this will end badly.");
    }

    if (this.config.components && this.config.components.length) {
      dojo.forEach(this.config.components, function(componentName) {

        // don't create page nav on home node pages
        if (
          componentName === 'PageNav' &&
          this.baseObj.id === toura.app.Config.get('app').homeNodeId
        ) { return; }

        var klass = componentName.match(/^custom\./) ?
                    client.components[componentName.replace(/^custom\./, '')] :
                    toura.components[componentName];

        var c = this.adopt(klass, {
          baseObj : this.baseObj,
          page : this.page,
          node : this.baseObj,
          device : this.device,
          screen : this.screen,
          region : this
        });

        c.placeAt(placement[0], placement[1]);
      }, this);
    }
  },

  _placeRegions : function() {
    if (this.config.regions && this.config.regions.length) {
      // if we're placing regions, we don't need the pane div
      dojo.destroy(this.pane);

      dojo.forEach(this.config.regions, function(region) {
        this.adopt(toura.containers.Region, {
          config : region,
          baseObj : this.baseObj,
          device : this.device,
          screen : this.screen,
          backgroundImage : this.backgroundImage,
          boxType : this.config.containerType
        }).placeAt(this.domNode);
      }, this);
    }
  },

  refreshScroller : function() {
    if (this._scroller) {
      this._scroller.refreshScroller();
    }
  }

});


}

if(!dojo._hasResource['toura.containers.Screen']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.containers.Screen'] = true;
dojo.provide('toura.containers.Screen');




dojo.declare('toura.containers.Screen', [ toura.containers._LayoutBox ], {
  templateString : dojo.cache("toura.containers", "Screen/Screen.haml", ".screen\n"),
  components : {},

  postCreate : function() {
    this.inherited(arguments);

    this.addClass(this.config.name);

    // TODO: remove this
    if (this.config.layoutName) {
      this.addClass(this.config.layoutName);
    }

    if (this.config.regions) {
      this.regions = dojo.map(this.config.regions, function(region) {
        return this.adopt(toura.containers.Region, {
          page : this.page,
          config : region,
          baseObj : this.baseObj,
          device : this.device,
          screen : this,
          backgroundImage : this.backgroundImage,
          boxType : this.config.containerType
        }).placeAt(this.domNode);
      }, this);
    }
  },

  registerComponent : function(c) {
    var componentName = c.declaredClass
                          .replace('toura.components.', '')
                          .replace('client.components.', 'custom.');
    this.components[componentName] = c;
  },

  getComponent : function(n) {
    return this.components[n];
  }
});

}

if(!dojo._hasResource['toura.components.buttons.AboutButton']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components.buttons.AboutButton'] = true;
dojo.provide('toura.components.buttons.AboutButton');



dojo.declare('toura.components.buttons.AboutButton', [ toura.components.buttons._Button ], {
  "class" : 'about',

  prepareData : function() {
    this.url = toura.app.URL.about();
  },

  initializeStrings : function() {
    this.i18n_text = this.getString('ABOUT');
  }
});

dojo.mixin(toura.components.buttons.AboutButton, {
  isAvailable : function() {
    var appConfig = toura.app.Config.get('app');
    return appConfig.aboutEnabled && !!appConfig.aboutNodeId;
  }
});


}

if(!dojo._hasResource['toura.components.buttons.MapsButton']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components.buttons.MapsButton'] = true;
dojo.provide('toura.components.buttons.MapsButton');



dojo.declare('toura.components.buttons.MapsButton', [ toura.components.buttons._Button ], {
  "class" : 'maps',

  prepareData : function() {
    this.url = toura.app.URL.maps();
  },

  initializeStrings : function() {
    this.i18n_text = this.getString('MAPS');
  }
});

dojo.mixin(toura.components.buttons.MapsButton, {
  isAvailable : function() {
    var appConfig = toura.app.Config.get('app');
    return appConfig.mapsEnabled && !!appConfig.mapNodeId;
  }
});

}

if(!dojo._hasResource['toura.components.buttons.FavoritesButton']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components.buttons.FavoritesButton'] = true;
dojo.provide('toura.components.buttons.FavoritesButton');




dojo.declare('toura.components.buttons.FavoritesButton', [ toura.components.buttons._Button ], {
  "class" : 'favorites',

  prepareData : function() {
    this.url = toura.app.URL.favorites();
  },

  initializeStrings : function() {
    this.i18n_text = this.getString('FAVORITES');
  }
});

dojo.mixin(toura.components.buttons.FavoritesButton, {
  isAvailable : function() {
    return toura.features.favorites;
  }
});

}

if(!dojo._hasResource['toura.components.AppNav']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components.AppNav'] = true;
dojo.provide('toura.components.AppNav');







dojo.declare('toura.components.AppNav', [ toura.components._Component ], {
  templateString : dojo.cache("toura.components", "AppNav/AppNav.haml", "%nav.component.app-nav\n  %ol{ dojoAttachPoint : 'buttonList' }\n"),
  widgetsInTemplate : true,
  handleClicks : true,

  setupChildComponents : function() {
    var buttons = [
      toura.components.buttons.SearchButton,
      toura.components.buttons.AboutButton,
      toura.components.buttons.MapsButton,
      toura.components.buttons.FavoritesButton
    ];

    dojo.forEach(buttons, function(btn) {
      if ((btn.isAvailable && btn.isAvailable()) || !btn.isAvailable) {
        var li = dojo.create('li');
        this.adopt(btn).placeAt(li);
        dojo.place(li, this.buttonList, 'last');
      }
    }, this);
  }
});

}

if(!dojo._hasResource['toura.components.ChildNodeGrid']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components.ChildNodeGrid'] = true;
dojo.provide('toura.components.ChildNodeGrid');



dojo.declare('toura.components.ChildNodeGrid', [ toura.components._Component ], {
  templateString : dojo.cache("toura.components", "ChildNodeGrid/ChildNodeGrid.haml", "%ul.component.child-node-grid\n  :each c in children\n    %li\n      %a{ href : c.url }\n        :if tablet\n          .image{ dojoType : 'toura.ui.BackgroundImage', imageUrl : c.featuredImage.large.url, imageWidth : 370, imageHeight : 277, loadOnInit: true }\n        :if phone\n          .image{ dojoType : 'toura.ui.BackgroundImage', imageUrl : c.featuredImage.small.url, imageWidth : 145, imageHeight : 109, loadOnInit: true }\n        %h3= c.name\n"),
  widgetsInTemplate : true,

  prepareData : function() {
    this.node.populateChildren();
    // TODO: MAP should enforce this restraint
    this.children = dojo.filter(this.node.children || [], function(child) {
      return child.featuredImage !== undefined;
    });

    if (this.tablet) {
      var num = this.children.length,
          size = num > 11 ? 'medium' : 'large';

      this['class'] = 'size-' + size;
    }

    if (this.device.os !== 'android') { return ; }
    if (toura.components.ChildNodeGrid.placedCSS) { return; }

    var tpl = dojo.cache("toura.components.ChildNodeGrid", "child-node-grid.css.tpl", "<style id=\"component-css-child-node-grid\">\n\n  .android.phone .child-node-grid li {\n    height: ${height}px;\n    width: ${width}px;\n  }\n\n  .android.phone .child-node-grid li h3 {\n    height: 2.5em;\n    overflow: hidden;\n  }\n\n  .android.phone .child-node-grid li .image {\n    width: ${width}px;\n    height: ${imageHeight}px;\n  }\n\n</style>\n"),
        aspectRatio = 3/4,
        width = Math.floor(toura.app.UI.viewport.width / 2 - 18),
        height = Math.floor(width * aspectRatio * 1.40),
        imageHeight = width * aspectRatio,
        css = dojo.string.substitute(tpl, {
          width : width,
          height : height,
          imageHeight : imageHeight
        });

    dojo.place(css, document.querySelector('head'));
    toura.components.ChildNodeGrid.placedCSS = true;
  }
});

}

if(!dojo._hasResource['toura.components.HeaderImage']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components.HeaderImage'] = true;
dojo.provide('toura.components.HeaderImage');



dojo.declare('toura.components.HeaderImage', [ toura.components._Component ], {
  templateString : dojo.cache("toura.components", "HeaderImage/HeaderImage.haml", ".component.header-image\n  :if viewImage\n    %img{ src : viewImage.url, width : viewImage.width, height : viewImage.height, dojoAttachPoint : 'imageNode' }\n"),

  prepareData : function() {
    this.inherited(arguments);

    var deviceType = this.device.type,
        imageType = this.phone ? 'gallery' : 'original';

    if (this.node.headerImage && this.node.headerImage[deviceType]) {
      this.image = this.node.headerImage[deviceType][imageType];

      // create a fresh object
      this.viewImage = dojo.mixin({}, this.image);
    } else {
      this.viewImage = false;
    }
  },

  setupConnections : function() {
    if (!this.image) { return; }

    var origImage = this.node.headerImage[this.device.type];

    if (origImage.destination) {
      this.connect(this.domNode, 'click', function() {
        toura.app.Phonegap.browser.url(origImage.destination);
      });
    }
  },

  setupSubscriptions : function() {
    this.subscribe('/window/resize', '_resizeImage');
  },

  teardown : function() {
    dojo.destroy(this.domNode);
  },

  resizeElements : function() {
    if (!this.viewImage) {
      this.destroy();
      return;
    }

    this._resizeImage();
  },

  _resizeImage : function() {
    if (!this.imageNode) { return; }
    dojo.attr(this.imageNode, this._calculateDimensions());
  },

  _calculateDimensions : function() {
    var w = this._getWidth(),
        img = this.image;

    return {
      width : img ? w : 0,
      height : img ? Math.ceil(img.height * (w / img.width)) : 0
    };
  },

  _getWidth : function() {
    return this.getDimensions().width;
  }
});


}

if(!dojo._hasResource['toura.components.ColumnHeaderImage']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components.ColumnHeaderImage'] = true;
dojo.provide('toura.components.ColumnHeaderImage');



dojo.declare('toura.components.ColumnHeaderImage', [ toura.components.HeaderImage ], {
  "class" : 'column-header-image'
});

}

if(!dojo._hasResource['toura.components.DropDownText']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components.DropDownText'] = true;
dojo.provide('toura.components.DropDownText');



dojo.declare('toura.components.DropDownText', [ toura.components.BodyText ], {
  templateString : dojo.cache("toura.components", "DropDownText/DropDownText.haml", ".component.drop-down-text\n  .open-wrapper{ dojoAttachPoint : 'openButton' }\n    .button.open\n      %span=i18n_instructions\n\n  .text-wrapper{ dojoAttachPoint : 'textWrapper' }\n    .body-text-container{ dojoAttachPoint : 'bodyTextContainer' }= bodyText\n    .button.close{ dojoAttachPoint : 'closeButton' }\n      %span=i18n_close\n\n"),
  adjustMarkup : function() {
    this.hide(this.textWrapper);
  },

  initializeStrings : function() {
    this.i18n_close = this.getString('CLOSE');
    this.i18n_instructions = this.getString('INSTRUCTIONS');
  },

  setupConnections : function() {
    this.connect(this.openButton, 'click', function() {
      this.hide(this.openButton);
      this.show(this.textWrapper);
    });

    this.connect(this.textWrapper, 'click', function() {
      this.hide(this.textWrapper);
      this.show(this.openButton);
    });
  }
});

}

if(!dojo._hasResource['toura.components.FeedItemDetail']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components.FeedItemDetail'] = true;
dojo.provide('toura.components.FeedItemDetail');




dojo.declare('toura.components.FeedItemDetail', [ toura.components._Component ], {
  templateString : dojo.cache("toura.components", "FeedItemDetail/FeedItemDetail.haml", ".component.feed-item-detail\n  %article{ dojoAttachPoint : 'content' }\n  %a.full{ dojoAttachPoint : 'externalLink' }= i18n_viewOriginal\n"),
  itemTemplate : Haml(dojo.cache("toura.components", "FeedItemDetail/Item.haml", ":if image\n  .image{ style: 'background-image: url(' + image.url + ')' }\n\n.date= pubDate\n\n%h2= title\n.item-body{ dojoAttachPoint : 'itemBody' }= body\n")),

  prepareData : function() {
    this.item = this.node;
  },

  setupConnections : function() {
    this.connect(this.externalLink, 'click', function(e) {
      e.preventDefault();
      toura.app.Phonegap.browser.url(this.item.link);
    });
  },

  initializeStrings : function() {
    this.i18n_viewOriginal = this.getString('FEED_VIEW_ORIGINAL');
  },

  _setItemAttr : function(feedItem) {
    if (feedItem.type !== 'feedItem') { return; }

    this.item = feedItem;

    dojo.empty(this.content);

    dojo.place(this.itemTemplate(
      dojo.delegate(this.item, {
        pubDate : dojo.date.locale.format(this.item.pubDate),
        i18n_viewOriginal : this.i18n_viewOriginal
      })
    ), this.content);

    dojo.attr(this.externalLink, 'href', this.item.link);

    this._setupLinks();

    if (this.region) {
      this.region.refreshScroller();
    }
  },

  _setupLinks : function() {
    dojo.forEach(this.domNode.querySelectorAll('.content a'), function(link) {
      dojo.attr(link, 'target', '_blank');
    }, this);
  }
});


}

if(!dojo._hasResource['toura.components.FeedItemList']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components.FeedItemList'] = true;
dojo.provide('toura.components.FeedItemList');





dojo.declare('toura.components.FeedItemList', [ toura.components._Component ], {
  templateString : dojo.cache("toura.components", "FeedItemList/FeedItemList.haml", ".component.feed-item-list\n  %header\n    .updated\n      %span Last Updated:\n      %span{ dojoAttachPoint : 'lastUpdated' }\n    .refresh{ dojoAttachPoint : 'refreshButton' }= i18n_feedRefresh\n    .spinner\n\n  %ol{ dojoAttachPoint : 'feedItemList' }\n\n"),
  itemTemplate : Haml(dojo.cache("toura.components", "FeedItemList/FeedItem.haml", "%li{ data-index : index }\n  %div\n    :if image\n      .image{ style: 'background: url(' + image.url + ')' }\n\n    %h2= title\n    %p.summary= displayText\n    %p.date= pubDate\n\n")),

  prepareData : function() {
    this.feed = this.node.feeds && this.node.feeds[0];
  },

  setupConnections : function() {
    this.inherited(arguments);

    if (this.feed) {
      this.connect(this.refreshButton, 'click', '_loadFeed');
    }
  },

  startup : function() {
    this.inherited(arguments);
    this._loadFeed();
  },

  _loadFeed : function() {
    this.addClass('loading');

    this.feed.load().then(
      dojo.hitch(this, '_populate'),
      dojo.hitch(this, '_handleNoNetwork')
    );

    this.connect(this.feedItemList, 'click', '_onSelect');
  },

  _populate : function(items) {
    this.removeClass('loading');

    if (!items.length) {
      var li = dojo.create('li', { innerHTML : this.i18n_noItems });
      dojo.place(li, this.feedItemList, 'only');
      return;
    }

    this.feedItemList.innerHTML = dojo.map(items, function(item, idx) {
      item.displayText = toura.util.truncate(item.body, 200);
      item.index = idx;
      item.pubDate = dojo.date.locale.format(item.pubDate);
      return this.itemTemplate(item);
    }, this).join('');

    this.lastUpdated.innerHTML = ' ' + dojo.date.locale.format(new Date());

    this.region.refreshScroller();
    this.onPopulate();
  },

  onPopulate : function() {
    // stub
  },

  _handleNoNetwork : function() {
    this.removeClass('loading');
    var li = dojo.create('li', { innerHTML : this.i18n_noNetwork });
    dojo.place(li, this.feedItemList, 'only');
  },

  _onSelect : function(e) {
    e.preventDefault();

    var t = e.target, index;

    while (t.nodeName.toLowerCase() !== 'li') {
      t = t.parentNode;
    }

    index = dojo.attr(t, 'data-index');

    dojo.forEach(t.parentNode.childNodes, function(el) {
      dojo.removeClass(el, 'active');
    });

    dojo.addClass(t, 'active');

    if (index) {
      this.onSelect(this.feed.id, index);
    }
  },

  onSelect : function(feedId, feedItemIndex) {
    console.log('onSelect', feedId, feedItemIndex);
    // stub for connection
  },

  initializeStrings : function() {
    this.i18n_noNetwork = this.getString('NO_NETWORK');
    this.i18n_noItems = this.getString('FEED_NO_ITEMS');
    this.i18n_feedRefresh = this.getString('FEED_REFRESH');
  }
});


}

if(!dojo._hasResource['toura.components.Hotspots']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components.Hotspots'] = true;
dojo.provide('toura.components.Hotspots');





dojo.declare('toura.components.Hotspots', [ toura.components._Component ], {
  templateString : dojo.cache("toura.components", "Hotspots/Hotspots.haml", ".component.hotspots\n  .image-wrapper{ dojoAttachPoint : 'imageWrapper', style : 'text-align: center' }\n    %img{ src : image.url, dojoAttachPoint : 'imageNode' }\n"),

  widgetsInTemplate : true,
  prepareData : function() {
    var data = this.node.data[0].json;
    this.hotspots = data.hotspots;
    this.image = this.node.images[0].original;
  },

  setupConnections : function() {
    this.connect(this.imageNode, 'click', '_handleImageClick');
  },

  postCreate : function() {
    this.inherited(arguments);

    this.scroller = new iScroll(this.domNode, {
      zoom : false,
      bounce : false
    });

    dojo.style(this.imageWrapper, {
      'width' : this.image.width + 'px',
      'height' : this.image.height + 'px'
    });
  },

  _handleImageClick : function(e) {
    e.preventDefault();

    var x = e.offsetX,
        y = e.offsetY,
        foundSpot;

    dojo.forEach(this.hotspots, function(spot) {
      if (foundSpot) { return; }

      var nodeId;

      if (spot.shape === 'rectangle') {
        if (
          x > spot.left &&
          y > spot.top &&
          x < (spot.left + spot.width) &&
          y < (spot.top + spot.height)
        ) {
          foundSpot = spot;
        }
      }

      if (spot.shape === 'circle') {
        var radius = spot.width / 2,
            spotCenterX = spot.left + radius,
            spotCenterY = spot.top + radius,
            hyp = Math.sqrt(
              Math.pow(spotCenterY - y, 2) + Math.pow(spotCenterX - x, 2)
            );

        if (hyp < radius) {
          foundSpot = spot;
        }
      }

    }, this);

    if (foundSpot) {
      toura.app.UI.click = { x : x, y : y };
      toura.app.Router.go(toura.app.URL.node(foundSpot.node_id));
    }
  },

  startup : function() {
    this.inherited(arguments);

    var nodeHeight = this.domNode.clientHeight,
        nodeWidth = this.domNode.clientWidth,
        newX = 0, newY = 0,
        center = {},
        params;

    if (toura.app.UI.click) {
      params = toura.app.UI.click;
      center.x = +params.x;
      center.y = +params.y;
    } else {
      center.x = this.image.width / 2;
      center.y = this.image.height / 2;
    }

    toura.app.UI.click = false;

    if (center.x > nodeWidth / 2) {
      center.x = center.x - (nodeWidth / 2);
    } else {
      center.x = 0;
    }

    if (center.y > nodeHeight / 2) {
      center.y = center.y - (nodeHeight / 2);
    } else {
      center.y = 0;
    }

    this.scroller.refresh();
    this.scroller.scrollTo(center.x * -1, center.y * -1, '0ms');
  }
});

}

if(!dojo._hasResource['toura.components.LocationList']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components.LocationList'] = true;
dojo.provide('toura.components.LocationList');




dojo.declare('toura.components.LocationList', [ toura.components._Component ], {
  templateString : dojo.cache("toura.components", "LocationList/LocationList.haml", "%ul.component.location-list\n  :each location in locations\n    %li\n      .address\n        %p= location.name\n\n        :if location.address\n          %p= location.address\n\n      %a.directions{ target : '_blank', href : location.directionsUrl }= i18n_directions\n\n      :if location.phoneNumber\n        %a.phone-number{ href : location.phoneUrl }\n          %span.label= i18n_phone\n          %span= location.phoneNumber\n\n      :if location.website\n          %a.website{ href : location.website }= i18n_website\n"),

  prepareData : function() {
    this.locations = dojo.map(this.node.googleMapPins, function(pin) {
      var loc = dojo.mixin({}, pin);

      loc.directionsUrl = pin.address && toura.app.URL.googleMapAddress(pin.address);
      loc.phoneUrl = pin.phoneNumber && toura.app.URL.tel(pin.phoneNumber);

      return loc;
    });
  },

  setupConnections : function() {
    dojo.forEach(this.query('a.website'), function(n) {
      this.connect(n, 'click', function(e) {
        e.preventDefault();
        toura.app.Phonegap.browser.url(
          dojo.attr(n, 'href')
        );
      });
    }, this);
  },

  initializeStrings : function() {
    this.i18n_phone = this.getString('PHONE');
    this.i18n_website = this.getString('WEBSITE');
    this.i18n_directions = this.getString('DIRECTIONS');
  }
});

}

if(!dojo._hasResource['toura.components.NodeGallery']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components.NodeGallery'] = true;
dojo.provide('toura.components.NodeGallery');



dojo.declare('toura.components.NodeGallery', [ toura.components._Component, toura.components._ImageScroller ], {
  templateString : dojo.cache("toura.components", "NodeGallery/NodeGallery.haml", ".component.node-gallery\n  %ol.indicator{ dojoAttachPoint : 'indicator' }\n    :each img in images\n      %li\n\n  .wrapper\n    %ol.images{ dojoAttachPoint : 'imageList' }\n      :each img in images\n        %li{ class : 'image ' + img.id }\n          .image{ dojoType : 'toura.ui.BackgroundImage', imageUrl : img.url, imageHeight : img.height, imageWidth : img.width }\n"),
  'class' : 'node-gallery',

  prepareData : function() {
    this.node.populateChildren();
    this.children = this.node.children;

    this.images = dojo.map(this.children || [], function(child) {
      var img = child.images[0];

      return dojo.mixin(img, this.phone ? {
        url : img.gallery.url,
        height : img.gallery.height,
        width : img.gallery.width
      } : {
        url : img.original.url,
        height : img.original.height,
        width : img.original.width
      });
    }, this);
  },

  postCreate : function() {
    this.scrollerNode = this.clickNode = this.imageList;
    this.inherited(arguments);
  },

  setupConnections : function() {
    this.connect(this.clickNode, 'click', '_handle');
  },

  _handle : function(e) {
    var child = this.children[this.currentImageIndex],

        params = {
          x : e.offsetX,
          y : e.offsetY
        },

        img = this.images[this.currentImageIndex],
        multiplier,
        nodeHeight = this.domNode.clientHeight,
        nodeWidth = this.domNode.clientWidth,
        resizeRatio = nodeWidth / img.width;

    if ((img.height * resizeRatio) > nodeHeight) {
      params.y += ((img.height * resizeRatio) - nodeHeight) / 2;
    }

    multiplier = img.original.width / nodeWidth;

    params.x = Math.floor(params.x * multiplier);
    params.y = Math.floor(params.y * multiplier);

    toura.app.UI.click = params;
    toura.app.Router.go(child.url);
  },

  _setCurrentImageIndexAttr : function(imageIndex) {
    this.inherited(arguments);

    dojo.forEach(this.indicator.childNodes, function(child) {
      dojo.removeClass(child, 'active');
    });
    dojo.addClass(this.indicator.childNodes[imageIndex], 'active');
  },

  onScrollEnd : function(imageIndex) {
    // stub for connection
  }
});

}

if(!dojo._hasResource['toura.components.NodeTitleBanner']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components.NodeTitleBanner'] = true;
dojo.provide('toura.components.NodeTitleBanner');




dojo.declare('toura.components.NodeTitleBanner', [ toura.components._Component ], {
  templateString : dojo.cache("toura.components", "NodeTitleBanner/NodeTitleBanner.haml", ".component.node-title-banner\n  :if image\n    .image{ dojoType : 'toura.ui.BackgroundImage', imageWidth : image.width, imageHeight : image.height, imageUrl : image.url, loadOnInit: true }\n\n  %header\n    :if parentTitle\n      %h3= parentTitle\n\n    %h2= nodeTitle\n"),
  widgetsInTemplate : true,

  prepareData : function() {
    if (this.node.featuredImage) {
      this.image = this.node.featuredImage[
        this.phone ? 'small' : 'large'
      ];
    } else {
      this.image = false;
    }

    this.parentTitle = this.node.parent && this.node.parent.name;
    this.nodeTitle = this.node.name;
  }
});

}

if(!dojo._hasResource['toura.components.PageHeaderImage']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components.PageHeaderImage'] = true;
dojo.provide('toura.components.PageHeaderImage');



dojo.declare('toura.components.PageHeaderImage', [ toura.components.HeaderImage ], {
  "class" : 'page-header-image',

  prepareData : function() {
    this.inherited(arguments);

    if (this.viewImage) {
      dojo.mixin(this.viewImage, this._calculateDimensions());
    }
  },

  _getWidth : function() {
    return toura.app.UI.viewport.width;
  }
});

}

if(!dojo._hasResource['toura.components.ZoomableImageGallery']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components.ZoomableImageGallery'] = true;
dojo.provide('toura.components.ZoomableImageGallery');





dojo.declare('toura.components.ZoomableImageGallery', [ toura.components._Component, toura.components._ImageGallery, toura.ui.PinchZoom ], {
  templateString : dojo.cache("toura.components", "ZoomableImageGallery/ZoomableImageGallery.haml", ".component.zoomable-image-gallery\n  .content\n    .image-nav.prev{ dojoAttachPoint : 'prevButton' }\n\n    %ol{ dojoAttachPoint : 'imageList' }\n      :each img in images\n        %li.image\n          .wrapper{ dojoType : 'toura.ui.BackgroundImage', imageUrl : img.url, imageHeight : img.height, imageWidth : img.width }\n\n    .image-nav.next{ dojoAttachPoint : 'nextButton' }\n\n    .caption{ dojoType : 'toura.components.ImageCaption', dojoAttachPoint : 'caption' }\n"),
  widgetsInTemplate : true,
  chromeVisible : false,

  prepareData : function() {
    this.inherited(arguments);

    this.images = dojo.map(this.node.images || [], function(img) {
      var imgType = { tablet : 'original', phone : 'gallery' }[ this.device.type ];

      dojo.forEach([ 'url', 'height', 'width' ], function(prop) {
        img[prop] = img[imgType][prop];
      });

      return img;
    }, this);
  },

  setupConnections : function() {
    this.clickNode = this.imageList;
    this.connect(this.nextButton, 'click', this._go(1));
    this.connect(this.prevButton, 'click', this._go(-1));
  },

  _go : function(increment) {
    return dojo.hitch(this, function() {
      this.set('currentImageIndex', this.currentImageIndex + increment);
    });
  },

  _setCurrentImageIndexAttr : function(imageIndex) {
    this.inherited(arguments);

    var img = this.images[imageIndex];
    this.set('caption', img.caption || '');

    this._updateImages(imageIndex);
    this._updateButtons(imageIndex);

    this.onImageChange(img);
  },

  _handleClick : function() {
    this.set('chromeVisible', !this.chromeVisible);
  },

  _setChromeVisibleAttr : function(visible) {
    // show/hide it
    this[ visible ? 'removeClass' : 'addClass' ]('chrome-hidden');
    this.chromeVisible = visible;

    // announce it
    this[ visible ? 'onShowChrome' : 'onHideChrome' ]();
  },

  onShowChrome : function() {
    // stub for connection
  },

  onHideChrome : function() {
    // stub for connection
  },

  onImageChange : function(image) {
    // stub for connection
  },

  _updateImages : function(imageIndex) {
    dojo.forEach(this.bgImgs, function(widget, index) {
      var n = widget.domNode.parentNode,
          isCurrentImage = index === imageIndex;

      this[isCurrentImage ? 'show' : 'hide'](n);
      if (!isCurrentImage) { return; }

      this._makeScroller(n);
    }, this);
  },

  _updateButtons : function(imageIndex) {
    var isFirst = imageIndex === 0,
        isLast = imageIndex === (this.images.length - 1);

    this[isFirst ? 'hide' : 'show'](this.prevButton);
    this[isLast ? 'hide' : 'show'](this.nextButton);
  },

  _setCaptionAttr : function(caption) {
    this.caption.set('content', caption);

    this.caption[caption ? 'show' : 'hide']();
  }
});


}

if(!dojo._hasResource['toura.components._base']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.components._base'] = true;
dojo.provide('toura.components._base');

































}

if(!dojo._hasResource['toura.capabilities._Capability']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.capabilities._Capability'] = true;
dojo.provide('toura.capabilities._Capability');

/**
 * @class
 */
dojo.declare('toura.capabilities._Capability', [ ], {
  /**
   * An object defining the required components for the capability. The
   * object's keys are the property names that will be used to refer to the
   * component; the corresponding value is the name of the component that is
   * required.
   *
   * @example
   * For example:
   *
   *   {
   *     'imageGallery' : 'ImageGallery'
   *   }
   */
  requirements : {},

  /**
   * An array containing zero or more arrays specifying the connections that
   * the capability should set up.
   *
   * @example
   * For example:
   *
   *   [
   *     [ 'imageGallery', 'onScrollEnd', '_setCaption ]
   *   ]
   *
   * The first item in the array refers to the property name that was defined
   * in the requirements object for the component we want to listen to.
   *
   * The second item in the array is the method or event that we want to listen
   * to on the component.
   *
   * The third item in the array is the capability method that we want to run
   * when the event/method occurs.
   */
  connects : [],

  /**
   * @param {Object} config
   * - page: the page that the capability is associated with
   * - components: the components that are involved, specified as
   *   <screenName>:<componentName>
   */
  constructor : function(config) {
    dojo.mixin(this, config);

    this.domNode = this.page.domNode;
    this.node = this.page.node;

    this.involved = this._loadInvolvedComponents();

    if (!this._checkRequirements()) {
      console.error('Did not find required components for capability', this.declaredClass);
      return;
    }

    this._doLookups();
    this._doConnects();

    this.init();
  },

  /**
   * @public
   * This method can be implemented by individual capabilities, and will be run
   * once all capability setup is complete.
   */
  init : function() {
    // stub for implementation
  },

  /**
   * @private
   * Iterates over the components array provided in the config and populates
   * the `this.involved` object with references to the components.
   *
   * @returns {Object} An object where the property names are the name of the
   * component, and the values are the component associated with that name.
   */
  _loadInvolvedComponents : function() {
    var involved = {};

    dojo.forEach(this.components, function(c) {
      var tmp = c.split(':'),
          screenName = tmp[0],
          componentName = tmp[1],

          screen = this.page.getScreen(screenName),
          component = screen.getComponent(componentName);

      involved[componentName] = component;
    }, this);

    return involved;
  },

  /**
   * @private
   * Checks whether the components that are specified as required in the
   * capability definition are present
   *
   * @returns {Boolean} A boolean value indicating whether the requirements of
   * the capability have been met.
   */
  _checkRequirements : function() {
    var requirementsMet = true;

    dojo.forIn(this.requirements, function(propName, requiredComponentName) {
      requirmentsMet = this.involved[requiredComponentName];
    }, this);

    return requirementsMet;
  },

  /**
   * @private
   * Associates the components specified by the template with the appropriate
   * property names, so that the capability can refer to the components in a
   * predictable manner.
   */
  _doLookups : function() {
    dojo.forIn(this.requirements, function(propName, componentName) {
      this[propName] = this.involved[componentName];
    }, this);
  },

  /**
   * @private
   * Sets up method/event listeners and interactions between components.
   */
  _doConnects : function() {
    dojo.forEach(this.connects, function(c) {
      this.connect.apply(this, c);
    }, this);
  },

  /**
   * Registers a connection with the capability's page, allowing for automatic
   * connection teardown when the page is destroyed.
   */
  connect : function(obj, method, fn) {
    if (dojo.isString(obj)) { obj = this[obj]; }
    this.page.connect(obj, method, dojo.hitch(this, fn));
  }
});

toura.capability = function(name, proto) {
  dojo.declare(
    'toura.capabilities.' +  name,
    [ toura.capabilities._Capability ],
    proto
  );
};

}

if(!dojo._hasResource['toura.capabilities.Page_Images']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.capabilities.Page_Images'] = true;
dojo.provide('toura.capabilities.Page_Images');



dojo.declare('toura.capabilities.Page_Images', [ toura.capabilities._Capability ], {
  requirements : {
    imageGallery : 'ImageGallery',
    imageCaption : 'ImageCaption'
  },

  connects : [
    [ 'page', 'init', '_setup' ]
  ],

  _setup : function(pageState) {
    if (!pageState) { return; }

    var imageId = pageState.assetId,
        index, image;

    if (!imageId) { return; }

    image = dojo.filter(this.baseObj.images, function(image, idx) {
      if (image.id === imageId) {
        index = idx;
        return image;
      }
    })[0];

    if (!image) { return; }

    if (this.imageGallery) {
      this.connect(this.imageGallery, 'startup', function() {
        this.imageGallery.scrollToIndex(index);
      });
    }

    if (this.imageCaption) {
      this.imageCaption.set('content', image.caption || '');
    }
  }
});


}

if(!dojo._hasResource['toura.capabilities.Page_FullScreenImages']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.capabilities.Page_FullScreenImages'] = true;
dojo.provide('toura.capabilities.Page_FullScreenImages');



dojo.declare('toura.capabilities.Page_FullScreenImages', [ toura.capabilities._Capability ], {
  requirements : {
    imageGallery : 'ZoomableImageGallery',
    pageNav : 'PageNav'
  },

  connects : [
    [ 'page', 'init', '_setup' ],
    [ 'imageGallery', 'onHideChrome', '_hideNav' ],
    [ 'imageGallery', 'onShowChrome', '_showNav' ]
  ],

  _setup : function(pageState) {
    var index = 0;

    if (pageState.assetId) {
      dojo.forEach(this.baseObj.images, function(image, idx) {
        if (image.id === pageState.assetId) { index = idx; }
      });
    }

    this.imageGallery.set('currentImageIndex', index);
  },

  _hideNav : function() {
    this.pageNav.hide();
  },

  _showNav : function() {
    this.pageNav.show();
  }
});


}

if(!dojo._hasResource['toura.capabilities.ImageGallery_ImageCaption']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.capabilities.ImageGallery_ImageCaption'] = true;
dojo.provide('toura.capabilities.ImageGallery_ImageCaption');



dojo.declare('toura.capabilities.ImageGallery_ImageCaption', [ toura.capabilities._Capability ], {
  requirements : {
    imageGallery : 'ImageGallery',
    imageCaption : 'ImageCaption'
  },

  connects : [
    [ 'imageGallery', 'onScrollEnd', '_setCaption' ]
  ],

  _setCaption : function(imageIndex) {
    var image = this.baseObj.images[imageIndex];
    this.imageCaption.set('content', image && image.caption || '');
    dojo.publish('/content/update');
  }
});

}

if(!dojo._hasResource['toura.capabilities.ImageGalleryDetail']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.capabilities.ImageGalleryDetail'] = true;
dojo.provide('toura.capabilities.ImageGalleryDetail');




dojo.declare('toura.capabilities.ImageGalleryDetail', [ toura.capabilities._Capability ], {
  requirements : {
    imageGallery : 'ImageGallery',
    imageDetail : 'ZoomableImageGallery',
    detailTitle : 'DetailTitle'
  },

  connects : [
    [ 'imageGallery', 'onShowDetail', '_showDetail' ],
    [ 'detailTitle', 'onClose', '_hideDetail' ],
    [ 'imageDetail', 'onImageChange', '_setTitle' ],
    [ 'imageDetail', 'onShowChrome', '_showDetailTitle' ],
    [ 'imageDetail', 'onHideChrome', '_hideDetailTitle' ]
  ],

  _showDetail : function(imageIndex) {
    toura.app.UI.set('siblingNavVisible', false);
    this.detailTitle.hide();
    this.page.showScreen('detail');
    this.imageDetail.set('currentImageIndex', imageIndex);
    this.imageDetail.set('chromeVisible', false);
  },

  _hideDetail : function(imageIndex) {
    this.page.showScreen('index');
    toura.app.UI.set('siblingNavVisible', true);
    this.imageGallery.scrollToIndex(this.imageDetail.currentImageIndex);
  },

  _setTitle : function(image) {
    this.detailTitle.set('screenTitle', image.name);
  },

  _showDetailTitle : function() {
    this.detailTitle.show();
  },

  _hideDetailTitle : function() {
    this.detailTitle.hide();
  }
});

}

if(!dojo._hasResource['toura.capabilities.FeedItemList_FeedItemPage']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.capabilities.FeedItemList_FeedItemPage'] = true;
dojo.provide('toura.capabilities.FeedItemList_FeedItemPage');

dojo.declare('toura.capabilities.FeedItemList_FeedItemPage', [ toura.capabilities._Capability ], {
  requirements : {
    feedItemList : 'FeedItemList'
  },

  connects : [
    [ 'feedItemList', 'onSelect', '_navigateToFeedItemPage' ]
  ],

  _navigateToFeedItemPage : function(feedId, itemIndex) {
    var url = toura.app.URL.feedItem(feedId, itemIndex);
    toura.app.Router.go(url);
  }
});


}

if(!dojo._hasResource['toura.capabilities.FeedItemList_FeedItemDetail']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.capabilities.FeedItemList_FeedItemDetail'] = true;
dojo.provide('toura.capabilities.FeedItemList_FeedItemDetail');



dojo.declare('toura.capabilities.FeedItemList_FeedItemDetail', [ toura.capabilities._Capability ], {
  requirements : {
    feedItemList : 'FeedItemList',
    feedItemDetail : 'FeedItemDetail'
  },

  connects : [
    [ 'feedItemList', 'onSelect', '_showFeedItem' ],
    [ 'feedItemList', 'onPopulate', '_showFirstItem' ]
  ],

  _showFeedItem : function(feedId, itemIndex) {
    this.feedItemDetail.set('item', this.feedItemList.feed.getItem(itemIndex));
  },

  _showFirstItem : function() {
    this.feedItemDetail.set('item', this.feedItemList.feed.getItem(0));
  }
});


}

if(!dojo._hasResource['toura.capabilities.PageNav_FeedTitle']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.capabilities.PageNav_FeedTitle'] = true;
dojo.provide('toura.capabilities.PageNav_FeedTitle');



dojo.declare('toura.capabilities.PageNav_FeedTitle', [ toura.capabilities._Capability ], {
  requirements : {
    feedItemDetail : 'FeedItemDetail',
    pageNav : 'PageNav'
  },

  init : function() {
    this.pageNav.set('screenTitle', this.page.baseObj.feedName);
  }
});

}

if(!dojo._hasResource['toura.capabilities.Page_Audios']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.capabilities.Page_Audios'] = true;
dojo.provide('toura.capabilities.Page_Audios');



dojo.declare('toura.capabilities.Page_Audios', [ toura.capabilities._Capability ], {
  requirements : {
    audioPlayer : 'AudioPlayer',
    audioList : 'AudioList'
  },

  connects : [
    [ 'page', 'init', '_setup' ]
  ],

  _setup : function(pageState) {
    if (this.baseObj.audios.length < 2) {
      dojo.destroy(this.audioList.domNode);
    }

    this._loadAudio(pageState);
  },

  _loadAudio : function(pageState) {
    // only when navigating directly to the audio instead of just the node
    if (!pageState.assetId || pageState.assetType !== 'audios') { return; }

    var audioId = pageState.assetId,
        audio = this._audioById(audioId);

    if (this.audioList) {
      this.audioList.set('currentAsset', audioId);
    }

    if (this.audioCaption) {
      this.audioCaption.set('content', audio.caption || '');
    }

    this.audioPlayer.set('mediaId', audioId);
  }
});

}

if(!dojo._hasResource['toura.capabilities.AudioList_AudioPlayer']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.capabilities.AudioList_AudioPlayer'] = true;
dojo.provide('toura.capabilities.AudioList_AudioPlayer');

dojo.declare('toura.capabilities.AudioList_AudioPlayer', [ toura.capabilities._Capability ], {
  requirements : {
    audioList : 'AudioList',
    audioPlayer : 'AudioPlayer'
  },

  connects : [
    [ 'audioList', 'onSelect', '_playAudio' ]
  ],

  _playAudio : function(audioId) {
    this.audioPlayer.play(audioId);
  }
});


}

if(!dojo._hasResource['toura.capabilities.AudioList_AudioCaption']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.capabilities.AudioList_AudioCaption'] = true;
dojo.provide('toura.capabilities.AudioList_AudioCaption');

dojo.declare('toura.capabilities.AudioList_AudioCaption', [ toura.capabilities._Capability ], {
  requirements : {
    audioList : 'AudioList',
    audioCaption : 'AudioCaption'
  },

  connects : [
    [ 'audioList', 'onSelect', '_setCaption' ]
  ],

  _setCaption : function(audioId) {
    var audio = this.baseObj.getAssetById('audio', audioId);
    if (!audio) { return; }
    this.audioCaption.set('content', audio.caption || '');
  }
});


}

if(!dojo._hasResource['toura.capabilities._base']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.capabilities._base'] = true;
dojo.provide('toura.capabilities._base');













}

if(!dojo._hasResource['toura.pageControllers.Configurable']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.pageControllers.Configurable'] = true;
dojo.provide('toura.pageControllers.Configurable');






dojo.declare('toura.pageControllers.Configurable', [ toura.pageControllers._Page ], {
  templateConfig : {},
  templateString : dojo.cache("toura.pageControllers", "Configurable/Configurable.haml", "%li.page.node.configurable\n"),

  postMixInProperties : function() {
    this.inherited(arguments);
    this.baseObj.shareable = this.baseObj.type === 'node';
  },

  postCreate : function() {
    this.inherited(arguments);
    this.screens = {};

    if (!this.baseObj) {
      throw "Configurable page controller requires a base object";
    }

    if (!this.templateConfig) {
      throw "Configurable page controller requires a template config";
    }

    if (!this.templateConfig.screens || !this.templateConfig.screens.length) {
      throw "Configurable page controller must have at least one screen defined";
    }

    dojo.forEach(this.templateConfig.screens, function(screen) {
      var scr = this.adopt(toura.containers.Screen, {
        page : this,
        config : screen,
        baseObj : this.baseObj,
        device : this.device,
        backgroundImage : this._getBackgroundImage()
      }).placeAt(this.domNode);

      this.screens[screen.name] = scr;
    }, this);

    this.capabilities = dojo.map(this.templateConfig.capabilities || [], function(config) {
      var C = config.name,
          components = config.components;

      if (!toura.capabilities[C]) {
        console.warn('No capability', C, 'defined -- did you remember to require it in toura.capabilities._base?');
        return null;
      }

      return new toura.capabilities[C]({
        page : this,
        baseObj : this.baseObj,
        components : components
      });
    }, this);

    if (this.screens.detail) {
      this.screens.detail.hide();
    }

    this.addClass('page-' + this.baseObj.id);
    this.addClass(this.templateName);
  },


  showScreen : function (screenName) {
    dojo.forIn(this.screens, function(name, screen) {
      if (name !== screenName) {
        screen.hide();
      }
    });
    this.screens[screenName].show();
  },

  getScreen : function(screenName) {
    return this.screens[screenName];
  },

  startup : function() {
    this.inherited(arguments);
    dojo.forIn(this.screens, function(name, screen) {
      screen.startup();
    });
  },

  /**
   * @override
   */
  _applyBackgroundImage : function() { },

  _getBackgroundImage : function() {
    var img;

    if (this.baseObj.getBackgroundImage) {
      img = this.baseObj.getBackgroundImage(this.device);
    }

    return img || this.inherited(arguments);
  }
});


}

if(!dojo._hasResource['toura.app.PageFactory']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.app.PageFactory'] = true;
dojo.provide('toura.app.PageFactory');



/**
 * TODO: create a single file that requires all page controllers
 * and then require it here.
 */









dojo.declare('toura.app.PageFactory', [], {
  constructor : function(device) {
    this.device = device;
  },

  _translations : {
    'videos'            : 'Videos1',
    'locations-map'     : 'GoogleMap1'
  },

  /**
   * Provide a way to override controller names based on device info.
   */
  _overrides : {
    'FeedList' : function(device) {
      return 'feed-list-' + device.type;
    },

    'Images1' : function(device) {
      return 'images-and-text-' + device.type;
    },

    'Home1' : function(device) {
      return 'home-' + device.type;
    },

    'Home2' : function(device) {
      return 'home-with-header-' + device.type;
    },

    'Audios1' : function(device) {
      return 'audio-with-images-' + device.type;
    }
  },

  pages : {
    "search" : function() {
      return new toura.pageControllers.search.Search({ device : this.device });
    },

    "favorites" : function() {
      return new toura.pageControllers.favorites.Favorites({ device : this.device });
    },

    "feedItem" : function(obj) {
      var Controller = toura.pageControllers.Configurable,
          templateConfig = toura.templates['feed-item'];

      return new Controller({
        baseObj : obj.feedItem,
        device : this.device,
        templateConfig : templateConfig
      });
    },

    "debug" : function(obj) {
      return new toura.pageControllers.Debug({ device : this.device, query : obj.query });
    }
  },

  createPage : function(obj) {
    /*
     * createPage receives an object that it will use to create a page. It
     * looks at the object for a pageController property, and uses that
     * pageController property to determine how to set up the page controller
     * for the page. The process for determining this is a bit convoluted for
     * the time being, in order to support some legacy systems. Here's how it
     * works:
     *
     * First, we determine the name of the controller we're going to use:
     *
     *    1. If the object does not have a pageController property, then the
     *    controllerName is set to 'default'
     *
     *    2. If the object has a pageController property and the property's
     *    value is an object, then it is assumed the object has a 'phone' and
     *    a 'tablet' property; the controllerName is set to the value that
     *    corresponds with the device type.
     *
     * Next, we check the PageFactory's 'pages' object to determine whether the
     * specified controllerName should receive special handling.
     *
     *    1. If there is an entry in the pages object that corresponds with the
     *    controllerName, we expect that entry to point to a function. We call
     *    that function, passing it the object that was passed to createPage,
     *    and return its result. In this case, the createPage method is
     *    complete.
     *
     *    2. If there is not an entry in the pages object that corresponds with
     *    the controllerName, the createPage method continues.
     *
     * Next, we translate "new" controller names into legacy controller names.
     * We do this by inspecting the PageFactory's '_translations' object; if it
     * has an entry that corresponds with the controllerName, we use that
     * entry's value as the new controllerName. (This is necessary for
     * controllers that have not been converted to the new "configurable"
     * system. When all controllers have been converted to the new system, the
     * _translations object can go away.)
     *
     * Finally, we handle the case where MAP (Toura's internal CMS) is using
     * old controller names (such as Home1, Images1, etc.). We do this by
     * inspecting the PageFactory's '_overrides' object; if it has an entry
     * that corresponds with the controllerName, we assume that entry points to
     * a function. We run the function, passing the device object as an
     * argument, and use the return value as the new controllerName.
     *
     * At this point, we have a reliable controllerName. We look to see if
     * there is an entry in the toura.templates object for the controllerName.
     * If there is, we use the Configurable page controller; if not, we look
     * for a legacy page controller with that name. (This is necessary until
     * all *node* page controllers have been converted to the new system.)
     *
     * Once we have determined the proper page controller to use, we create an
     * instance of that controller, passing it the data it will need in order
     * to create the page. We return the controller instance, and createPage is
     * complete.
     */

    if (!obj) { throw new Error('toura.app.PageFactory::createPage requires an object'); }

    var controllerName = obj.pageController || 'default',
        config, Controller;

    // allow setting different page controllers per device
    if (obj.pageController && dojo.isObject(obj.pageController)) {
      controllerName = obj.pageController[this.device.type] || 'default';
    } else {
      controllerName = obj.pageController || 'default';
    }

    // handle special cases like search, favorites, feed item, debug
    // TODO: this can go away once those pages are converted to configurables
    if (this.pages[controllerName]) {
      return this.pages[controllerName].call(this, obj);
    }

    // translate new template names to legacy names
    // TODO: this can go away once we don't have to support legacy names
    if (this._translations[controllerName]) {
      controllerName = this._translations[controllerName];
    }

    // allow overriding template name based on device info
    // TODO: this can go away once MAP sends per-device controller names
    if (this._overrides[controllerName]) {
      controllerName = this._overrides[controllerName](this.device);
    }

    // use configurable page controller if a config is defined for the
    // controller name; otherwise look for a legacy page controller
    // TODO: this can go away once we eliminate support for legacy names
    config = toura.templates && toura.templates[controllerName];

    Controller = config ? toura.pageControllers.Configurable : toura.pageControllers.node[controllerName];

    // if we don't have a controller by now, we have problems
    if (!Controller) {
      console.error('toura.app.PageFactory: The controller "' + controllerName + '" does not exist. Did you require it in PageFactory?');
      throw('toura.app.PageFactory: The controller "' + controllerName + '" does not exist. Did you require it in PageFactory?');
    }

    toura.log('Creating ' + controllerName);

    return new Controller({
      baseObj : obj,
      device : this.device,
      templateConfig : config,
      templateName : controllerName
    });
  }
});

dojo.subscribe('/app/ready', function() {
  toura.app.PageFactory = new toura.app.PageFactory(toura.app.Config.get('device'));
});

}

if(!dojo._hasResource['toura.app.Routes']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.app.Routes'] = true;
dojo.provide('toura.app.Routes');

toura.app.Routes = function() {
  var app = toura.app.Config.get('app'),
      factory = toura.app.PageFactory,
      routes;

  function nodeRoute(route, nodeId, pageState) {
    pageState = pageState || {};

    var nodeModel = toura.app.Data.getModel(nodeId),
        page = toura.app.UI.getCurrentPage(),
        pf, subscription;

    if (!nodeModel) {
      console.log('Request for invalid hash', route.hash);
      toura.app.Router.home();
      return;
    }

    if (!page || !page.node || nodeId !== page.node.id) {
      // if we don't have a page yet, if we  have a page but
      // it's not a node page, or if we have a node page but
      // it's not for the requested node ... in all of these
      // cases, we need the page factory to spin up a page
      try {
        pf = factory.createPage(nodeModel);
      } catch(e) {
        console.log(e);
        toura.app.Router.back();
        return;
      }

      if (pf.failure) {
        if (dojo.isString(pf.failure)) {
          alert(pf.failure);
        }

        toura.app.Router.back();
        return;
      }

      pf.init(pageState);
      toura.app.UI.showPage(pf, nodeModel);
    } else {
      page.init(pageState);
    }

    // record node pageview if it is node-only
    if (nodeId && !pageState.assetType) {
      dojo.publish('/node/view', [ route.hash ]);
    }

    toura.endLogSection('NODE ROUTE');

    return true;
  }

  routes = [
    {
      route : '/home',
      handler : function(params, route) {
        toura.lastSearchTerm = null;
        return nodeRoute(route, app.homeNodeId);
      },
      defaultRoute : true
    },

    {
      route : '/about',
      handler : function(params, route) {
        return nodeRoute(route, app.aboutNodeId);
      }
    },

    {
      route : '/maps',
      handler : function(params, route) {
        return nodeRoute(route, app.mapNodeId);
      }
    },

    {
      route : /\/node\/(.*)/,
      handler : function(params, route) {
        var splat = params.splat[0].split('/'),
            nodeId = splat[0],
            pageState = {
              assetType : splat[1],
              assetId : splat[2],
              assetSubId : splat[3]
            };

        return nodeRoute(route, nodeId, pageState);
      }
    },

    {
      route : /\/search\/?(.*)/,
      handler : function(params) {
        var page = toura.app.UI.getCurrentPage(),
            term = params.splat && params.splat[0].split('/')[0];

        if (!page || !page.type || page.type !== 'search') {
          page = factory.createPage({
            pageController : 'search'
          });
          toura.app.UI.showPage(page);
        }

        page.init(term);

        return true;
      }
    },

    {
      route : '/feed/:feedId/item/:itemIndex',
      handler : function(params) {
        var feed = toura.app.Data.getModel(params.feedId, 'feed'),
            feedItem = feed.getItem(params.itemIndex),
            page = factory.createPage({
              pageController : 'feedItem',
              feedItem : feedItem
            });

        toura.app.UI.showPage(page, feedItem);
      }
    }
  ];

  if (toura.features.debugPage) {
    routes.push({
      route : '/debug/:query',
      handler : function(params, route) {
        var page = factory.createPage({
          pageController : 'debug',
          query : params.query
        });

        toura.app.UI.showPage(page);
      }
    });
  }

  if (toura.features.favorites) {
    routes.push({
      route : '/favorites',
      handler : function() {
        var page = factory.createPage({
          pageController : 'favorites'
        });

        toura.app.UI.showPage(page);
      }
    });
  }

  return routes;
};

}

if(!dojo._hasResource['toura.app.Notifications']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.app.Notifications'] = true;
dojo.provide('toura.app.Notifications');

(function() {

var notificationCallback;

toura.app.Notifications = {
  areAvailable: function() {
    return !!toura.app.Phonegap.present;
  },

  init: function() {
    if (!toura.app.Phonegap.present) { return; }

    window.plugins.pushNotification.startNotify();
    this._apnRegister();
  },

  setNotificationCallback: function(callback) {
    if (!toura.app.Phonegap.present) { return; }

    notificationCallback = window.plugins.pushNotification.notificationCallback = callback;
  },

  notify: function(notification) {
    notificationCallback(notification);
  },

  // register with APN
  _apnRegister: function() {
    window.plugins.pushNotification.register(
      function(e) { toura.app.Notifications._apnOnRegisterSuccess(e); },
      function(e) { toura.app.Notifications._apnOnRegisterError(e); },
      [{ alert:true, badge:true, sound:true }]);
    console.log('APN push notification registered.');
  },

  _apnOnRegisterSuccess: function(e) {
    this._urbanAirshipRegister(e.deviceToken, e.host, e.appKey, e.appSecret);
  },

  _apnOnRegisterError: function(e) {
    console.log('error registering with APN: ' + e.toString());
  },

  // register urban airship push service after APN is registered successfully
  _urbanAirshipRegister: function(deviceToken, host, appKey, appSecret) {
    // TODO: use dojo.xhrPut?
    var request = new XMLHttpRequest();

    // open the client and encode our URL
    request.open('PUT', host + 'api/device_tokens/' + deviceToken, true, appKey, appSecret);

    // callback when request finished
    request.onload = function() {
      if(this.status === 200 || this.status === 201) {
        // register UA push success
        console.log('Successfully registered with Urban Airship.');
      } else {
        // error
        console.log('Error when registring with Urban Airship: '+this.statusText);
      }
    };

    request.send();
  }
};

var Notifications = toura.app.Notifications;

dojo.subscribe('/app/ready', function() {
  var alertCallback = function(){},
      alertTitle = "Notification from " + toura.app.Config.get('app').name;

  Notifications.init();

  Notifications.setNotificationCallback(
    function(notification) {
      window.navigator.notification.alert(notification.alert, alertCallback, alertTitle);
    }
  );
});

}());

}

if(!dojo._hasResource["dojo.cookie"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.cookie"] = true;
dojo.provide("dojo.cookie");



/*=====
dojo.__cookieProps = function(){
	//	expires: Date|String|Number?
	//		If a number, the number of days from today at which the cookie
	//		will expire. If a date, the date past which the cookie will expire.
	//		If expires is in the past, the cookie will be deleted.
	//		If expires is omitted or is 0, the cookie will expire when the browser closes. << FIXME: 0 seems to disappear right away? FF3.
	//	path: String?
	//		The path to use for the cookie.
	//	domain: String?
	//		The domain to use for the cookie.
	//	secure: Boolean?
	//		Whether to only send the cookie on secure connections
	this.expires = expires;
	this.path = path;
	this.domain = domain;
	this.secure = secure;
}
=====*/


dojo.cookie = function(/*String*/name, /*String?*/value, /*dojo.__cookieProps?*/props){
	//	summary:
	//		Get or set a cookie.
	//	description:
	// 		If one argument is passed, returns the value of the cookie
	// 		For two or more arguments, acts as a setter.
	//	name:
	//		Name of the cookie
	//	value:
	//		Value for the cookie
	//	props:
	//		Properties for the cookie
	//	example:
	//		set a cookie with the JSON-serialized contents of an object which
	//		will expire 5 days from now:
	//	|	dojo.cookie("configObj", dojo.toJson(config), { expires: 5 });
	//
	//	example:
	//		de-serialize a cookie back into a JavaScript object:
	//	|	var config = dojo.fromJson(dojo.cookie("configObj"));
	//
	//	example:
	//		delete a cookie:
	//	|	dojo.cookie("configObj", null, {expires: -1});
	var c = document.cookie;
	if(arguments.length == 1){
		var matches = c.match(new RegExp("(?:^|; )" + dojo.regexp.escapeString(name) + "=([^;]*)"));
		return matches ? decodeURIComponent(matches[1]) : undefined; // String or undefined
	}else{
		props = props || {};
// FIXME: expires=0 seems to disappear right away, not on close? (FF3)  Change docs?
		var exp = props.expires;
		if(typeof exp == "number"){
			var d = new Date();
			d.setTime(d.getTime() + exp*24*60*60*1000);
			exp = props.expires = d;
		}
		if(exp && exp.toUTCString){ props.expires = exp.toUTCString(); }

		value = encodeURIComponent(value);
		var updatedCookie = name + "=" + value, propName;
		for(propName in props){
			updatedCookie += "; " + propName;
			var propValue = props[propName];
			if(propValue !== true){ updatedCookie += "=" + propValue; }
		}
		document.cookie = updatedCookie;
	}
};

dojo.cookie.isSupported = function(){
	//	summary:
	//		Use to determine if the current browser supports cookies or not.
	//
	//		Returns true if user allows cookies.
	//		Returns false if user doesn't allow cookies.

	if(!("cookieEnabled" in navigator)){
		this("__djCookieTest__", "CookiesAllowed");
		navigator.cookieEnabled = this("__djCookieTest__") == "CookiesAllowed";
		if(navigator.cookieEnabled){
			this("__djCookieTest__", "", {expires: -1});
		}
	}
	return navigator.cookieEnabled;
};

}

if(!dojo._hasResource['toura.app._Debug']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.app._Debug'] = true;
dojo.provide('toura.app._Debug');





(function(){

var sub = dojo.subscribe('/debug/user', function(query) {
  if (!toura.features.debugPage) { return; }
  if (!confirm('Click OK if you want to enter debug mode.')) { return; }

  toura.app.Router.go('/debug/' + query);
});

var createHash = function() {
  var nonce = [],
      length = 2; // arbitrary - looks like a good length

  while (length--) {
    nonce.push((((1+Math.random())*0x10000)).toString(16).substring(0,3));
  }

  return '#toura-' + nonce.join("");
};


toura.app._Debug = function() {
  var tools = new toura.app._Debug.Tools().placeAt(dojo.body(), 'first'),
      msg = new toura.app._Debug.Message().placeAt(dojo.body(), 'first'),
      tpl = 'Desktop debugging at {url}';

  dojo.connect(tools, 'onWeinre', function(hash) {
    var url = toura.app._Debug.weinre.client(hash);
    msg.set(
      'content',
      tpl.split('{url}').join(url)
    );
  });
};

toura.app._Debug.weinre = {
  init : function() {
    var cookie = dojo.cookie('debug-hash'),
        hash = cookie || createHash(),
        s = document.createElement('script'),
        url = s.src = this.script + hash;

    if (this.enabled) { return hash; }

    document.body.appendChild(s);
    dojo.cookie('debug-hash', hash);
    this.enabled = true;

    return hash;
  },

  script : 'http://debug.phonegap.com/target/target-script-min.js',
  client : function(hash) {
    return 'http://debug.phonegap.com/client/{hash}'.replace('{hash}', hash);
  }
};

dojo.declare('toura.app._Debug.Tools', [ toura.components._Component ], {
  templateString : '<div class="component debug-tools"><div class="buttons"></div></div>',

  actions : [
    {
      name : 'Reset DB',
      method : '_resetDB'
    },
    {
      name : 'weinre',
      method : '_weinre'
    }
  ],

  postCreate : function() {
    this.inherited(arguments);
    this._makeActions();
  },

  _makeActions : function() {
    dojo.forEach(this.actions, function(action) {
      var n = dojo.create('div', {
        className : 'button',
        innerHTML : action.name
      });

      dojo.place(n, this.domNode.firstChild);

      this.connect(n, 'click', action.method);
    }, this);
  },

  _resetDB : function() {
    toura.app.DeviceStorage.drop();
    window.location.reload();
  },

  _weinre : function() {
    if (this.hasWeinre) { return; }

    var hash = toura.app._Debug.weinre.init();
    this.hasWeinre = true;
    this.onWeinre(hash);
  },

  onWeinre : function(hash) { }
});

dojo.declare('toura.app._Debug.Message', [ toura.components._Component ], {
  templateString : '<div class="component debug-message"></div>',

  postCreate : function() {
    this.inherited(arguments);
    var n = dojo.create('div', {
      className : 'close',
      innerHTML : 'close'
    });

    dojo.place(n, this.domNode);
    this.connect(n, 'click', function() { this.hide(); });

    this.msgNode = dojo.create('div');
    dojo.place(this.msgNode, this.domNode);

    this.hide();
  },

  _setContentAttr : function(msg) {
    this.show();
    this.msgNode.innerHTML = msg;
  }
});

}());

}

if(!dojo._hasResource['toura.app.Manifest']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.app.Manifest'] = true;
dojo.provide('toura.app.Manifest');



dojo.declare('toura.app.Manifest', [], {
  url : './media/manifest.js',

  constructor :  function() {
    dojo.when(this._load(), dojo.hitch(this, '_parse'));
  },

  _load : function() {
    return this.manifest || dojo.io.script.get({ url : this.url });
  },

  _parse : function() {
    if (!toura.app.manifest) {
      toura.app.manifest = {};
      return;
    }

    var manifest = {};
    this._parseDir(manifest, toura.app.manifest.dirs);
    toura.app.manifest = manifest;
  },

  _parseDir : function(base, obj) {
    dojo.forIn(obj, function(dirname, contents) {
      base[dirname] = contents.files ? contents.files : [];

      if (contents.dirs) {
        dojo.forIn(contents.dirs, function(subdirname, contents) {
          this._parseDir(base[dirname], contents);
        }, this);
      }

    }, this);
  }
});

dojo.subscribe('/app/start', function() {
  toura.app.Manifest = new toura.app.Manifest();
});

}

if(!dojo._hasResource['toura.app.Has']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.app.Has'] = true;
dojo.provide('toura.app.Has');

toura.app.Has = function() {
  var device = toura.app.Config.get('device');

  return {
    cssBackgroundContain : function() {
      return !(device.os === 'android' && device.version === '2-1');
    },

    html5Player : function() {
      return device.os !== 'android';
    },

    iScrollZoom : function() {
      return device.os !== 'android';
    }
  };
};

(function(){

var s = dojo.subscribe('/app/start', function() {
  dojo.unsubscribe(s);
  if (dojo.isFunction(toura.app.Has)) {
    toura.app.Has = toura.app.Has();
  }
});

}());

}

if(!dojo._hasResource['toura.app.Local']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.app.Local'] = true;
dojo.provide('toura.app.Local');




toura = toura || {};
toura.data = toura.data || {};

toura.app.Local = (function() {
  return {
    manifest : function() {
      return dojo.io.script.get({ url : './media/manifest.js', preventCache : true });
    },

    templates : function() {
      return dojo.io.script.get({ url : './data/templates.js', preventCache : true });
    }
  };
}());

}

if(!dojo._hasResource['toura.app._base']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.app._base'] = true;
dojo.provide('toura.app._base');


 // disgusting patch for xhr content-type issue


















}

if(!dojo._hasResource['toura.base']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['toura.base'] = true;
dojo.provide('toura.base');

/**
 * Logging wrapper
 *
 * This needs to come before anything else.
 */
toura.data = toura.data || {};
mulberry = toura;







var readyFn = function() {
  toura.features = toura.features || {};

  dojo.publish('/app/start');

  toura.logSection('Bootstrapper');

  dojo.when(toura.app.Bootstrapper(), function() {

    toura.endLogSection('Bootstrapper');

    // things to do once we know we have data to work with

    dojo.when(toura.app.Tour.getItems(), function(data) {
            if (toura.extraTourData && dojo.isArray(toura.extraTourData)) {
        dojo.forEach(toura.extraTourData, function(item) {
          data.push(item);
        });
      }
      
      toura.app.Data = new toura.app.Data(data);

      // this timeout is here to avoid a nasty problem with webkit
      // where reading a node's innerHTML will not work correctly;
      // this bug manifests itself with an "Invalid template" error,
      // which will make no sense because the template is perfectly
      // valid. this error will only appear intermittently, and almost
      // exclusively on device. long story short:
      //
      // DO NOT REMOVE THIS TIMEOUT
      //

      setTimeout(function() {
        dojo.publish('/app/ready');
        toura.app.Phonegap.network.isReachable().then(
          function(reachable) {
            toura.app.Local.templates().then(function() {
              toura.app.Router = new toura.app.Router({ routes : toura.app.Routes() });
              dojo.publish('/routes/loaded');
              toura.app.Router.init();

              toura.app.UI.hideSplash();

              if (!reachable) {
                alert(
                  dojo.i18n.getLocalization(
                    "toura", "toura", toura.app.Config.get("locale")
                  ).STARTUP_NO_NETWORK
                );
              }

              dojo.publish('/app/started');
            });

          }
        );
      }, 200);
    });

  });

    if (toura.features.debugToolbar) { toura.app._Debug(); }
  };

document.addEventListener("deviceready", function() {
  dojo.ready(readyFn);
}, false);

}


dojo.i18n._preloadLocalizations("toura.nls.base", ["ROOT","en","en-us","xx"]);
