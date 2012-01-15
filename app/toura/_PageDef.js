dojo.provide('toura._PageDef');

toura.pagedefs = toura.pagedefs || {};

toura.pageDef = function(name, config) {
  if (!config.screens || !config.screens.length) {
    throw 'Page definition must include at least one screen';
  }

  dojo.forEach(config.screens, function(screen) {
    if (!screen.regions || !screen.regions.length) {
      throw 'Page definition must include at least one region per screen';
    }
  });


  toura.pagedefs[name] = config;
};
