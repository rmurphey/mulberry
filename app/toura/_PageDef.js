dojo.provide('toura._PageDef');

toura.pageDefs = toura.pageDefs || {};

dojo.declare('toura._PageDef', null, {
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

toura.pageDef = function(name, config) {
  toura.pageDefs[name] = new toura._PageDef(config);
};
