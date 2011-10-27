//
//  FlurryCommand.h
//  Toura-iPad
//
//  Created by Matt Rogish on 1/27/11.
//  Copyright 2011 Toura. All rights reserved.
//

#import <Foundation/Foundation.h>
    #ifdef PHONEGAP_FRAMEWORK 
#import <PhoneGap/PGPlugin.h> 
#else 
    #import "PGPlugin.h" 
#endif

@interface FlurryCommand : PGPlugin {
}

-(void) logEvent:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;

@end
