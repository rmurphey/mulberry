dojo.provide('toura.components.PinInfo');

dojo.require('toura._Component');
dojo.require('toura.components.PinCaption');
dojo.require('toura.ui.Scrollable');
dojo.require('toura.app.URL');

dojo.declare('toura.components.PinInfo', toura._Component, {
  templateString : dojo.cache('toura.components', 'PinInfo/PinInfo.haml'),
  widgetsInTemplate : true,

  setupChildComponents : function() {
    if (this.scroller) {
      this.scroller.makeScroller();
    }

    this.captionNode = this.adopt(toura.components.PinCaption).placeAt(this.captionNode, 'replace');
  },

  setupConnections : function() {
    this.connect(this.websiteContainerNode, 'click', function(e) {
      e.preventDefault();
      toura.app.PhoneGap.browser.url(dojo.attr(this.websiteContainerNode, 'data-url'));
    });
  },

  _onClose : function() {
    this.onClose();
  },

  onClose : function() {
    // stub
  },

  _setPinAttr : function(pin) {
    // setting these props triggers the attribute mapping
    if (!pin) { return; }

    this.set('pinName', pin.name);
    this.set('address', pin.address);
    this.set('directionsUrl', toura.app.URL.googleMapAddress(pin.address));
    this.set('phoneNumber', pin.phoneNumber);
    this.set('website', pin.website);

    this.captionNode.set('content', pin.caption || '');
  },

  _setPhoneNumberAttr : function(phone) {
    if (!phone) {
      this.hide(this.phoneNumberContainerNode);
      return;
    }

    this.show(this.phoneNumberContainerNode);
    this.phoneNumberNode.innerHTML = phone;
    dojo.attr(this.phoneNumberContainerNode, 'href', toura.app.URL.tel(phone));
  },

  _setWebsiteAttr : function(website) {
    if (!website) {
      this.hide(this.websiteContainerNode);
      return;
    }

    this.show(this.websiteContainerNode);
    dojo.attr(this.websiteContainerNode, 'data-url', website);
  },

  // wires up attachPoints for attribute binding
  attributeMap : {
    pinName : {
      node : 'nameNode',
      type : 'innerHTML'
    },

    address : {
      node : 'addressNode',
      type : 'innerHTML'
    },

    directionsUrl : {
      node : 'directionsNode',
      type : 'attribute',
      attribute : 'href'
    }
  },

  initializeStrings : function() {
    this.i18n_directions = this.getString('DIRECTIONS');
    this.i18n_phone = this.getString('PHONE');
    this.i18n_website = this.getString('WEBSITE');
  }
});
