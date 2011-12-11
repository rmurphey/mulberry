dojo.provide('client.components.Browser');

mulberry.component('Browser', {
  componentTemplate : dojo.cache('client.components', 'Browser/Browser.haml'),

  init : function() {
    this.connect(this.browserButton, 'click', '_openBrowser');
  },

  _openBrowser : function() {
    toura.app.PhoneGap.browser.url('http://www.google.com');
  }
});
