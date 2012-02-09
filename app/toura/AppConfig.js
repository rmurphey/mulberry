dojo.provide('toura.AppConfig');

toura = window.toura || {};
toura._Config = {
  "id": 12345,
  "locale": "en-us",
  "buildDate": "1328737563",
  "appVersion": "4.1.0",
  "updateUrl": null,
  "versionUrl": null,
  "device": {
    "type": "phone",
    "os": "ios"
  }
};

// force all images to come from S3. this
// is mainly used by MAP for the preview window.
toura.forceLocal = false;
toura.forceStreaming = false;

// skips checking for newer remote version.
// useful for speeding up non-data dev.
toura.skipVersionCheck = false;

toura.features = {
  multiLineChildNodes : false,
  sharing : true,
  favorites : true,
  fontSize : true,
  siblingNav : true,
  debugToolbar : false,
  ads : false,
  debugPage : true
};


