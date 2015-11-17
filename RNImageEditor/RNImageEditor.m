//
//  RNImageEditor.m
//  RNImageEditor
//
//  Created by Richard Lee on 8/26/15.
//  Copyright (c) 2015 Carystal. All rights reserved.
//

#import "RNImageEditor.h"
#import "RCTUIManager.h"
#import "RCTView.h"
#import "RCTTouchHandler.h"
#import "UIView+React.h"
#import "RNThroughWindow.h"
#import "RCTImageLoader.h"
#import <AssetsLibrary/ALAssetsLibrary.h>
#import "RCTUtils.h"

@import ImageIO;

@implementation RNImageEditor {
  RNThroughWindow *_imageEditorWindow;
  UIViewController *_imageEditorViewController;
  UIScrollView *_imageEditorBaseScrollView;
  UIImageView *_imageEditorImageView;
  UIImageView *_imageEditorDrawingView;
  UIView *_imageEditorContainerView;
  RCTTouchHandler *_touchHandler;
  BOOL _aboveStatusBar;
  BOOL _drawingMode;
  NSString *_imageSourceUri;
  CGPoint _prevDrawingPosition;
  RCTBridge *_bridge;
}

UIImage *_imageEditorOriginalImage;
UIImage *_imageEditorDrawingImage;

// Taken from react-native/React/Modules/RCTUIManager.m
// Since our view is not registered as a root view we have to manually
// iterate through the overlay's subviews and forward the `reactBridgeDidFinishTransaction` message
// If the function below would be a utility function we could just import, it would make
// things less dirty - maybe ask the react-native guys nicely?
typedef void (^react_view_node_block_t)(id<RCTComponent>);

static void RCTTraverseViewNodes(id<RCTComponent> view, react_view_node_block_t block)
{
  if (view.reactTag) block(view);
  for (id<RCTComponent> subview in view.reactSubviews) {
    RCTTraverseViewNodes(subview, block);
  }
}

- (id)initWithBridge:(RCTBridge *)bridge
{
  if ((self = [super init])) {
    _imageEditorViewController = [[UIViewController alloc] init];

    _imageEditorBaseScrollView = [[UIScrollView alloc] initWithFrame:[UIScreen mainScreen].bounds];
    _imageEditorBaseScrollView.backgroundColor = [UIColor clearColor];
    _imageEditorBaseScrollView.delegate = self;
    _imageEditorBaseScrollView.bounces = NO;

  }
  _bridge = bridge;

  return self;
}

- (void)dealloc
{
    _imageEditorViewController = nil;
    [_imageEditorViewController removeFromParentViewController];
}

- (void)setDrawingMode:(BOOL)drawingMode {
  _drawingMode = drawingMode;
  _imageEditorDrawingView.userInteractionEnabled = _drawingMode;

  // In drawing mode, disable scrolling with single touch
  _imageEditorBaseScrollView.panGestureRecognizer.minimumNumberOfTouches = 1 + _drawingMode;
  // [self applyWindowLevel];
}

- (void)drawingOnTouch:(UIPanGestureRecognizer *)sender {
  if (sender.numberOfTouches == 1) {
    CGPoint currentPosition = [sender locationInView:_imageEditorDrawingView];

    if (sender.state == UIGestureRecognizerStateBegan) {
      _prevDrawingPosition = currentPosition;
    }

    if (sender.state == UIGestureRecognizerStateEnded) {
    //   [self setDrawingMode:false];  // disable drawing
    } else {
      [self drawLine:_prevDrawingPosition to:currentPosition];
    }

    _prevDrawingPosition = currentPosition;
  }
}

- (void)drawLine:(CGPoint)from to:(CGPoint)to {
  CGSize size = _imageEditorDrawingView.frame.size;

  UIGraphicsBeginImageContextWithOptions(size, NO, 0.0);

  CGContextRef context = UIGraphicsGetCurrentContext();

  [_imageEditorDrawingView.image drawAtPoint:CGPointZero];

  UIColor *strokeColor = [UIColor blackColor];

  CGContextSetLineWidth(context, 60);
  CGContextSetStrokeColorWithColor(context, strokeColor.CGColor);
  CGContextSetLineCap(context, kCGLineCapRound);

  CGContextMoveToPoint(context, from.x, from.y);
  CGContextAddLineToPoint(context, to.x, to.y);
  CGContextStrokePath(context);
  CGContextFlush(context);

  _imageEditorDrawingView.image = UIGraphicsGetImageFromCurrentImageContext();
  _imageEditorDrawingImage = UIGraphicsGetImageFromCurrentImageContext();

  UIGraphicsEndImageContext();
}

