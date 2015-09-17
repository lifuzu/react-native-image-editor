/**
 * @providesModule ImageEditor
 * @flow-weak
 */

'use strict';

var React = require('react-native');
var {
  NativeModules,
  View,
  PropTypes,
  StyleSheet,
  requireNativeComponent,
} = React;

type Props = {
  isVisible: boolean;
  drawingMode: boolean;
}

var ImageEditor = React.createClass({
  propTypes: {
    /**
     * When this property is set to `true`, the ImageEditor will appear on
     * `UIWindowLevelStatusBar`, otherwise it will appear below that.
     */
    aboveStatusBar: React.PropTypes.bool,

    /**
     * Determines the visibility of the ImageEditor. When it is not visible,
     * an empty View is rendered.
     */
    isVisible: React.PropTypes.bool,

    drawingMode: React.PropTypes.bool,

    imageSourceUri: React.PropTypes.string,
  },

  getDefaultProps(): Props {
    return {
      aboveStatusBar: false,
      isVisible: true,
      drawingMode: false,
      imageSourceUri: null,
    }
  },

  render() {
    var {
      isVisible,
    } = this.props;

    if (this.props.isVisible) {
      return (
        <RNImageEditor isVisible={true} drawingMode={this.props.drawingMode} imageSourceUri={this.props.imageSourceUri} style={styles.container} pointerEvents="none" aboveStatusBar={this.props.aboveStatusBar}>
          {React.Children.map(this.props.children, React.addons.cloneWithProps)}
        </RNImageEditor>
      );
    } else {
      return <View />;
    }
  },

  save: function(cb) {
    NativeModules.RNImageEditorManager.saveImage(cb);
  },
});

var RNImageEditor = requireNativeComponent('RNImageEditor', ImageEditor);

var styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 20,
    left: 0,
    right: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
})

module.exports = ImageEditor;
