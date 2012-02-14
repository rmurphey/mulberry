dojo.provide('toura.base');

dojo.require('toura.xhr');
dojo.require('toura.UI');
dojo.require('toura.Analytics');
dojo.require('toura.Bootstrapper');
dojo.require('toura.Data');
dojo.require('toura.Manifest');
dojo.require('toura.Routes');
dojo.require('toura.Sharing');
dojo.require('toura.URL');
dojo.require('toura.capabilities._base');
dojo.require('toura.components._base');

toura.data = toura.data || {};

mulberry.registerComponentNamespace(toura.components);
mulberry.registerCapabilityNamespace(toura.capabilities);
mulberry.components.Debug.registerFeaturesObject(toura.features);
