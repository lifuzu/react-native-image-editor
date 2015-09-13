#import "RNImageEditorManager.h"
#import "RCTConvert.h"
#import "RNImageEditor.h"


@implementation RNImageEditorManager

RCT_EXPORT_MODULE();

@synthesize bridge = _bridge;
@synthesize methodQueue = _methodQueue;

- (UIView *)view
{
  return [[RNImageEditor alloc] initWithBridge:_bridge];
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

RCT_EXPORT_VIEW_PROPERTY(isVisible, BOOL);
RCT_EXPORT_VIEW_PROPERTY(aboveStatusBar, BOOL);
RCT_EXPORT_VIEW_PROPERTY(drawingMode, BOOL);

RCT_EXPORT_METHOD(saveImage:(RCTResponseSenderBlock) callback) {
  BOOL granted = TRUE;
  RNImageEditor* imageEditor = [[RNImageEditor alloc] initWithBridge:_bridge];
  [imageEditor saveImageImpl: TRUE];
  callback(@[[NSNull null], @(granted)]);
}

@end
