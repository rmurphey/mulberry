dojo.provide('toura._Model');

dojo.require('dojo.Stateful');

dojo.declare('toura._Model', dojo.Stateful, {
  format : function() {}
});

toura.model = function(name, proto) {
  dojo.declare(
    'client.models.' + name,
    toura._Model,
    proto
  );
};
