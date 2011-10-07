dojo.provide('toura.tests.perf');

dojo.require('dojo.string');
dojo.require('dojo.cache');
dojo.require('vendor.haml');

dojo.require('toura.app.Config');
dojo.require('toura.app.Data');
dojo.require('toura.app.Local');
dojo.require('toura.app.user.Favorites');
dojo.require('toura.app.Phonegap');
dojo.require('toura.app.UI');

dojo.require('toura.pageControllers.node.Audios1');

console.log = function() {};

toura.app.Local.fetch().then(function(data) {

toura.app.Phonegap.init();
toura.app.Data = new toura.app.Data(data.items);
toura.app.Config.set('app', data.app);
dojo.publish('/app/ready');

var target = dojo.byId('target'),
    resultsTarget = dojo.byId('results'),
    resultTpl = '<tr><th>${name}</th> <td>${avg}ms</td> <td>${med}ms</td></tr>',
    count = 30,
    mid = parseInt(count / 2, 10),
    tests;

function logResult(test, results) {
  var total = 0, avg, median;

  // calculate average
  dojo.forEach(results, function(t) { total += t; });
  avg = total / results.length;

  // calculate median
  results = results.sort(function(a, b) {
    if (a < b) { return -1; }
    if (a > b) { return 1; }
    return 0;
  });

  median = (results[mid - 1] + results[mid]) / 2;

  dojo.place(dojo.string.substitute(
    resultTpl,
    {
      name : test,
      avg : avg,
      med : median
    }
  ), resultsTarget);
}

function doIt(test) {
  console.log('>>>>> test for', test.name);

  var start, end,
      results = [],
      fn = test.fn,
      cnt = count;

  while (cnt--) {
    start = new Date().getTime();
    fn();
    end = new Date().getTime();
    results.push(end - start);
  }

  logResult(test.name, results);
}

var components = [
  'AppNav',
  'AssetList',
  'AudioPlayer',
  'BodyText',
  'ChildNodes',
  // 'GoogleMap',
  'HeaderImage',
  'ImageDetail',
  'ImageGallery',
  'ImagesFullScreen',
  'NodeGallery',
  'PageNav',
  'SearchInput',
  'SearchResults',
  'VideoPlayer',
  'PinInfo'         // this one isn't working for some reason
];

var nodePageControllers = [
  'Default',
  'Audios1',
  // 'GoogleMap1',
  'Home1',
  'Images1',
  'StaticMapImages1',
  'Videos1'
];


var nodes = {
  Audios1 : 'node-369',
  Default : 'node-365',
  Home1 : 'node-365',
  GoogleMap1 : 'node-371',
  Images1 : 'node-368',
  StaticMapImages1 : 'node-376',
  Videos1 : 'node-372'
};

dojo.forEach(nodePageControllers, function(c) {
  var name = 'toura.pageControllers.node.' + c,
      node = toura.app.Data.getModel(nodes[c]);

  console.log('node', nodes[c], 'is', node);

  dojo.require(name);

  dojo.addOnLoad(function() {
    doIt({
      name : name,
      fn : function() {
        var comp = new toura.pageControllers.node[c]({
          device : { os : 'ios', type : 'phone' },
          node : node
        }).placeAt(target);
        comp.destroy();
      }
    });
  });
});

/*
dojo.forEach(components, function(c) {
  var name = 'toura.components.' + c;
  dojo.require(name);

  dojo.addOnLoad(function() {
    doIt({
      name : name,
      fn : function() {
        var comp = new toura.components[c]({}).placeAt(target);
        comp.destroy();
      }
    });
  });
});
*/

});
