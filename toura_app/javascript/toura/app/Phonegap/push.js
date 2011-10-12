dojo.provide('toura.app.Phonegap.push');

dojo.require('vendor.urbanairship.push');

toura.app.Phonegap.push = function(pg, device) {
  if (!pg) { return; }
  vendor.urbanairship.push();
};
