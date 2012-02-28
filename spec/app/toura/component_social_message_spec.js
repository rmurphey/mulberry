describe("social message component", function() {
  var t, C, c,
      shortMessage = "short",
      longMessage = "This is a message that will be too long for us to handle.",
      almostTooLongMessage = "123456789012345",
      maxLength = 20;

  beforeEach(function() {
    dojo.require('toura.components.SocialMessage');
    t = dojo.byId('test');
    C = function(config) {
      if (c) { c.destroy(); }
      return new toura.components.SocialMessage(config || {}).placeAt(t);
    };
  });

  it("should create a social message component", function() {
    c = C();
    expect(t.querySelector(getRootSelector(c))).toBeTruthy();
    expect(c.message).toBeDefined();
    expect(c.submitBtn).toBeDefined();
    expect(c.cancelBtn).toBeDefined();
  });

  it("should display no message if one is not provided", function() {
    c = C();
    expect(c.message.value).toBe('');
  });

  it("should display a provided message", function() {
    c = C({ messageText : shortMessage });
    expect(c.message.value).toBe(shortMessage);
  });

  it("should provide an onSubmit method for connections", function() {
    var msgText = 'fake';

    c = C({ messageText : msgText });

    var h = getEventHandler(c, 'click', c.submitBtn);

    spyOn(c, 'onSubmit');
    spyOn(c, 'onCancel');
    h(fakeEventObj);

    expect(c.onSubmit).toHaveBeenCalledWith({ msg : msgText });
    expect(c.onCancel).not.toHaveBeenCalled();
  });

  it("should provide an onCancel method for connections", function() {
    c = C();

    var h = getEventHandler(c, 'click', c.cancelBtn);

    spyOn(c, 'onSubmit');
    spyOn(c, 'onCancel');
    h(fakeEventObj);

    expect(c.onCancel).toHaveBeenCalled();
    expect(c.onSubmit).not.toHaveBeenCalled();
  });

  /* TODO: This is removed pending better integration with Travis-CI */
  xit("should adjust the size of the text input as the user types", function() {
    c = C({ messageText : shortMessage });

    var handlers = getEventHandlers(c, 'keyup', c.message);
    dojo.forEach(handlers, function(f) { f(); });

    var oldHeight = c.message.style.height.replace('px', '');

    c.message.value = longMessage + longMessage + longMessage;
    dojo.forEach(handlers, function(f) { f(); });

    var newHeight = c.message.style.height.replace('px','');
    expect(newHeight > oldHeight).toBeTruthy();
  });

  describe("validation", function() {
    it("should require auth fields if auth is required", function() {
      c = C({
        requireAuth : true,
        messageText : longMessage
      });

      var spy = spyOn(c, '_handleErrors');

      var handler = getEventHandler(c, 'click', c.submitBtn);
      handler(fakeEventObj);

      var errors = spy.argsForCall[0][0];

      expect(errors.length).toBeTruthy();
      expect(errors).toContain(c.i18n_usernameRequired);
      expect(errors).toContain(c.i18n_passwordRequired);
    });

    it("should require a message", function() {
      c = C();

      var spy = spyOn(c, '_handleErrors');

      var handler = getEventHandler(c, 'click', c.submitBtn);
      handler(fakeEventObj);

      var errors = spy.argsForCall[0][0];
      expect(errors.length).toBeTruthy();
      expect(errors).toContain(c.i18n_messageRequired);
    });

    it("should require compliance with max message length if set", function() {
      c = C({
        maxLength : maxLength,
        messageText : longMessage
      });

      var spy = spyOn(c, '_handleErrors');

      var handler = getEventHandler(c, 'click', c.submitBtn);
      handler(fakeEventObj);

      var errors = spy.argsForCall[0][0];

      expect(errors.length).toBeTruthy();
      expect(errors).toContain(c.i18n_messageLength);
    });

    it("should not call onSubmit if there are validation errors", function() {
      c = C();

      spyOn(c, '_validate').andReturn([ 1 ]);
      spyOn(c, 'onSubmit');
      spyOn(c, '_handleErrors');

      var handler = getEventHandler(c, 'click', c.submitBtn);
      handler(fakeEventObj);

      expect(c.onSubmit).not.toHaveBeenCalled();
    });

    it("should display the errors", function() {
      var fakeErrors = [ 1 ];
      c = C();

      spyOn(c, '_validate').andReturn(fakeErrors);
      spyOn(c, '_handleErrors');

      var handler = getEventHandler(c, 'click', c.submitBtn);
      handler(fakeEventObj);
      expect(c._handleErrors).toHaveBeenCalledWith(fakeErrors);
    });

  });

  describe("auth", function() {
    it("should display the authorization fields if auth is required", function() {
      c = C({ requireAuth : true });

      expect(c.username).toBeDefined();
      expect(c.password).toBeDefined();
    });

    it("should not display the authorization fields by default", function() {
      c = C();

      expect(c.username).not.toBeDefined();
      expect(c.password).not.toBeDefined();
    });
  });

  describe("character counter", function() {
    it("should be displayed if there is a max message length", function() {
      c = C({ maxLength : maxLength });
      expect(c.count).toBeDefined();
    });

    it("should show the number of characters remaining", function() {
      c = C({ maxLength : maxLength });
      var handlers = getEventHandlers(c, 'keyup', c.message);

      expect(c.count.innerHTML).toBe(maxLength + '');

      c.message.value = longMessage;
      dojo.forEach(handlers, function(f) { f(); });
      expect(c.count.innerHTML).toBe((maxLength - longMessage.length) + '');

      c.message.value = almostTooLongMessage;
      dojo.forEach(handlers, function(f) { f(); });
      expect(c.count.innerHTML).toBe((maxLength - almostTooLongMessage.length) + '');
    });

    it("should indicate when the number of characters remaining is low", function() {
      c = C({ maxLength : maxLength });

      var handlers = getEventHandlers(c, 'keyup', c.message);

      c.message.value = almostTooLongMessage;
      dojo.forEach(handlers, function(f) { f(); });
      expect(dojo.hasClass(c.count, c.warningClass)).toBeTruthy();
      expect(dojo.hasClass(c.count, c.errorClass)).toBeFalsy();
    });

    it("should indicate when the number of characters remaining is less than 0", function() {
      c = C({ maxLength : maxLength });

      var handlers = getEventHandlers(c, 'keyup', c.message);

      c.message.value = longMessage;
      dojo.forEach(handlers, function(f) { f(); });
      expect(dojo.hasClass(c.count, c.warningClass)).toBeFalsy();
      expect(dojo.hasClass(c.count, c.errorClass)).toBeTruthy();
    });
  });
});
