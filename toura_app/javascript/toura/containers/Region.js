dojo.provide('toura.containers.Region');

dojo.require('toura.containers._LayoutBox');
dojo.require('toura.ui.Scrollable');

dojo.declare('toura.containers.Region', [ toura.containers._LayoutBox ], {
  templateString : dojo.cache('toura.containers', 'Region/Region.haml'),
  config : {},
  _scroller : null,

  postCreate : function() {
    this.inherited(arguments);

    this._placeComponents();
    this._placeRegions();
    this._setupScroller();

    this.addClass(this.boxType);
    this.connect(this.screen, 'startup', 'startup');
  },

  _setupScroller : function() {
    if (this.config.scrollable) {
      this._scroller = new toura.ui.Scrollable({}, this.pane);
    }
  },

  /*
   * Depending on some parameters from the region definition in templates.json,
   * components need to be placed differently in order to get the correct dom
   * structure.
   *
   * Rules:
   *
   * The default placement is to replace the .pane elemement with the component.
   * We don't want the extra dom by placing in .inner
   * BUG: If you place multiple components, only the last component will end up
   * in the dom.
   *
   * If the region has scrollable=true, place the component into the .inner div
   * because iScroll needs that extra wrapper div
   *
   * If containerType==component, place the component directly into .region. We
   * don't need any of the extra container elements because we want the region to
   * take the size of the component itself (used for stuff like PageNav
   */
  _placeComponents : function() {
    // TODO: There is probably a clearer way to get the results we need
    var placement = this.containerType === 'component' ? [this.domNode, 'replace'] :
                    this.config.scrollable ? [this.inner, 'last'] :
                    [this.pane, 'replace'] ;

    if (
      this.config.components &&
      this.config.components.length > 1 &&
      placement[0] === this.pane
    ) {
      console.error("WARNING: you're trying to place more than one component into a non-scrollable region. this will end badly.");
    }

    if (this.config.components && this.config.components.length) {
      dojo.forEach(this.config.components, function(componentName) {

        // don't create page nav on home node pages
        if (
          componentName === 'PageNav' &&
          this.baseObj.id === toura.app.Config.get('app').homeNodeId
        ) { return; }

        var klass = componentName.match('custom:') ?
                    client.components[componentName.replace('custom:', '')] :
                    toura.components[componentName];

        var c = this.adopt(klass, {
          baseObj : this.baseObj,
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
    if (this.config.regions && this.config.regions.length) {
      // if we're placing regions, we don't need the pane div
      dojo.destroy(this.pane);

      dojo.forEach(this.config.regions, function(region) {
        this.adopt(toura.containers.Region, {
          config : region,
          baseObj : this.baseObj,
          device : this.device,
          screen : this.screen,
          backgroundImage : this.backgroundImage,
          boxType : this.config.containerType
        }).placeAt(this.domNode);
      }, this);
    }
  },

  refreshScroller : function() {
    if (this._scroller) {
      this._scroller.refreshScroller();
    }
  }

});

