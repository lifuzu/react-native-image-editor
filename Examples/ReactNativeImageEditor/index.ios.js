/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  ListView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;

var ImageEditor = require('react-native-image-editor');
var PanButton = require('./PanButton');

var ReactNativeImageEditor = React.createClass({
  getInitialState: function() {
    return {
      originalImage: null,
      editorSize: null,
      drawingMode: true
    };
  },

  _draw: function() {
    console.log("Click draw button.");
    this.setState({ drawingMode: !this.state.drawingMode });
  },
  _save: function() {
    console.log("Click the save button.");
    // this.refs.imageEditor.save();
  },
  _saved: function(filename) {
    console.log("Save the modified image: " + filename);
  },

  render: function() {
    return (
      <View style={styles.container}>
        <Text>Hello there</Text>
        <PanButton style={{flex: 3}} onPress={this._draw} />
        <ImageEditor drawingMode={this.state.drawingMode}
          ref="imageEditor"
          image={this.state.originalImage}
          size={this.state.editorSize}
          style={[styles.imageEditor, this.state.editorSize]}>
        </ImageEditor>
      </View>
    );
  }
});

// <PanButton style={{flex: 3}} onPress={this._save} />
          // <View style={styles.wrapper}>
          //   <ListView
          //     style={styles.listView}
          //     dataSource={this.state.dataSource}
          //     renderRow={this.renderRow} />
          // </View>
          // <ImageEditor isVisible={true} drawingMode={this.state.drawingMode}>
          // </ImageEditor>

//         <Text style={styles.welcome}>
//           Welcome to React Native!
//         </Text>
//         <Text style={styles.instructions}>
//           To get started, edit index.ios.js
//         </Text>
//         <Text style={styles.instructions}>
//           Press Cmd+R to reload,{'\n'}
//           Cmd+D or shake for dev menu
//         </Text>

var styles = StyleSheet.create({
  listView: {
    flex: 1,
    margin: 20,
    backgroundColor: '#ffffff',
  },

  wrapper: {
    flex: 1,
    backgroundColor: 'rgba(0,0,255,0.4)',
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('ReactNativeImageEditor', () => ReactNativeImageEditor);
