dojo.provide('toura.app.DeviceStorage');

dojo.require('toura.app.Config');

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
            rowData, i;

        for (i = 0; i < len; i++) {
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
        throw new Error('Local storage interface is not defined. Cannot create database. Aborting.');
      }

      if (!window.openDatabase) {
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
