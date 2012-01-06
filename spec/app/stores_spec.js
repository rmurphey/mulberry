describe("local store", function() {
  var s;

  beforeEach(function() {
    dojo.require('toura.app.DeviceStorage');
    dojo.require('toura._Store');
    dojo.require('toura._Model');
  });

  describe("local store", function() {
    beforeEach(function() {
      toura.app.DeviceStorage.set('foo', [
        { id : 1, text : 'foo' },
        { id : 2, text : 'bar' }
      ]);

      toura.store('foo', {
        bar : 'baz'
      });
    });

    it("should create a store", function() {
      expect(client.stores.foo).toBeDefined();

      dojo.forEach([
        'add',
        'put',
        'remove',
        'query',
        'setData'
      ], function(method) {
        expect(client.stores.foo[method]).toBeDefined();
      });

      expect(client.stores.foo.bar).toBe('baz');
    });

    it("should load items from device storage", function() {
      expect(client.stores.foo.data[0].id).toBe(1);
      expect(client.stores.foo.data[0].text).toBe('foo');
    });

    it("should add items", function() {
      client.stores.foo.add({ text : 'new text' });
      expect(client.stores.foo.data.length).toBe(3);
    });

    it("should return all items when queried without params", function() {
      expect(client.stores.foo.query().length).toBe(2);
    });

    it("should return specified items when queried with params", function() {
      expect(client.stores.foo.query({ text : 'foo' }).length).toBe(1);
    });

    it("should allow setting of data", function() {
      client.stores.foo.setData([ 1, 2, 3, 4 ]);
      expect(client.stores.foo.data.length).toBe(4);
    });

    it("should remove items", function() {
      client.stores.foo.remove(2);
      expect(client.stores.foo.data.length).toBe(1);
      expect(client.stores.foo.query({ text : 'foo' }).length).toBe(1);
    });

    it("should ensure added items have an id", function() {
      client.stores.foo.add({ text : 'no id' });
      expect(client.stores.foo.query({ text : 'no id' })[0].id).toBeDefined();
    });

    describe("model creation", function() {
      beforeEach(function() {
        toura.model('Bar', {
          format : function() {
            this.set('newattr', true);
          }
        });

        toura.store('bar', {
          model : 'Bar',
          doIt : function() {
            return this.process([
              { a : 1 },
              { b : 2 },
              { c : 3 }
            ]);
          }
        });
      });

      it("should mix in the provided object", function() {
        var d = client.stores.bar.doIt();

        expect(d[0].a).toBe(1);
        expect(d[1].b).toBe(2);
        expect(d[2].c).toBe(3);
      });

      it("should run the model's format method", function() {
        var d = client.stores.bar.doIt();

        expect(d[0].newattr).toBeTruthy();
        expect(d[1].newattr).toBeTruthy();
        expect(d[2].newattr).toBeTruthy();
      });

      it("should create an instance of the specified model", function() {
        var d = client.stores.bar.doIt();

        expect(d[0] instanceof client.models.Bar).toBeTruthy();
        expect(d[1] instanceof client.models.Bar).toBeTruthy();
        expect(d[2] instanceof client.models.Bar).toBeTruthy();
      });
    });
  });
});
