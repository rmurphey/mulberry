//
//  TouraAppDelegate.m
//  Toura
//
//  Created by Gregory Jastrab on 1/5/11.
//  Copyright Toura, LLC. 2011. All rights reserved.
//

#import "TouraAppDelegate.h"
#ifdef PHONEGAP_FRAMEWORK
    #import <PhoneGap/PhoneGapViewController.h>
#else
    #import "PhoneGapViewController.h"
#endif
#import "PushNotification.h"

@interface TouraAppDelegate()

- (id)readPlist:(NSString *)fileName;

@end

@implementation TouraAppDelegate

@synthesize invokeString;
@synthesize launchNotification;

void uncaughtExceptionHandler(NSException *);

- (id) init
{
	/** If you need to do any extra app-specific initialization, you can do it here
	 *  -jm
	 **/
    return [super init];
}

/**
 * This is main kick off after the app inits, the views and Settings are setup here.
 */
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
	//NSSetUncaughtExceptionHandler(&uncaughtExceptionHandler);

    NSBundle* mainBundle = [NSBundle mainBundle];
    NSSetUncaughtExceptionHandler(&uncaughtExceptionHandler);

    // Flurry docs lie and say this defaults to false.
    // worse, it crashes the app in ios 5 sim when it tries to do this.
    // may want to re-enable when this issue is fixed.
    [ FlurryAnalytics setSessionReportsOnPauseEnabled:false ];

    NSString* flurryApiKey = [mainBundle objectForInfoDictionaryKey:@"FlurryApiKey"];
    [ FlurryAnalytics startSession:flurryApiKey ];

    // ******** NOTE: modified the following block from the default app delegate as it assumes
    // your app will never receive push notifications

    //	NSArray *keyArray = [launchOptions allKeys];
    //	if ([launchOptions objectForKey:[keyArray objectAtIndex:0]]!=nil)
    //	...
    NSURL *url = [launchOptions objectForKey:UIApplicationLaunchOptionsURLKey];
    self.invokeString = [url absoluteString];

    // cache notification, if any, until webview finished loading, then process it if needed
    // assume will not receive another message before webview loaded
    self.launchNotification = [launchOptions objectForKey:UIApplicationLaunchOptionsRemoteNotificationKey];
    application.applicationIconBadgeNumber = 0;

    return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

// this happens while we are running ( in the background, or from within our own app )
// only valid if Toura-Info.plist specifies a protocol to handle
- (BOOL)application:(UIApplication *)application handleOpenURL:(NSURL *)url
{
    // must call super so all plugins will get the notification, and their handlers will be called
	// super also calls into javascript global function 'handleOpenURL'
    return [super application:application handleOpenURL:url];
}

-(id) getCommandInstance:(NSString*)className
{
	/** You can catch your own commands here, if you wanted to extend the gap: protocol, or add your
	 *  own app specific protocol to it. -jm
	 **/
	return [super getCommandInstance:className];
}

/**
 Called when the webview finishes loading.  This stops the activity view and closes the imageview
 */
- (void)webViewDidFinishLoad:(UIWebView *)theWebView
{
	// Disable phone number detection
	[theWebView setDataDetectorTypes: UIDataDetectorTypeLink & UIDataDetectorTypeAddress];

	// only valid if Toura-Info.plist specifies a protocol to handle
	if (self.invokeString) {
		// this is passed before the deviceready event is fired, so you can access it in js when you receive deviceready
		NSString* jsString = [NSString stringWithFormat:@"var invokeString = \"%@\";", self.invokeString];
		[theWebView stringByEvaluatingJavaScriptFromString:jsString];
	}

    //Now that the web view has loaded, pass on the notfication
    if (launchNotification) {
        PushNotification *pushHandler = [self getCommandInstance:@"PushNotification"];

        //NOTE: this drops payloads outside of the "aps" key
        pushHandler.notificationMessage = [launchNotification objectForKey:@"aps"];

        //clear the launchNotification
        self.launchNotification = nil;
    }

	return [ super webViewDidFinishLoad:theWebView ];
}

