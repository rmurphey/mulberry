describe("PhoneGap bridge", function() {
  var pg;

  beforeEach(function() {
    dojo.require('toura.app.PhoneGap');
    if (!pg) {
      dojo.publish('/app/deviceready');
      pg = toura.app.PhoneGap;
    }
  });

  describe("toura.app.PhoneGap.device", function() {
    it("should return the device version", function() {
      var uas = [
        // Android UAs
        { ua : 'Mozilla/5.0 (Linux; U; Android 1.6; en-gb; Dell Streak Build/Donut AppleWebKit/528.5+ (KHTML, like Gecko) Version/3.1.2 Mobile Safari/ 525.20.1', v : '1-6' },
        { ua : 'Mozilla/5.0 (Linux; U; Android 2.2; en-us; Nexus One Build/FRF91) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1', v : '2-2' },
        { ua : 'Mozilla/5.0 (Linux; U; Android 2.1; en-us; Nexus One Build/ERD62) AppleWebKit/530.17 (KHTML, like Gecko) Version/4.0 Mobile Safari/530.17', v : '2-1' },
        { ua : 'Mozilla/5.0 (Linux; U; Android 2.1-update1; de-de; HTC Desire 1.19.161.5 Build/ERE27) AppleWebKit/530.17 (KHTML, like Gecko) Version/4.0 Mobile Safari/530.17', v : '2-1' },
        { ua : 'Mozilla/5.0 (Linux; U; Android 2.2; nl-nl; Desire_A8181 Build/FRF91) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1', v : '2-2' },
        { ua : 'Mozilla/5.0 (Linux; U; Android 2.1-update1; en-us; ADR6300 Build/ERE27) AppleWebKit/530.17 (KHTML, like Gecko) Version/4.0 Mobile Safari/530.17', v : '2-1' },
        { ua : 'Mozilla/5.0 (Linux; U; Android 2.2; en-us; DROID2 GLOBAL Build/S273) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1', v : '2-2' },
        { ua : 'Mozilla/5.0 (Linux; U; Android 2.1-update1; en-us; DROIDX Build/VZW) AppleWebKit/530.17 (KHTML, like Gecko) Version/4.0 Mobile Safari/530.17 480X854 motorola DROIDX', v : '2-1' },
        { ua : 'Mozilla/5.0 (Linux; U; Android 2.1-update1; en-us; Droid Build/ESE81) AppleWebKit/530.17 (KHTML, like Gecko) Version/4.0 Mobile Safari/530.17', v : '2-1' },
        { ua : 'Mozilla/5.0 (Linux; U; Android 2.0; en-us; Droid Build/ESD20) AppleWebKit/530.17 (KHTML, like Gecko) Version/4.0 Mobile Safari/ 530.17', v : '2-0' },
        { ua : 'Mozilla/5.0 (Linux; U; Android 2.2; en-gb; GT-P1000 Build/FROYO) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1', v : '2-2' },
        { ua : 'Mozilla/5.0 (Linux; U; Android 2.0.1; en-us; Droid Build/ESD56) AppleWebKit/530.17 (KHTML, like Gecko) Version/4.0 Mobile Safari/530.17', v : '2-0' },

        // iOS UAs
        { ua : 'Mozilla/5.0 (iPad; U; CPU OS 3_2_1 like Mac OS X; es-es) AppleWebKit/531.21.10 (KHTML, like Gecko) Mobile/7B405', v : 'unknown-ios-webkit' },
        { ua : 'Mozilla/5.0 (iPad; U; CPU OS 3_2_1 like Mac OS X; es-es) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B405 Safari/531.21.10', v : 'unknown-ios-webkit' },
        { ua : 'Mozilla/5.0 (iPad; U; CPU OS 3_2_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B500 Safari/531.21.10', v : 'unknown-ios-webkit' },
        { ua : 'Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B367 Safari/531.21.10', v : 'unknown-ios-webkit' },
        { ua : 'Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B367 Safari/531.21.10', v : 'unknown-ios-webkit' },
        { ua : 'Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B367 Safari/531.21.10', v : 'unknown-ios-webkit' },
        { ua : 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_1_2 like Mac OS X; en-us) AppleWebKit/528.18 (KHTML, like Gecko) Version/4.0 Mobile/7D11 Safari/528.16', v : 'unknown-ios-webkit' },
        { ua : 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_0 like Mac OS X; en-us) AppleWebKit/528.18 (KHTML, like Gecko) Version/4.0 Mobile/7A341 Safari/528.16', v : 'unknown-ios-webkit' },
        { ua : 'Mozilla/5.0 (iPhone; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1A543a Safari/419.3', v : 'unknown-ios-webkit' },

        // Unsupported UAs
        { ua : 'Mozilla/4.0 (PDA; PalmOS/sony/model crdb/Revision:1.1.36(de)) NetFront/3.0', v : 'unknown' },
        { ua : 'Mozilla/5.0 (BlackBerry; U; BlackBerry 9800; en) AppleWebKit/534.1+ (KHTML, Like Gecko) Version/6.0.0.141 Mobile Safari/534.1+', v : 'unknown' },
        { ua : 'BlackBerry9700/5.0.0.351 Profile/MIDP-2.1 Configuration/CLDC-1.1 VendorID/123', v : 'unknown' },
        { ua : 'Mozilla/4.0 (compatible; MSIE 4.01; Windows CE; PPC; 240x320; HP iPAQ h6300)', v : 'unknown' },
        { ua : 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; HTC_Touch_Diamond2_T5353; Windows Phone 6.5)', v : 'unknown' },

        { ua : '', v : 'unknown' },
        { ua : [], v : 'unknown' },
        { ua : [], v : 'unknown' },
        { ua : undefined, v : 'unknown' },
        { ua : ' ', v : 'unknown' }
      ];

      toura.app.PhoneGap.present = false;

      dojo.forEach(uas, function(item) {
        expect(toura.app.PhoneGap.device._parseVersion(item.ua)).toBe(item.v, item.ua || 'undefined');
      });
    });
  });

  describe("toura.app.PhoneGap.accelerometer", function() {
    var a;

    beforeEach(function() {
      a = toura.app.PhoneGap.accelerometer;
    });

    it("should be defined", function() {
      expect(a).toBeDefined();
    });

    it("should define the expected methods", function() {
      expect(a.getCurrentAcceleration).toBeDefined();
      expect(a.watchAcceleration).toBeDefined();
      expect(a.clearWatch).toBeDefined();
    });

    describe("getCurrentAcceleration", function() {
      it("should return a promise", function() {
        expect(dojo.isFunction(a.getCurrentAcceleration().then)).toBeTruthy();
      });
    });
  });

  describe("toura.app.PhoneGap.geolocation", function() {
    var g;

    beforeEach(function() {
      g = toura.app.PhoneGap.geolocation;
    });

    it("should be defined", function() {
      expect(g).toBeDefined();
    });

    it("should define the expected methods", function() {
      expect(g.getCurrentPosition).toBeDefined();
      expect(g.watchPosition).toBeDefined();
      expect(g.clearWatch).toBeDefined();
    });

    describe("getCurrentPosition", function() {
      it("should return a promise", function() {
        expect(dojo.isFunction(g.getCurrentPosition().then)).toBeTruthy();
      });
    });
  });

  describe("toura.app.PhoneGap.camera", function() {
    var c;

    beforeEach(function() {
      c = toura.app.PhoneGap.camera;
    });

    it("should be defined", function() {
      expect(c).toBeDefined();
    });

    it("should define the expected methods", function() {
      expect(c.getPicture).toBeDefined();
    });

    describe("getPicture", function() {
      it("should return a promise", function() {
        expect(dojo.isFunction(c.getPicture().then)).toBeTruthy();
      });
    });
  });
});
