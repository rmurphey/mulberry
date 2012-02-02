/*jslint evil:true */
dojo.provide('toura._View');

/*
 * The base view class, to be inherited by all views.
 */

dojo.require('toura.Device');
dojo.require('dijit._Widget');
dojo.require('dijit._Templated');
dojo.require('toura._Nls');
dojo.require('toura.app.Config');

dojo.require('toura.ui.Scrollable');
dojo.require('toura.ui.Clickable');
dojo.require('vendor.mustache');

(function() {

var _tmplCache = {},
    templateStringTests = {
      'haml' : {
        firstChars : [ '.', '%' ],
        tmplFn : Haml
      },

      'mustache' : {
        firstChars : [ '{', '<' ],
        tmplFn : function(tmpl) {
          return dojo.partial(Mustache.render, tmpl);
        }
      }
    };

dojo.declare('toura._View', [ dijit._Widget, dijit._Templated, toura._Nls ], {
  templateString : '%div',
  isHidden : false,
  isDisabled : false,

  postMixInProperties : function() {
    // make sure the device info is available
    this.inherited(arguments);

    if (!this.device) {
      this.device = toura.Device;
    }

    this.phone = this.device.type === 'phone';
    this.tablet = this.device.type === 'tablet';
  },

  _skipNodeCache : true,

  _stringRepl : function(tmpl) {
    var t = _tmplCache[tmpl];

    if (!t) {
      dojo.forIn(templateStringTests, function(lang, settings) {
        if (t) { return; }
        if (dojo.indexOf(settings.firstChars, tmpl[0]) > -1) {
          t = _tmplCache[tmpl] = settings.tmplFn(tmpl);
        }
      });
    }

    return t(this);
  },

  postCreate : function() {
    this.inherited(arguments);
  },

  /**
   * Reference for the following methods is at http://higginsforpresident.net/2010/01/widgets-within-widgets/
   */
  adopt: function(/* Function */cls, /* Object? */props, /* DomNode */node){
      // summary: Instantiate some new item from a passed Class, with props with an optional srcNode (node)
      //  reference. Also tracks this widget as if it were a child to be destroyed when this parent widget
      //  is removed.
      //
      // cls: Function
      //      The class to instantiate. Cannot be a string. Use dojo.getObject to get a full class object if you
      //      must.
      //
      // props: Object?
      //      An optional object mixed into the constructor of said cls.
      //
      // node: DomNode?
      //      An optional srcNodeRef to use with dijit._Widget. This thinger will be instantiated using
      //      this passed node as the target if passed. Otherwise a new node is created and you must placeAt() your
      //      instance somewhere in the dom for it to be useful.
      //
      // example:
      //  |    this.adopt(my.ui.Button, { onClick: function(){} }).placeAt(this.domNode);
      //
      // example:
      //  |   var x = this.adopt(my.ui.Button).placeAt(this.domNode);
      //  |   x.connect(this.domNode, "onclick", "fooBar");
      //
      //  example:
      //  If you *must* new up a thinger and only want to adopt it once, use _addItem instead:
      //  |   var t;
      //  |   if(4 > 5){ t = new my.ui.Button(); }else{ t = new my.ui.OtherButton() }
      //  |   this._addItem(t);

      var x = new cls(props, node);
      this._addItem(x);
      return x; // my.Widget
  },

  _addItem: function(/* dijit._Widget... */){
      // summary: Add any number of programatically created children to this instance for later cleanup.
      // private, use `adopt` directly.
      this._addedItems = this._addedItems || [];
      this._addedItems.push.apply(this._addedItems, arguments);
  },

  orphan: function(/* dijit._Widget */widget, /* Boolean? */destroy){
      // summary: remove a single item from this instance when we destroy it. It is the parent widget's job
      // to properly destroy an orphaned child.
      //
      // widget:
      //      A widget reference to remove from this parent.
      //
      // destroy:
      //      An optional boolean used to force immediate destruction of the child. Pass any truthy value here
      //      and the child will be orphaned and killed.
      //
      // example:
      //  Clear out all the children in an array, but do not destroy them.
      //  |   dojo.forEach(this._thumbs, this.orphan, this);
      //
      // example:
      //  Create and destroy a button cleanly:
      //  |   var x = this.adopt(my.ui.Button, {});
      //  |   this.orphan(x, true);
      //
      this._addedItems = this._addedItems || [];
      var i = dojo.indexOf(this._addedItems, widget);

      if (i >= 0) {
        this._addedItems.splice(i, 1);
      }

      if (destroy) {
        this._kill(widget);
      }
  },

  _kill: function(w){
      // summary: Private helper function to properly destroy a widget instance.
      if (w && w.destroyRecursive) {
          w.destroyRecursive();
      } else if (w && w.destroy) {
          w.destroy();
      }
  },

  query : function(sel) {
    var nl, result;

    if (!sel) {
      return new dojo.NodeList(this.domNode);
    } else {
      result = this.domNode.querySelectorAll(sel);
      nl = new dojo.NodeList();

      dojo.forEach(result, function(n) {
        nl.push(n);
      });
    }

    return nl;
  },


  preventClickDelay : function(el, handler) {
    this.clickables = this.clickables || [];

    this.clickables.push(
      new toura.ui.Clickable(el, dojo.hitch(this, handler))
    );
  },

  destroy: function(){
    // override the default destroy function to account
    // for programatically added children.
    dojo.forEach(this._addedItems, this._kill);

    // destroy scrollers

    // this would no longer be needed
    dojo.forEach(this.scrollerHandles || [], function(handle) {
      handle.destroy();
    });

    // destroy clickables
    dojo.forEach(this.clickables || [], function(c) {
      c.destroy();
    });

    this.inherited(arguments);
  },

  addClass : function(className) {
    dojo.addClass(this.domNode, className);
  },

  removeClass : function(className) {
    dojo.removeClass(this.domNode, className);
  },

  /**
   * @public
   * Shows the view if it's hidden.   It removes the `hidden` class from the
   * `_View`'s root element. By default `hidden` has a style of `display:
   * none`. If you need some other style (opacity, transitions, transfors)
   * override `hidden` for your `_View`.
   *
   * If passed a dom element as an argument, it shows that element instead.
   *
   * @param {DomElement} [domNode] The domNode you want to show (optional)
   **/
  show : function(domNode) {
    if (domNode && domNode.nodeName) {
      dojo.removeClass(domNode, 'hidden');
      return;
    }

    this.removeClass('hidden');
    this.isHidden = false;
  },

  /**
   * @public
   * Hides the view if it's currrently visible. By default, it adds the
   * `hidden` class from the `_View`'s root element. For explanation of how to
   * customize this @see `toura._View#show`.
   *
   * If passed a dom element as an argument, it hides that element instead.
   *
   * @param {DomElement} [domNode] The domNode you want to hide (optional)
   **/
  hide : function(domNode) {
    if (domNode && domNode.nodeName) {
      dojo.addClass(domNode, 'hidden');
      return;
    }

    this.addClass('hidden');
    this.isHidden = true;
  },

  /**
   * @public
   * Toggles the hidden state of the `_View`.
   * TODO: should be rerenamed toggleVisibility, or something that indicates
   * *what* it's toggling.
   **/
  toggle : function(domNode) {
    if (domNode) {
      dojo.toggleClass(domNode, 'hidden');
      return;
    }

    if (this.isHidden) {
      this.show();
    } else {
      this.hide();
    }
  },

  enable : function() {
    this.removeClass('disabled');
    this.isDisabled = false;
  },

  disable : function() {
    this.addClass('disabled');
    this.isDisabled = true;
  }

});

}());
