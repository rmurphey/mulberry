dojo.provide('toura.app.Phonegap.audio');

toura.app.Phonegap.audio = function(pg, device) {
  var audio,
      audioSuccess = function() { },
      audioError = function(err) { };

  return {
    play : function(url) {
      console.log('toura.app.Phonegap.audio::play()');

      if (!pg) { return; }

      url = /^http/.test(url) ? url : ('/android_asset/www/' + url);
      audio = new Media(url, audioSuccess, audioError);
      audio.play();
    },

    stop : function() {
      console.log('toura.app.Phonegap.audio::stop()');

      if (!pg || !audio) { return; }

      audio.pause();
    },

    destroy : function() {
      if (!audio) { return; }

      audio.stop();
      audio.release();

      audio = null;
    }
  };
};
