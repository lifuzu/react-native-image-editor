/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
} = React;

var ImageEditor = require('react-native-image-editor');

var ReactNativeImageEditor = React.createClass({
  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var rows = ['row 1', 'row 2', 'row 3', 'row 4', 'row 5', 'row 6','row 7', 'row 8', 'row 9', 'row 10', 'row 11', 'row 12','row 13', 'row 14', 'row 15', 'row 16', 'row 17', 'row 18','row 19', 'row 20', 'row 21', 'row 22', 'row 23', 'row 24'];

    return { dataSource: ds.cloneWithRows(rows) };
  },

  renderRow: function(row) {
    return (
      <View style={{height: 50, borderBottomWidth: 1, borderBottomColor: '#eeeeee',}}>
        <Text>{row}</Text>
      </View>
    );
  },

  render: function() {
    return (
      <View style={styles.container}>
        <Text>Hello there</Text>
        <ImageEditor isVisible={true}>
        </ImageEditor>
      </View>
    );
  }
});

          // <View style={styles.wrapper}>
          //   <ListView
          //     style={styles.listView}
          //     dataSource={this.state.dataSource}
          //     renderRow={this.renderRow} />
          // </View>

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
