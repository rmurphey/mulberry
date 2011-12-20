dojo.provide('toura._Logging');

(function(d, w, c) {

var lastSection,
    sep = '=====',
    lastTime;

//>>excludeStart('production', kwArgs.releaseName == 'production');
function getTimeElapsed(ts) {
  var str = '';

  if (!lastTime) {
    lastTime = ts;
  } else {
    str = ' (' + (ts - lastTime) + 'ms since last log) ';
    lastTime = ts;
  }

  return str;
}
//>>excludeEnd('production');

d.mixin(toura,{
  log : function() {
    //>>excludeStart('production', kwArgs.releaseName == 'production');
    var msg = [].slice.call(arguments);

    if (w.device) {
      console.log('\n\n ' + new Date().getTime() + ' ' + msg.join(' ') + '\n\n');
    } else {
      c.log.apply(c, msg);
    }
    //>>excludeEnd('production');
  },

  logSection : function(sectionName) {
    //>>excludeStart('production', kwArgs.releaseName == 'production');
    var ts = new Date().getTime();
    console.log((w.device ? '\n' : '') + sep + '\n' + ts + '   START ' + sectionName +
      getTimeElapsed(ts) +
    '\n' + sep);
    //>>excludeEnd('production');
  },

  endLogSection : function(sectionName) {
    //>>excludeStart('production', kwArgs.releaseName == 'production');
    var ts = new Date().getTime();
    console.log((w.device ? '\n' : '') + sep + '\n' + ts + '   END   ' + sectionName +
      getTimeElapsed(ts) +
    '\n' + sep);
    //>>excludeEnd('production');
  }
});

}(dojo, window, console));