- (void)saveImageImpl:(BOOL)anything callback:(RCTResponseSenderBlock)callback {
  CGSize _originalImageSize = _imageEditorOriginalImage.size;
  UIGraphicsBeginImageContextWithOptions(_originalImageSize, NO,
                                         _imageEditorOriginalImage.scale);

  [_imageEditorOriginalImage drawAtPoint:CGPointZero];
  [_imageEditorDrawingImage drawInRect:CGRectMake(0, 0, _originalImageSize.width, _originalImageSize.height) blendMode:kCGBlendModeNormal alpha:1.0];

  UIImage *newImage = UIGraphicsGetImageFromCurrentImageContext();

  UIGraphicsEndImageContext();

  NSData *imageData = UIImageJPEGRepresentation(newImage, 0.6);

  NSURL *tmpDirURL = [NSURL fileURLWithPath:NSTemporaryDirectory() isDirectory:YES];
  NSURL *fileURL = [[tmpDirURL URLByAppendingPathComponent:@"car"] URLByAppendingPathExtension:@"jpg"];
  NSLog(@"fileURL: %@", [fileURL path]);
  [imageData writeToFile:[fileURL path] atomically:YES];
  self.removeReactSubview;
  callback(@[[NSNull null], [fileURL path]]);
}

- (void)setImageSourceUri: (NSString*)imageSourceUri {
  _imageSourceUri = imageSourceUri;
  //NSLog(@"%@",_imageSourceUri);
  [_bridge.imageLoader loadImageWithTag:_imageSourceUri callback:^(NSError *error, UIImage *image) {
    if (error) {
      NSLog(@"%@",error);
      return;
    }

    // Set image
    // [_imageEditorImageView setImage:image];
    _imageEditorOriginalImage = image;
    // UIImage *image = [UIImage imageNamed:@"cat.jpg"];
    _imageEditorImageView = [[UIImageView alloc] initWithImage:image];
    _imageEditorImageView.frame = (CGRect){.origin=CGPointMake(0.0f, 0.0f), .size=image.size};

    _imageEditorDrawingView = [[UIImageView alloc] initWithFrame:_imageEditorImageView.bounds];
    _imageEditorDrawingView.userInteractionEnabled = YES;

    _imageEditorContainerView = [[UIView alloc] initWithFrame:_imageEditorImageView.bounds];
    [_imageEditorContainerView addSubview:_imageEditorImageView];
    [_imageEditorContainerView addSubview:_imageEditorDrawingView];

    _imageEditorBaseScrollView.contentSize = _imageEditorContainerView.frame.size;
    [_imageEditorBaseScrollView addSubview:_imageEditorContainerView];

    CGRect scrollViewFrame = _imageEditorBaseScrollView.frame;
    CGFloat scaleWidth = scrollViewFrame.size.width / _imageEditorBaseScrollView.contentSize.width;
    CGFloat scaleHeight = scrollViewFrame.size.height / _imageEditorBaseScrollView.contentSize.height;
    CGFloat minScale = MIN(scaleWidth, scaleHeight);
    _imageEditorBaseScrollView.minimumZoomScale = minScale;
    _imageEditorBaseScrollView.maximumZoomScale = 8.0;
    [_imageEditorBaseScrollView setZoomScale:_imageEditorBaseScrollView.minimumZoomScale];

    /* Must register handler because we are in a new UIWindow and our
     * imageEditorBaseView does not have a RCTRootView parent */
    _touchHandler = [[RCTTouchHandler alloc] initWithBridge:_bridge];
    [_touchHandler addTarget:self action:@selector(drawingOnTouch:)];
    [_imageEditorDrawingView addGestureRecognizer:_touchHandler];

    _imageEditorViewController.view = _imageEditorBaseScrollView;

    _drawingMode = YES;
  }];
}


