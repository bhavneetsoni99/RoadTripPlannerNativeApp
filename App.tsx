/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import * as React from 'react';
import { Provider } from 'react-redux';
import store from "./store";
import { StyleSheet, View } from 'react-native';
import MapComponent from './components/MapComponent';
import TripPicker from "./components/TripPickerComponent";
import AddressPicker from './components/AddressPickerComponent';
import ModifyButtons from './components/ModifyButtons';

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <View>
          <MapComponent />
          <View style={styles.floating}>
            <TripPicker />
            <AddressPicker />
            <ModifyButtons />
          </View>
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  floating: {
    display: "flex",
    flexDirection: "column",
    padding: 30
  }
});
