dojo.provide('mulberry.app.PhoneGap.push');

dojo.require('vendor.urbanairship.push');

mulberry.app.PhoneGap.push = function(pg, device) {
  if (!pg) { return; }
  vendor.urbanairship.push();
};
