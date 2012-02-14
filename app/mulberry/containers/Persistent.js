dojo.provide('mulberry.containers.Persistent');

dojo.require('mulberry._View');

dojo.declare('mulberry.containers.Persistent', mulberry._View, {
  templateString : dojo.cache('mulberry.containers', 'Persistent/Persistent.haml')
});
