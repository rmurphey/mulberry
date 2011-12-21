//
//  FlurryCommand.m
//  Toura-iPad
//
//  Created by Matt Rogish on 1/27/11.
//  Copyright 2011 Toura. All rights reserved.
//

#import "FlurryCommand.h"
#import "FlurryAnalytics.h"

@implementation FlurryCommand

-(void) logEvent:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options {
    NSString* eventName = [arguments objectAtIndex:0];
    
    [FlurryAnalytics logEvent:eventName withParameters:options];
}

@end

