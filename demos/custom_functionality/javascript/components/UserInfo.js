dojo.provide('client.components.UserInfo');

mulberry.component('UserInfo', {
  componentTemplate : dojo.cache('client.components', 'UserInfo/UserInfo.haml'),

  _setUserAttr : function(user) {
    this.nameNode.innerHTML = user.name;
    this.twitterLinkNode.href = '#/twitter/' + user.twitter;
    this.bioNode.innerHTML = user.bio || '';
  }
});