- (void)webViewDidStartLoad:(UIWebView *)theWebView
{
	return [ super webViewDidStartLoad:theWebView ];
}

/**
 * Fail Loading With Error
 * Error - If the webpage failed to load display an error with the reason.
 */
- (void)webView:(UIWebView *)theWebView didFailLoadWithError:(NSError *)error
{
	return [ super webView:theWebView didFailLoadWithError:error ];
}

/**
 * Start Loading Request
 * This is where most of the magic happens... We take the request(s) and process the response.
 * From here we can re direct links and other protocalls to different internal methods.
 */
- (BOOL)webView:(UIWebView *)theWebView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType
{
	return [ super webView:theWebView shouldStartLoadWithRequest:request navigationType:navigationType ];
}

- (BOOL)execute:(InvokedUrlCommand*)command
{
	return [super execute:command];
}


- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
    PushNotification *pushHandler = [self getCommandInstance:@"PushNotification"];
    NSDictionary *touraProps = [self readPlist:@"UrbanAirship"];
    NSString *uaHost = [touraProps valueForKey:@"UrbanAirshipHost"];
    NSString *uaKey = [touraProps valueForKey:@"UrbanAirshipKey"];
    NSString *uaSecret = [touraProps valueForKey:@"UrbanAirshipSecret"];
    [pushHandler didRegisterForRemoteNotificationsWithDeviceToken:deviceToken host:uaHost appKey:uaKey appSecret:uaSecret];
}

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
    PushNotification *pushHandler = [self getCommandInstance:@"PushNotification"];
    [pushHandler didFailToRegisterForRemoteNotificationsWithError:error];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {
    NSLog(@"didReceiveNotification");

    // Get application state for iOS4.x+ devices, otherwise assume active
    UIApplicationState appState = UIApplicationStateActive;
    if ([application respondsToSelector:@selector(applicationState)]) {
        appState = application.applicationState;
    }

    // NOTE this is a 4.x only block -- TODO: add 3.x compatibility
    if (appState == UIApplicationStateActive) {
        PushNotification *pushHandler = [self getCommandInstance:@"PushNotification"];
        pushHandler.notificationMessage = [userInfo objectForKey:@"aps"];
        [pushHandler notificationReceived];
    } else {
        //save it for later
        self.launchNotification = userInfo;
    }
}

- (void)applicationDidBecomeActive:(UIApplication *)application {

    NSLog(@"active");

    //zero badge
    application.applicationIconBadgeNumber = 0;

    if (![self.webView isLoading] && self.launchNotification) {
        PushNotification *pushHandler = [self getCommandInstance:@"PushNotification"];
        pushHandler.notificationMessage = [self.launchNotification objectForKey:@"aps"];

        self.launchNotification = nil;

        [pushHandler performSelectorOnMainThread:@selector(notificationReceived) withObject:pushHandler waitUntilDone:NO];
    }

    [super applicationDidBecomeActive:application];
}

- (void)dealloc
{
    launchNotification = nil;
    [super dealloc];
}

- (id)readPlist:(NSString *)fileName {
	NSData *plistData;
	NSString *error;
	NSPropertyListFormat format;
	id plist;

	NSString *localizedPath = [[NSBundle mainBundle] pathForResource:fileName ofType:@"plist"];
	plistData = [NSData dataWithContentsOfFile:localizedPath];

	plist = [NSPropertyListSerialization propertyListFromData:plistData mutabilityOption:NSPropertyListImmutable format:&format errorDescription:&error];
	if (!plist) {
		NSLog(@"Error reading plist from file '%s', error = '%s'", [localizedPath UTF8String], [error UTF8String]);
		[error release];
	}

	return plist;
}

/**
 * Uncaught exception handler
 * Use Flurry to do some exception logging for us.
 */
void uncaughtExceptionHandler(NSException *exception) {
    [FlurryAnalytics logError:@"Uncaught" message:@"Crash!" exception:exception];
}

@end
