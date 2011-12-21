dojo.provide('toura.models.Favorite');

dojo.require('dojo.date.locale');

dojo.declare('toura.models.Favorite', [], {
  constructor : function(obj) {
    var added = new Date(),
        favorite = {
          id : obj.id,
          type : 'node',
          name : obj.name,
          added : added.getTime(),
          displayDate : dojo.date.locale.format(added, {
            datePattern : 'd MMMM yyy',
            timePattern : 'H:m'
          })
        };

    dojo.mixin(this, favorite);
  }
});
