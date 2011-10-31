dojo.provide('toura.components.GoogleMap');

dojo.require('toura.components._Component');
dojo.require('toura._AsyncView');

dojo.require('dijit.DialogUnderlay');
dojo.require('toura.app.Phonegap');
dojo.require('dojo.io.script');
dojo.require('toura.app.URL');

(function (dojo) {
  var callbackUuid = 0;

  // Google Maps API v3 reference:
  // https://code.google.com/apis/maps/documentation/javascript/reference.html

  dojo.declare('toura.components.GoogleMap', [ toura.components._Component, toura._AsyncView ], {
    templateString : dojo.cache('toura.components', 'GoogleMap/GoogleMap.haml'),

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
