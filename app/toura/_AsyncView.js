dojo.provide('toura._AsyncView');

dojo.declare('toura._AsyncView', [], {
  postMixInProperties : function() {
    this.inherited(arguments);
    this.queue = [];
  },

  _addToQueue : function(fn) {
    this.queue.push(fn);
  },

  _doQueue : function() {
    dojo.forEach(this.queue, function(fn) {
      fn();
    }, this);
  }
});

