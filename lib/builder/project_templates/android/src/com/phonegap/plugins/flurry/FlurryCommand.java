package com.phonegap.plugins.flurry;

import java.util.HashMap;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;

import com.flurry.android.FlurryAgent;
import com.phonegap.api.Plugin;
import com.phonegap.api.PluginResult;
import com.phonegap.api.PluginResult.Status;

public class FlurryCommand extends Plugin {

  @Override
  public PluginResult execute(String action, JSONArray data, String callbackId) {
    if (! action.equals("logEvent") ) {
      return new PluginResult(Status.INVALID_ACTION);
    }
    try {
      String eventId = data.getString(0);
      Map<String, String> params = new HashMap<String, String>();
      if (! data.isNull(1)) {
        JSONObject paramsJson = data.getJSONObject(1);
        JSONArray names = paramsJson.names();
        for (int i = 0; i < names.length(); i++) {
          String name = names.getString(i);
          params.put(name, paramsJson.getString(name));
        }
      }
      FlurryAgent.logEvent( eventId, params);
    } catch (Exception e) {
      return new PluginResult(Status.ERROR, e.getMessage());
    }
    return new PluginResult(Status.OK);
  }

}
