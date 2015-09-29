'use strict';

var React = require('react-native');

var {
  CameraRoll,
  Image,
  StyleSheet,
  Text,
  View
} = React;

var ImageEditor = require('react-native-image-editor');
var PanButton = require('./PanButton');

var PAGE_SIZE = 5;

var ImageEditScreen = React.createClass({
  statics: {
    key: 'full',
    title: 'Image Editor',
    description: 'Screen for editing image'
  },

  getInitialState: function() {
    this._isMounted = true;
    this._fetchRandomPhoto();
    return {
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
          this.setState({originalImageSourceUri: randomPhoto.uri});
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
  getDefaultProps: function() {
    return {
      image: ''
    };
  },
  render: function() {
    return (
      <View style={styles.container}>
        <Text>Hello there</Text>
        <PanButton style={{flex: 3}} onPress={this._draw} />
        <PanButton style={{flex: 3}} onPress={this._save} />
        <ImageEditor drawingMode={this.state.drawingMode}
          ref="imageEditor"
          imageSourceUri={this.props.source.uri}
          size={this.state.editorSize}
          style={[styles.imageEditor, this.state.editorSize]}>
        </ImageEditor>
      </View>
    );
  },
});

      // <View style={styles.imageContainer}>
      //   <Image style={styles.image} source={{uri: this.props.image}} />
      // </View>

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

module.exports = ImageEditScreen;