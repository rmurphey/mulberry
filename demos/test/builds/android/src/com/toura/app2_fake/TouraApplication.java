package com.toura.app2_fake;

import android.app.Application;
import android.util.Log;

import com.toura.app2_fake.push.IntentReceiver;
import com.urbanairship.AirshipConfigOptions;
import com.urbanairship.UAirship;
import com.urbanairship.push.PushManager;
import com.urbanairship.push.PushPreferences;

public class TouraApplication extends Application {

  public static final String LOG_TAG = "com.toura.app2_fake";

  public void onCreate(){
    AirshipConfigOptions options = AirshipConfigOptions.loadDefaultOptions(this);
    UAirship.takeOff(this, options);

    PushManager.enablePush();
    PushManager.shared().setIntentReceiver(IntentReceiver.class);

    PushPreferences prefs = PushManager.shared().getPreferences();
    Log.i(LOG_TAG, "My Application onCreate - App APID: " + prefs.getPushId());
  }

}
