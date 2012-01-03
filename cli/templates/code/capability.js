dojo.provide('client.capabilities.{{name}}');

mulberry.capability('{{name}}', {
  requirements : {
  /*
   *  <componentLocalVariableName> : '<componentName>'
   *  e.g.:
   *  myImageThingee : 'ImageThingee'
   */
  },

  connects : [
  /*
   * ['<componentLocalVariableName>', '<eventName>', '<methodName>']
   */
  ],

  init : function() {
  }
});

