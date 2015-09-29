/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  CameraRoll,
  Image,
  ListView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;

var ImageEditor = require('react-native-image-editor');
var PanButton = require('./PanButton');
var Routes = require('./Routes');

var PAGE_SIZE = 5;

var ReactNativeImageEditor = React.createClass({
  statics: {
    title: 'Image Editor',
    description: 'Start to edit image'
  },

  getInitialState: function() {
    this._isMounted = true;
    this._fetchRandomPhoto();
    return {
      receiptSource: {uri: 'https://my73challenger.files.wordpress.com/2010/11/bs-car-receipt.jpg'},
      originalImageSourceUri: 'logo.jpg',
      editorSize: null,
      drawingMode: true
    };
  },

  _fetchRandomPhoto: function() {
    CameraRoll.getPhotos(
      {first: PAGE_SIZE},
      (data) => {
        if (!this._isMounted) {
          return;
        }
        var edges = data.edges;
        var edge = edges[Math.floor(Math.random() * edges.length)];
        var randomPhoto = edge && edge.node && edge.node.image;
        if (randomPhoto) {
          console.log(randomPhoto);
          this.setState({receiptSource: randomPhoto});
        }
      },
      (error) => undefined
    );
  },

  componentWillUnmount: function() {
    this._isMounted = false;
  },

  _draw: function() {
    console.log("Click draw button.");
    this.setState({ drawingMode: !this.state.drawingMode });
  },
  _save: function() {
    console.log("Click the save button.");
    this.refs.imageEditor.save(function(err, data){
      console.log(data);
    });
  },
  // _saved: function(filename) {
  //   console.log("Save the modified image: " + filename);
  // },
  _onClickImage: function() {
    console.log(this.state.receiptSource);
    this.props.navigator.push(Routes.ImageEditScreen(this.state.receiptSource));
  },

  render: function() {
    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={this._onClickImage}>
          <Image source={this.state.receiptSource} style={styles.image} />
        </TouchableHighlight>
      </View>
    );
  }
});


      // <Text>Hello there</Text>
      //   <PanButton style={{flex: 3}} onPress={this._draw} />
      //   <PanButton style={{flex: 3}} onPress={this._save} />
      //   <ImageEditor drawingMode={this.state.drawingMode}
      //     ref="imageEditor"
      //     imageSourceUri={this.state.originalImageSourceUri}
      //     size={this.state.editorSize}
      //     style={[styles.imageEditor, this.state.editorSize]}>
      //   </ImageEditor>
      // </View>

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
