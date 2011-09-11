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

});

}(jQuery));

