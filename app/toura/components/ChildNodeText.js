dojo.provide('toura.components.ChildNodeText');

dojo.require('toura.components.ChildNodes');
dojo.require('toura.components.BodyText');

dojo.declare('toura.components.ChildNodeText', toura.components.ChildNodes, {
  templateString : dojo.cache('toura.components', 'ChildNodeText/ChildNodeText.haml'),
  handleClicks : true
});
