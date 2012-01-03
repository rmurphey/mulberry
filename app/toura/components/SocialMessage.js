dojo.provide('toura.components.SocialMessage');

dojo.require('toura._Component');

dojo.declare('toura.components.SocialMessage', toura._Component, {
  templateString : dojo.cache('toura.components', 'SocialMessage/SocialMessage.haml'),

  requireAuth : false,
  maxLength : false,

  errorClass : 'error',
  warningClass : 'warning',

  prepareData : function() {
    this.messageText = this.messageText || '';
    this.availLength = this.maxLength - this.messageText.length;
  },

  setupConnections : function() {
    this.connect(this.submitBtn, 'click', '_onSubmit');
    this.connect(this.cancelBtn, 'click', '_onCancel');

    dojo.forEach([this.message, this.username, this.password], dojo.hitch(this, function(node){
      this.connect(node, 'blur', '_onSocialBlur');
    }));

    dojo.forEach(['keyup', 'change'], dojo.hitch(this, function(e) {
      this.connect(this.message, e, '_resize');
    }));

    if (this.maxLength) {
      this.connect(this.message, 'keyup', '_updateCharCount');
    }
  },

  _updateCharCount : function(e) {
    var len = this.message.value.length,
        warn = this.maxLength - len < 11,
        error = this.maxLength - len <= 0;

    this.count.innerHTML = this.maxLength - len;

    dojo[error ? 'addClass' : 'removeClass'](this.count, this.errorClass);
    dojo[warn && !error ? 'addClass' : 'removeClass'](this.count, this.warningClass);
  },

  _onSubmit : function(e) {
    e.preventDefault();

    var params = {
          msg : this.message.value,
          username : this.username && this.username.value,
          password : this.password && this.password.value
        },
        errors;

    params.msg = dojo.trim(params.msg);

    errors = this._validate(params);

    if (!errors.length) {
      this.onSubmit(params);
      return;
    }

    this._handleErrors(errors);
  },

  _validate : function(params) {
    var errors = [];

    // TODO: i18n
    if (this.requireAuth) {
      if (!params.username) {
        errors.push(this.i18n_usernameRequired);
      }

      if (!params.password) {
        errors.push(this.i18n_passwordRequired);
      }

      if (errors.length) {
        errors.push(this.i18n_privacy);
      }
    }

    if (!params.msg) {
      errors.push(this.i18n_messageRequired);
    }

    if (this.maxLength && params.msg.length > this.maxLength) {
      errors.push(this.i18n_messageLength);
    }

    return errors;
  },

  _resize : function() {
    var msg = this.message;
    msg.style.height = 'auto';
    msg.style.height = msg.scrollHeight + 'px';
  },

  _handleErrors : function(errors) {
    toura.app.PhoneGap.notification.alert(errors.join('\n'));
  },

  onSubmit : function(params) {
    console.log(params);
  },

  _onCancel : function() {
    this.onCancel();
  },

  onCancel : function() {
    console.log('toura.components.SocialMessage::onCancel()');
  },

  _onSocialBlur : function() {
    window.scrollTo(0,0);
  },

  initializeStrings : function() {
    this.i18n_submitLabel = this.getString('SEND');
    this.i18n_cancelLabel = this.getString('CANCEL');

    this.i18n_usernameRequired = this.getString('SOCIAL_USERNAME_REQUIRED');
    this.i18n_passwordRequired = this.getString('SOCIAL_PASSWORD_REQUIRED');
    this.i18n_privacy = this.getString('SOCIAL_PRIVACY');
    this.i18n_messageRequired = this.getString('SOCIAL_MESSAGE_REQUIRED');
    this.i18n_messageLength = this.getString('SOCIAL_MESSAGE_LENGTH');
  }

});


