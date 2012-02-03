dojo.provide('mulberry._PageDef');

mulberry.pageDefs = mulberry.pageDefs || {};

dojo.declare('mulberry._PageDef', null, {
  constructor : function(config) {
    if (!config.screens || !config.screens.length) {
      throw 'Page definition must include at least one screen';
    }

    dojo.forEach(config.screens, function(screen) {
      if (!screen.regions || !screen.regions.length) {
        throw 'Page definition must include at least one region per screen';
      }
    });

    dojo.mixin(this, config);
  }
});

mulberry.pageDef = function(name, config) {
  mulberry.pageDefs[name] = new mulberry._PageDef(config);
};
