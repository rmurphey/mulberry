dojo.provide('toura.app.PhoneGap.push');

dojo.require('vendor.urbanairship.push');

toura.app.PhoneGap.push = function(pg, device) {
  if (!pg) { return; }
  vendor.urbanairship.push();
};
