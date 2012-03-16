describe('twitter', function() {
  var t;

  beforeEach(function() {
    dojo.require('toura.user.Twitter');
    mulberry.app.Config.set('app', {
      twitterCustomerKey : 'twitter customer key',
      twitterCustomerSecret : 'twitter customer secret'
    });

    mulberry.app.PhoneGap = {
      browser : {
        getBrowser : function() {
          return true;
        }
      }
    };

    t = new toura.user.Twitter();
  });

  it("should set the user info", function() {
    var result = t.setUserInfo({
      username : 'touradev',
      password : 'test'
    });

    expect(result).toBeTruthy();
  });

  it("should accept user info without a user/pass if it already has user info", function() {
    t.setUserInfo({
      username : 'touradev',
      password : 'test'
    });

    var result = t.setUserInfo({});

    expect(result).toBeTruthy();
  });
});
