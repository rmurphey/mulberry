dojo.provide('toura.app.URL');

toura.app.URL = {
  home : function() {
    return '#/home';
  },

  about : function() {
    return '#/about';
  },

  maps : function() {
    return '#/maps';
  },

  favorites : function() {
    return '#/favorites';
  },

  node : function(nodeId) {
    return '#/node/' + nodeId;
  },

  search : function() {
    return '#/search';
  },

  searchTerm : function(term) {
    return toura.app.URL.search() + '/' + term;
  },

  searchResult : function(context) {
    var url = [ 'node', context.node ];

    if (context.type !== 'node') {
      url.push(context.type, context.id);
    }

    return '#/' + url.join('/');
  },

  update : function() {
    return '#/update';
  },

  storedAsset : function(type, filename) {
    var dirs = {
          'image' : 'images',
          'video' : 'videos',
          'audio' : 'audios',
          'videoPoster' : 'videos/poster'
        };

    return [ toura.mediaDir || 'media', dirs[type], filename ].join('/');
  },

  googleMapAddress : function(address) {
    var url = 'http://maps.google.com/maps?',
        params = { q : address };

    return url + dojo.objectToQuery(params);
  },

  protocol : function() {
    return (/^https/).test(document.location.protocol) ? 'https' : 'http';
  },

  tel : function(tel) {
    return 'tel:' + tel.replace(/\W/g, '');
  },

  feedItem : function(feedId, itemIndex) {
    return '/feed/' + feedId + '/item/' + itemIndex;
  }
};
