/*
 * Copyright (c) 2010, HipSnip Ltd
 * https://github.com/jos3000/phonegap-plugins/tree/master/Android/Facebook
 */
package com.phonegap.plugins.facebook;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Intent;
import android.content.Context;
import android.app.Activity;

import android.net.Uri;
import android.os.Bundle;
import android.util.Log;

import com.phonegap.api.Plugin;
import com.phonegap.api.PluginResult;

import com.facebook.android.Facebook;
import com.facebook.android.AsyncFacebookRunner;
import com.facebook.android.Facebook.DialogListener;
import com.facebook.android.DialogError;
import com.facebook.android.FacebookError;
import com.facebook.android.Util;

public class FacebookAuth extends Plugin {

	private Facebook mFb;
    public String callback;
	/**
	 * Executes the request and returns PluginResult.
	 *
	 * @param action 		The action to execute.
	 * @param args 			JSONArry of arguments for the plugin.
	 * @param callbackId	The callback id used when calling back into JavaScript.
	 * @return 				A PluginResult object with a status and message.
	 */
	public PluginResult execute(String action, JSONArray args, String callbackId) {
		callback = callbackId;
		System.out.println("execute: "+ action);

		String first;

		try {
			first = args.getString(0);
        } catch (JSONException e) {
			first = "";
		    Log.w("Facebook-Plugin", "No arguments in execute");
		}

		if (action.equals("authorize")) {
			this.authorize(first); // first arg is APP_ID
		} else if (action.equals("request")){
			this.getResponse(first); // first arg is path
		} else if (action.equals("getAccess")){
			this.getAccess();
		}

		PluginResult r = new PluginResult(PluginResult.Status.NO_RESULT);
		r.setKeepCallback(true);
		return r;
	}

	public void getAccess(){
		JSONObject json = new JSONObject();
		try {
			json.put("token", this.mFb.getAccessToken());
			json.put("expires", this.mFb.getAccessExpires());
		} catch (JSONException e) {
		}

		this.success(new PluginResult(PluginResult.Status.OK, json), this.callback);
	}

	public void onActivityResult(int requestCode, int resultCode, Intent intent) {
		this.mFb.authorizeCallback(requestCode, resultCode, intent);
        this.getResponse("me");
	}

	public void getResponse(final String path){
		Log.d("DroidGap", "onActivityResult FacebookAuth");
		try {
			String response = this.mFb.request(path);
			JSONObject json = Util.parseJson(response);

			this.success(new PluginResult(PluginResult.Status.OK, json), this.callback);

		} catch (java.net.MalformedURLException e) {
			this.error(new PluginResult(PluginResult.Status.ERROR), this.callback);
		} catch (java.io.IOException e) {
			this.error(new PluginResult(PluginResult.Status.ERROR), this.callback);
        } catch (JSONException e) {
            Log.w("Facebook-Example", "JSON Error in response");
        } catch (FacebookError e) {
            Log.w("Facebook-Example", "Facebook Error: " + e.getMessage());
        }
	}
	/**
	 * Identifies if action to be executed returns a value and should be run synchronously.
	 *
	 * @param action	The action to execute
	 * @return			T=returns value
	 */
	public boolean isSynch(String action) {
		return false;
	}

    /**
     * Called by AccelBroker when listener is to be shut down.
     * Stop listener.
     */
    public void onDestroy() {
    }

    //--------------------------------------------------------------------------
    // LOCAL METHODS
    //--------------------------------------------------------------------------

    /**
     * Display a new browser with the specified URL.
     *
     * @return				"" if ok, or error message.
     */
    public void authorize(final String appid) {
    	Log.d("PhoneGapLog", "authorize");
		final FacebookAuth fba = this;
		Runnable runnable = new Runnable() {
			public void run() {
				fba.mFb = new Facebook(appid);
				fba.mFb.setPlugin(fba);
		        fba.mFb.authorize((Activity) fba.ctx, new String[] { "publish_stream", "offline_access" }, new AuthorizeListener(fba));

			};
		};
		this.ctx.runOnUiThread(runnable);

    }

	class AuthorizeListener implements DialogListener {
		final FacebookAuth fba;

		public AuthorizeListener(FacebookAuth fba){
			super();
			this.fba = fba;
		}

		public void onComplete(Bundle values) {
			//  Handle a successful login

			Log.d("PhoneGapLog",values.toString());
			this.fba.getResponse("me");
		}

		public void onFacebookError(FacebookError e) {
			e.printStackTrace();
		}

		public void onError(DialogError e) {
			e.printStackTrace();
		}

		public void onCancel() {
		}
	}


}
