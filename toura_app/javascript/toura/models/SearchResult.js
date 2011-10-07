dojo.provide('toura.models.SearchResult');

dojo.require('toura.models.Node');

dojo.declare('toura.models.SearchResult', [], {
  constructor : function(store, item) {
    var context = item.context,
        textAsset = item.textAsset,
        node;

    if (!context) {
      // we're dealing with a node search result
      node = new toura.models.Node(store, item);
      dojo.mixin(this, {
        type : 'node',
        nodeId : node.id,
        displayName : node.name,
        displayText : node.bodyText ? node.bodyText.body || '' : '',
        url : toura.app.URL.searchResult({
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
      url : toura.app.URL.searchResult(context)
    });

    store.fetchItemByIdentity({
      identity : context.node,
      onItem : function(item) {
        var n = new toura.models.Node(store, item);

        this.nodeTitle = n.name;

        if (context.type !== 'node') {
          this.asset = n.getAssetById(context.type, context.id);
        }
      },
      scope : this
    });
  }
});