- (void)setAboveStatusBar:(BOOL)aboveStatusBar {
  _aboveStatusBar = aboveStatusBar;
  [self applyWindowLevel];
}

- (void)applyWindowLevel {
  if (_imageEditorWindow == nil) {
    return;
  }

  if (_aboveStatusBar) {
    _imageEditorWindow.windowLevel = UIWindowLevelStatusBar;
  } else {
    _imageEditorWindow.windowLevel = UIWindowLevelStatusBar - 1;
  }
}

- (void)setWindowLevel {
  if (_imageEditorWindow == nil) {
    return;
  } else {
    _imageEditorWindow.windowLevel = UIWindowLevelNormal - 10;
  }
}

/* Every component has it is initializer called twice, once to create a base view
 * with default props and another to actually create it and apply the props. We make
 * this prop that is always true in order to not create UIWindow for the default props
 * instance */
- (void)setIsVisible:(BOOL)isVisible {
  _imageEditorWindow = [[RNThroughWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
//  [self setWindowLevel];
  _imageEditorWindow.backgroundColor = [UIColor clearColor];
  _imageEditorWindow.rootViewController = _imageEditorViewController;
  _imageEditorWindow.userInteractionEnabled = YES;
  _imageEditorWindow.hidden = NO;

  /* We need to watch for app reload notifications to properly remove the image editor,
   * removeFromSuperview does not properly propagate down without this */
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(removeFromSuperview)
                                               name:@"RCTReloadNotification"
                                             object:nil];
}

- (void)reactBridgeDidFinishTransaction {
  // forward the `reactBridgeDidFinishTransaction` message to all our subviews
  // in case their native representations do some logic in their handler
  RCTTraverseViewNodes(_imageEditorBaseScrollView, ^(id<RCTComponent> view) {
    if ([view respondsToSelector:@selector(reactBridgeDidFinishTransaction)]) {
      [view reactBridgeDidFinishTransaction];
    }
  });
}

- (void)insertReactSubview:(UIView *)view atIndex:(NSInteger)atIndex
{
  /* Add subviews to the overlay base view rather than self */
  [_imageEditorBaseScrollView insertReactSubview:view atIndex:atIndex];
}

- (void)removeReactSubview:(UIView *)subview
{
    [subview removeFromSuperview];
    return;
}

- (void)removeReactSubview
{
    [_imageEditorBaseScrollView.subviews makeObjectsPerformSelector:@selector(removeFromSuperview)];
    [super removeFromSuperview];
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

/* We do not need to support unmounting, so I -think- that this cleanup code
 * is safe to put here. */
- (void)removeFromSuperview
{
  [_imageEditorBaseScrollView.subviews makeObjectsPerformSelector:@selector(removeFromSuperview)];
  _touchHandler = nil;
  _imageEditorViewController = nil;
  _imageEditorBaseScrollView = nil;
  _imageEditorWindow = nil;
  _imageEditorDrawingView = nil;
  _imageEditorImageView = nil;
  _imageEditorContainerView = nil;
  _imageEditorOriginalImage = nil;
  _imageEditorDrawingImage = nil;
  [super removeFromSuperview];
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

#pragma Zooming

- (UIView *)viewForZoomingInScrollView:(UIScrollView *)scrollView {
  return _imageEditorContainerView;
}

- (void)scrollViewDidZoom:(UIScrollView *)scrollView {
  [self updateImageViewFrame];
}

- (void)updateImageViewFrame {
  CGRect rect = _imageEditorContainerView.frame;
  rect.origin.x =
    MAX((_imageEditorBaseScrollView.frame.size.width - _imageEditorContainerView.frame.size.width) / 2, 0);
  rect.origin.y =
    MAX((_imageEditorBaseScrollView.frame.size.height - _imageEditorContainerView.frame.size.height) / 2, 0);

  _imageEditorContainerView.frame = rect;
}

- (void)updateScrollViewFrame {
  CGRect rect = [UIScreen mainScreen].bounds;
  rect.origin.y = 0;
  rect.size.height -= 0 * 2;
  [_imageEditorBaseScrollView setFrame:rect];
}


@end
