describe("utilities", function() {
  var obj = {
        a : 1,
        b : 2,
        c : 3
      };

  beforeEach(function() {
    dojo.require('mulberry.Utilities');
  });

  describe("dojo.forIn", function() {
    it("should use window as its scope if none is provided", function() {
      var scope;

      dojo.forIn(obj, function(k, v) {
        scope = this;
      });

      expect(scope).toBe(window);
    });

    it("should use a different scope if one is provided", function() {
      var scope;

      dojo.forIn(obj, function(k, v) {
        scope = this;
      }, obj);

      expect(scope).toBe(obj);
    });

    it("should iterate over the object", function() {
      var str = '', num = 0;

      dojo.forIn(obj, function(k, v) {
        str += k;
        num += v;
      });

      expect(str).toBe('abc');
      expect(num).toBe(6);
    });
  });

  describe("mulberry.util.truncate", function() {
    it("should return a truncated string with HTML stripped", function() {
      var str = "<p>Lorem ipsum foo bar baz</p>";
      var truncated = mulberry.util.truncate(str, 10);
      expect(truncated).toBe('Lorem ipsu &hellip;');
    });

    it("should not add a &hellip; if no truncation was required", function() {
      var str = "<p>Lorem ipsum foo bar baz</p>";
      var truncated = mulberry.util.truncate(str, 200);
      expect(truncated).toBe('Lorem ipsum foo bar baz');
    });
  });

  describe("mulberry.util.copyStyles", function() {
    it("should copy styles from one element to another", function() {
      var t = dojo.byId('test'),
        fromEl = dojo.create('div', {
          style : {
            color : 'blue',
            width : '99px',
            height : '199px'
          }
        }, t),
        toEl = dojo.create('div', null, t, 'last');

      mulberry.util.copyStyles(fromEl, toEl, ['color', 'width']);

      expect(
        dojo.style(toEl, 'color')
      ).toBe(
        dojo.style(fromEl, 'color')
      );

      expect(
        dojo.style(toEl, 'width')
      ).toBe(
        dojo.style(fromEl, 'width')
      );

      expect(
        dojo.style(toEl, 'height')
      ).not.toBe(
        dojo.style(fromEl, 'height')
      );
    });
  });

  describe('mulberry.jsonp', function() {
    it("should return a promise", function() {
      var ret = mulberry.jsonp('http://search.twitter.com/search.json?q=mulberry');
      expect(ret.then).toBeDefined();
    });

	/* TODO: This is removed pending better integration with Travis-CI */
    xit("should resolve the promise with the returned data", function() {
      var ret = mulberry.jsonp('http://search.twitter.com/search.json?q=mulberry'),
          flag = false;

      runs(function() {
        ret.then(function() { flag = true; }, function() { flag = true; });
      });

      waits(500);

      runs(function() {
        expect(flag).toBeTruthy();
      });
    });

	/* TODO: This is removed pending better integration with Travis-CI */
    xit("should accept just a config object", function() {
      var ret = mulberry.jsonp({
            url : 'http://search.twitter.com/search.json?q=mulberry',
            load : function() { flag = true; }
          }),
          flag = false;

      waits(500);

      runs(function() {
        expect(flag).toBeTruthy();
      });
    });

	/* TODO: This is removed pending better integration with Travis-CI */
    xit("should accept a url and a config object", function() {
      var ret = mulberry.jsonp('http://search.twitter.com/search.json?q=mulberry', {
            load : function() { flag = true; }
          }),
          flag = false;

      waits(500);

      runs(function() {
        expect(flag).toBeTruthy();
      });
    });
  });
});
