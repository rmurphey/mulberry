dojo.provide('toura.components.Hotspots');

dojo.require('toura.components._Component');
dojo.require('vendor.iscroll');
dojo.require('toura.ui.BackgroundImage');

dojo.declare('toura.components.Hotspots', [ toura.components._Component ], {
  templateString : dojo.cache('toura.components', 'Hotspots/Hotspots.haml'),

  widgetsInTemplate : true,
  prepareData : function() {
    var data = this.node.data[0].json;
    this.hotspots = data.hotspots;
    this.image = this.node.images[0].original;
  },

  setupConnections : function() {
    this.connect(this.imageNode, 'click', '_handleImageClick');
  },

  postCreate : function() {
    this.inherited(arguments);

    this.scroller = new iScroll(this.domNode, {
      zoom : false,
      bounce : false
    });

    dojo.style(this.imageWrapper, {
      'width' : this.image.width + 'px',
      'height' : this.image.height + 'px'
    });
  },

  _handleImageClick : function(e) {
    e.preventDefault();

    var x = e.offsetX,
        y = e.offsetY,
        foundSpot;

    dojo.forEach(this.hotspots, function(spot) {
      if (foundSpot) { return; }

      var nodeId;

      if (spot.shape === 'rectangle') {
        if (
          x > spot.left &&
          y > spot.top &&
          x < (spot.left + spot.width) &&
          y < (spot.top + spot.height)
        ) {
          foundSpot = spot;
        }
      }

      if (spot.shape === 'circle') {
        var radius = spot.width / 2,
            spotCenterX = spot.left + radius,
            spotCenterY = spot.top + radius,
            hyp = Math.sqrt(
              Math.pow(spotCenterY - y, 2) + Math.pow(spotCenterX - x, 2)
            );

        if (hyp < radius) {
          foundSpot = spot;
        }
      }

    }, this);

    if (foundSpot) {
      toura.app.UI.click = { x : x, y : y };
      toura.app.Router.go(toura.app.URL.node(foundSpot.node_id));
    }
  },

  startup : function() {
    var params = dojo.mixin({}, toura.app.UI.click),
        nodeHeight = this.domNode.clientHeight,
        nodeWidth = this.domNode.clientWidth,
        newX = 0, newY = 0,
        x, y;

    toura.app.UI.click = false;

    this.inherited(arguments);
    this.scroller.refresh();

    if (params) {
      x = +params.x;
      y = +params.y;
    } else {
      x = this.image.width / 2;
      y = this.image.height / 2;
    }

    if (x > nodeWidth / 2) {
      newX = nodeWidth > nodeHeight ? x : Math.floor(x - (nodeWidth / 2));
    }

    if (y > nodeHeight / 2) {
      newY = y;
    }

    this.scroller.scrollTo(newX * -1, newY * -1, 0);
  }
});
