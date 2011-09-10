(function($){

$(function() {
  $('#signup-form').submit(function() {
    var n = $('#entry_0').val(),
        e = $('#entry_1').val(),
        $this = $(this);

    $('p.signup-error').remove();

    if ($.trim(n) && $.trim(e)) {
      $this.fadeTo(100, 0.5);

      setTimeout(function(){
        $this.slideUp(100, function() {
          $this.replaceWith('<p class="thanks">Thanks for signing up -- we&rsquo;ll be in touch!</p>');
        });
      }, 500);

      return true;
    }

    $this.before('<p class="signup-error">Please fill out both fields</p>');
    return false;
  });

  var scrolling = false,
      signup = $('#signup'),
      scrollingTimeout;

  var w = $(window).scroll(handleScroll);

  function handleScroll(e) {
    if (scrolling) {
      clearTimeout(scrollingTimeout);
      scrollingTimeout = setTimeout(positionSignup, 100);
      return;
    }

    scrolling = true;
  }

  function positionSignup() {
    var winScrollTop = w.scrollTop();

    if (w.width() > 600) {
      if (winScrollTop > 140) {
        signup.animate({ top : winScrollTop + 20 }, 500, 'easeInCubic');
      } else {
        signup.animate({ top : 140 }, 500, 'easeInCubic');
      }
    }

    scrolling = false;
  }

  setTimeout(positionSignup, 500);
});

}(jQuery));

