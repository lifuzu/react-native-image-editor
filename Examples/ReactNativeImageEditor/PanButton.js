'use strict';

var React = require('react-native');
var {
  StyleSheet,
  PanResponder,
  View,
} = React;

var CIRCLE_SIZE = 60;
var CIRCLE_COLOR = 'blue';
var CIRCLE_HIGHLIGHT_COLOR = 'green';

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');

var PanButton = React.createClass({

  statics: {
    key: 'PanButton',
    title: 'Pan button component',
    description: 'Pan button gesture handling',
  },

  _panResponder: {},
  _previousLeft: 0,
  _previousTop: 0,
  _circleStyles: {},
  circle: (null : ?{ setNativeProps(props: Object): void }),

  componentWillMount: function() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onMoveShouldSetResponderCapture: this._handleMoveShouldSetResponderCapture,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    });
    this._previousLeft = width - 84;
    this._previousTop = height - 84;
    this._circleStyles = {
      left: this._previousLeft,
      top: this._previousTop,
    };
  },

  componentDidMount: function() {
    this._updatePosition();
  },

  render: function() {
    return (
      <View
        ref={(circle) => {
          this.circle = circle;
        }}
        style={styles.circle}
        {...this._panResponder.panHandlers}
      />
    );
  },

      // <View
      //   style={styles.container}>
      //   <View
      //     ref={(circle) => {
      //       this.circle = circle;
      //     }}
      //     style={styles.circle}
      //     {...this._panResponder.panHandlers}
      //   />
      // </View>

  _highlight: function() {
    this.circle && this.circle.setNativeProps({
      backgroundColor: CIRCLE_HIGHLIGHT_COLOR
    });
  },

  _unHighlight: function() {
    this.circle && this.circle.setNativeProps({
      backgroundColor: CIRCLE_COLOR
    });
  },

  _updatePosition: function() {
    this.circle && this.circle.setNativeProps(this._circleStyles);
  },

  _handleStartShouldSetPanResponder: function(e: Object, gestureState: Object): boolean {
    // Should we become active when the user presses down on the circle?
    return true;
  },

  _handleMoveShouldSetPanResponder: function(e: Object, gestureState: Object): boolean {
    // Should we become active when the user moves a touch over the circle?
    return true;
  },

  _handleMoveShouldSetResponderCapture: function(e: Object, gestureState: Object): boolean {
    return false;
  },

  _handlePanResponderGrant: function(e: Object, gestureState: Object) {
    this._highlight();
  },
  _handlePanResponderMove: function(e: Object, gestureState: Object) {
    this._circleStyles.left = this._previousLeft + gestureState.dx;
    this._circleStyles.top = this._previousTop + gestureState.dy;
    this._updatePosition();
  },
  _handlePanResponderEnd: function(e: Object, gestureState: Object) {
    this._unHighlight();
    this._previousLeft += gestureState.dx;
    this._previousTop += gestureState.dy;

    if (this.props.onPress) {
      this.props.onPress(e, gestureState);
    }
  },
});

var styles = StyleSheet.create({
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: CIRCLE_COLOR,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  container: {
    flex: 1,
    paddingTop: 64,
  },
});

module.exports = PanButton;