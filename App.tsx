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
import { Header } from 'react-native-elements';
import MapComponent from './components/MapComponent';
import TripPicker from "./components/TripPickerComponent";
import AddressPicker from './components/AddressPickerComponent';
// import AddressPicker from './components/GooglePlacesAutocomplete';

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <View style={styles.container}>
          {/* <Header
            leftComponent={{ icon: 'menu', color: '#fff' }}
            centerComponent={{ text: 'Road Trip', style: { color: '#fff' } }}
            rightComponent={{ icon: 'home', color: '#fff' }}
          /> */}
          <TripPicker />
          <AddressPicker />
          <MapComponent />

        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {

  },
});
