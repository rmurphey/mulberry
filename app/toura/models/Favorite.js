dojo.provide('toura.models.Favorite');

dojo.declare('toura.models.Favorite', null, {
  constructor : function(obj) {

    var favorite = {
          id : obj.id,
          type : 'node',
          name : obj.name,
          added : new Date().getTime()
        };

    dojo.mixin(this, favorite);
  }
});
