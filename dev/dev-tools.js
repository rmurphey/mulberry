$(function() {
  var $iframe = $("<iframe frameBorder='no'></iframe>"),

      deviceDimensions = {
        phone : {
          width : 320,
          height : 480
        },

        tablet : {
          width : 768,
          height : 1024
        }
      };

  function url(type) {
    return '/?device_type=' + type;
  }

  function device(type) {
    $('iframe').remove();

    var $i = $iframe.clone().attr({
      width : deviceDimensions[type].width,
      height : deviceDimensions[type].height,
      src : url(type)
    }).prependTo('body');
  }

  $('#controls .tablet').click(function() { device('tablet'); });
  $('#controls .phone').click(function() { device('phone'); });

  $('#controls .rotate').click(function() {
    var oldIFrame = $('iframe'),
        newHeight = oldIFrame.attr('width'),
        newWidth = oldIFrame.attr('height'),
        newURL = oldIFrame.attr('src');

    oldIFrame.remove();

    $iframe.clone().attr({
      width : newWidth,
      height : newHeight,
      src : newURL
    }).prependTo('body')
  });

  device('phone');
});
