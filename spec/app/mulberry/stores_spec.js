describe("store", function() {
  var s;

  beforeEach(function() {
    dojo.require('mulberry.app.DeviceStorage');
    dojo.require('mulberry._Store');
    dojo.require('mulberry._Model');

    mulberry.model('Bar', {
      format : function() {
        this.set('newattr', true);
      },

      modify : function() {
        this.modifyResult = true;
      }
    });
  });

  describe("local store", function() {
    beforeEach(function() {
      mulberry.app.DeviceStorage.set('foo', [
        { id : 1, text : 'foo' },
        { id : 2, text : 'bar' }
      ]);

      mulberry.store('foo', {
        model : 'Bar',
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
      var old = client.stores.foo.data.length;
      client.stores.foo.add({ text : 'new text' });
      expect(client.stores.foo.data.length).toBe(old + 1);
    });

    it("should add an id to added items if one is not present", function() {
      client.stores.foo.add({ text : 'newer text' });
      var result = client.stores.foo.query({ text : 'newer text' });
      expect(result[0].id).toBeDefined();
    });

    it("should return models for all items when queried without params", function() {
      var result = client.stores.foo.query();
      expect(result.length).toBe(2);
      expect(result[1] instanceof client.models.Bar).toBeTruthy();
    });

    it("should return models for the specified items when queried with params", function() {
      var result = client.stores.foo.query({ text : 'foo' });

      expect(result.length).toBe(1);
      expect(result[0] instanceof client.models.Bar).toBeTruthy();
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

    describe("function invocation", function() {
      it("should invoke a given function on the models for the provided id", function() {
        client.stores.foo.invoke(1, function(item) {
          expect(item).toBe(this);
          item.newProp = true;
        });

        expect(client.stores.foo.get(1).newProp).toBeTruthy();
      });

      it("should invoke a given method name on models for the provided id", function() {
        client.stores.foo.invoke(1, 'modify');
        expect(client.stores.foo.get(1).modifyResult).toBeDefined();
      });

      it("should work when the first argument is an array of ids", function() {
        client.stores.foo.invoke([ 1, 2 ], 'modify');

        expect(client.stores.foo.get(1).modifyResult).toBeDefined();
        expect(client.stores.foo.get(2).modifyResult).toBeDefined();
      });

      it("should return an array of the models for the given ids", function() {
        var results = client.stores.foo.invoke(1, 'modify');
        expect(results.length).toBe(1);
        expect(results[0].modifyResult).toBeDefined();
      });
    });

    describe("model creation", function() {
      beforeEach(function() {
        mulberry.store('bar', {
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

    describe('get', function() {
      it("should return a model", function() {
        client.stores.bar.setData([
          { a : 1, id : 'item-1' },
          { b : 2, id : 'item-2' }
        ]);

        var item = client.stores.bar.get('item-1');
        expect(item instanceof client.models.Bar).toBeTruthy();
      });
    });
  });
});
