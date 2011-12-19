dojo.provide('toura.capabilities.Page_Audios');

dojo.require('toura._Capability');

dojo.declare('toura.capabilities.Page_Audios', [ toura._Capability ], {
  requirements : {
    audioPlayer : 'AudioPlayer',
    audioList : 'AudioList'
  },

  connects : [
    [ 'page', 'init', '_setup' ]
  ],

  _setup : function(pageState) {
    if (this.baseObj.audios.length < 2) {
      dojo.destroy(this.audioList.domNode);
    }

    this._loadAudio(pageState);
  },

  _loadAudio : function(pageState) {
    // only when navigating directly to the audio instead of just the node
    if (!pageState.assetId || pageState.assetType !== 'audios') { return; }

    var audioId = pageState.assetId,
        audio = this._audioById(audioId);

    if (this.audioList) {
      this.audioList.set('currentAsset', audioId);
    }

    if (this.audioCaption) {
      this.audioCaption.set('content', audio.caption || '');
    }

    this.audioPlayer.set('mediaId', audioId);
  }
});
