(function($){

$(function() {
  var $forms = $('form.signup-form').submit(function() {

    var n = $('#entry_0').val(),
        e = $('#entry_1').val(),
        $this = $(this),
        $signup = $this.closest('.signup'),
        valid = true;

    $('.error').empty().removeClass('error');

    var $inputs = $signup.find('input.ss-q-short');

    $inputs.each(function() {
      if (!$.trim(this.value)) {
        valid = false;
      }
    });

    if (valid) {
      $this.fadeTo(100, 0.5);

      $forms.replaceWith('<p class="thanks">Thanks for signing up -- we&rsquo;ll be in touch!</p>');
      $('.error-msg .inner, .extra-info').fadeOut();
      return true;
    }

    $signup.siblings('.error-msg').find('.inner')
      .text('Please fill out both fields')
      .fadeIn();

    return false;

  });

});

}(jQuery));

