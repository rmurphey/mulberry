(function($){

$(function() {
  $('#signup-form').submit(function() {
    var n = $('#entry_0').val(),
        e = $('#entry_1').val(),
        $this = $(this);

    $('p.signup-error').remove();

    if ($.trim(n) && $.trim(e)) {
      $this.fadeTo(100, 0.5);

      $this.replaceWith('<p class="thanks">Thanks for signing up -- we&rsquo;ll be in touch!</p>');

      return true;
      return false;
    }

    $('#signup .extra-info').text('Please fill out both fields');
    return false;
  });

});

}(jQuery));

