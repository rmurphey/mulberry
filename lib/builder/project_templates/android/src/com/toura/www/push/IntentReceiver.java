package com.toura.www.push;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import com.toura.www.TouraApplication;
import com.toura.www.TouraMainActivity;
import com.urbanairship.UAirship;
import com.urbanairship.push.PushManager;

public class IntentReceiver extends BroadcastReceiver {

  private static TouraMainActivity touraMainActivity;

  public static TouraMainActivity getTouraMainActivity() {
    return touraMainActivity;
  }


  public static void setTouraMainActivity(TouraMainActivity touraMainActivity) {
    IntentReceiver.touraMainActivity = touraMainActivity;
  }


  @Override
  public void onReceive(Context context, Intent intent) {
    Log.i(TouraApplication.LOG_TAG, "Received intent: " + intent.toString());
    String action = intent.getAction();

    if (action.equals(PushManager.ACTION_PUSH_RECEIVED)) {

      int id = intent.getIntExtra(PushManager.EXTRA_NOTIFICATION_ID, 0);

      String message = intent.getStringExtra(PushManager.EXTRA_ALERT);
      String payload = intent.getStringExtra(PushManager.EXTRA_STRING_EXTRA);
      Log.i(TouraApplication.LOG_TAG, "Received push notification. Alert: " + message + ". Payload: " +
                    payload + ". NotificationID="+id);
      if (touraMainActivity != null) {
        touraMainActivity.showAlert(message);
      }
    } else if (action.equals(PushManager.ACTION_NOTIFICATION_OPENED)) {

      String message = intent.getStringExtra(PushManager.EXTRA_ALERT);
      String payload = intent.getStringExtra(PushManager.EXTRA_STRING_EXTRA);
      Log.i(TouraApplication.LOG_TAG, "User clicked notification. Message: " + message
          + ". Payload: " + payload);

      if (touraMainActivity != null && touraMainActivity.isInForeground()) {
        touraMainActivity.showAlert(message);
      } else {
        Log.i("push", "Launching app with alert!");
        Intent launch = new Intent(Intent.ACTION_MAIN);
        launch.setClass(UAirship.shared().getApplicationContext(), TouraMainActivity.class);
        launch.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        launch.putExtra("alert", message);
        UAirship.shared().getApplicationContext().startActivity(launch);
      }

    } else if (action.equals(PushManager.ACTION_REGISTRATION_FINISHED)) {
      Log.i(TouraApplication.LOG_TAG, "Registration complete. APID:" + intent.getStringExtra(PushManager.EXTRA_APID)
              + ". Valid: " + intent.getBooleanExtra(PushManager.EXTRA_REGISTRATION_VALID, false));
    }

  }
}
