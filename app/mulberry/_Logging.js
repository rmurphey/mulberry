dojo.provide('mulberry._Logging');

(function(d, w, c) {

var lastSection,
    sep = '=====',
    lastSectionTime,
    lastLogTime = new Date().getTime();

//>>excludeStart('production', kwArgs.releaseName == 'production');
function getTimeElapsed(ts) {
  var str = '';

  if (!lastSectionTime) {
    lastSectionTime = ts;
  } else {
    str = ' (' + (ts - lastSectionTime) + 'ms since last log) ';
    lastSectionTime = ts;
  }

  return str;
}
//>>excludeEnd('production');

d.mixin(mulberry,{
  log : function() {
    //>>excludeStart('production', kwArgs.releaseName == 'production');
    var msg = [].slice.call(arguments),
        timeNow = new Date().getTime();

    console.log(timeNow - lastLogTime);

    if (w.device) {
      console.log('\n\n ' + msg.join(' ') + '\n\n');
    } else {
      c.log.apply(c, msg);
    }

    lastLogTime = timeNow;
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
