dojo.provide('mulberry.containers.Region');

dojo.require('mulberry.containers._LayoutBox');
dojo.require('mulberry.ui.Scrollable');

dojo.declare('mulberry.containers.Region', [ mulberry.containers._LayoutBox ], {
  templateString : dojo.cache('mulberry.containers', 'Region/Region.haml'),
  config : {},
  _scroller : null,

  postCreate : function() {
    this.inherited(arguments);

    this._placeComponents();
    this._placeRegions();
    this._setupScroller();

    this.connect(this.screen, 'startup', 'startup');
  },

  _setupScroller : function() {
    if (this.config.scrollable) {
      this._scroller = new mulberry.ui.Scrollable({}, this.pane);
      this.connect(this._scroller, 'onScrollStart', 'onScrollStart');
      this.connect(this._scroller, 'onScrollEnd', 'onScrollEnd');
    }
  },

  /*
   * If the region has scrollable=true, place the component into the .inner div
   * because iScroll needs that extra wrapper div
   */
  _placeComponents : function() {
    var placement = this.config.scrollable ? [this.inner, 'last'] : [this.pane, 'replace'] ;

    if (
      this.config.components &&
      this.config.components.length > 1 &&
      placement[0] === this.pane
    ) {
      console.error("WARNING: you're trying to place more than one component into a non-scrollable region. this will end badly.");
    }

    if (this.config.components && this.config.components.length) {
      dojo.forEach(this.config.components, function(componentName) {

        var klass = componentName.match(/^custom\./) ?
                    client.components[componentName.replace(/^custom\./, '')] :
                    mulberry.components[componentName];

        var c = this.adopt(klass, {
          baseObj : this.baseObj,
          page : this.page,
          node : this.baseObj,
          device : this.device,
          screen : this.screen,
          region : this
        });

        c.placeAt(placement[0], placement[1]);
      }, this);
    }
  },

  _placeRegions : function() {
    var placement = this.config.scrollable ? [this.inner, 'last'] : [this.domNode];

    if (this.config.regions && this.config.regions.length) {
      if(!this.config.scrollable) {
        // not scrolling, don't need the pane
        // this replicates the old functionality exactly
        dojo.destroy(this.pane);
      }

      dojo.forEach(this.config.regions, function(region) {
        this.adopt(mulberry.containers.Region, {
          config : region,
          baseObj : this.baseObj,
          device : this.device,
          screen : this.screen,
          backgroundImage : this.backgroundImage
        }).placeAt(placement[0], placement[1]);
      }, this);
    }
  },

  refreshScroller : function() {
    if (this._scroller) {
      this._scroller.refreshScroller();
    }
  },

  onScrollStart : function() {

  },

  onScrollEnd : function() {

  }
});

