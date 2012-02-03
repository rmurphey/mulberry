dojo.provide('mulberry.models.SearchResult');

dojo.require('mulberry.models.Node');

dojo.declare('mulberry.models.SearchResult', [], {
  constructor : function(store, item) {
    var context = item.context,
        textAsset = item.textAsset,
        node;

    if (!context) {
      // we're dealing with a node search result
      node = new mulberry.models.Node(store, item);
      dojo.mixin(this, {
        type : 'node',
        nodeId : node.id,
        displayName : node.name,
        displayText : node.bodyText ? node.bodyText.body || '' : '',
        url : mulberry.app.URL.searchResult({
          type : 'node',
          node : node.id
        }),
        nodeTitle : node.name
      });

      return;
    }

    // if there's a context, we're dealing with
    // a text asset search result
    dojo.mixin(this, {
      nodeId : context.node,
      type : context.type,
      displayName : textAsset.name,
      displayText : textAsset.body,
      url : mulberry.app.URL.searchResult(context)
    });

    store.fetchItemByIdentity({
      identity : context.node,
      onItem : function(item) {
        var n = new mulberry.models.Node(store, item);

        this.nodeTitle = n.name;

        if (context.type !== 'node') {
          this.asset = n.getAssetById(context.type, context.id);
        }
      },
      scope : this
    });
  }
});
