/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import * as React from 'react';
// import { Provider } from 'react-redux';
import {StyleSheet, View, Picker} from 'react-native';
import { Header, SearchBar } from 'react-native-elements';
import MyMap from './components/MapView';

export default class App extends React.Component{
  render() {
    return (
      <View style={styles.container}>
        <Header
          leftComponent={{ icon: 'menu', color: '#fff' }}
          centerComponent={{ text: 'Road Trip', style: { color: '#fff' } }}
          rightComponent={{ icon: 'home', color: '#fff' }}
        />
        <MyMap />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {

  },
});
