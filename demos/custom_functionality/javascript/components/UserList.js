dojo.provide('client.components.UserList');

mulberry.component('UserList', {
  componentTemplate : dojo.cache('client.components', 'UserList/UserList.haml'),

  prep : function() {
    this.users = this.baseObj.getData('users').users;
  },

  init : function() {
    this.connect(this.domNode, 'click', '_handleClick');
  },

  _handleClick : function(e) {
    var target = e.target;
    if (target.nodeName.toLowerCase() !== 'li') { return; }
    this.onSelect(dojo.attr(target, 'data-twitter-username'));
  },

  onSelect : function(username) {
    // stub for connection
  }
});
