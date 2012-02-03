dojo.provide('mulberry._Model');

dojo.require('dojo.Stateful');

dojo.declare('mulberry._Model', dojo.Stateful, {
  format : function() {}
});

mulberry.model = function(name, proto) {
  dojo.declare(
    'client.models.' + name,
    mulberry._Model,
    proto
  );
};
