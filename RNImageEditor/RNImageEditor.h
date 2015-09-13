//
//  RNImageEditor.h
//  RNImageEditor
//
//  Created by Richard Lee on 8/26/15.
//  Copyright (c) 2015 Carystal. All rights reserved.
//

#import "RCTView.h"

@class RCTBridge;

@interface RNImageEditor : RCTView <UIScrollViewDelegate>

- (id)initWithBridge:(RCTBridge *)bridge NS_DESIGNATED_INITIALIZER;
- (void)saveImageImpl:(BOOL)anything;

@end
