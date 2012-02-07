dojo.provide('mulberry.app.URL');

mulberry.app.URL = {
  protocol : function() {
    return (/^https/).test(document.location.protocol) ? 'https' : 'http';
  },

  tel : function(tel) {
    return 'tel:' + tel.replace(/\W/g, '');
  },

  googleMapAddress : function(address) {
    var url = 'http://maps.google.com/maps?',
        params = { q : address };

    return url + dojo.objectToQuery(params);
  }
};
