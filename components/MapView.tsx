import * as React from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, View} from 'react-native';

const styles = StyleSheet.create({
 container: {
   height: 400,
   width: 400,
   justifyContent: 'flex-end',
   alignItems: 'center',
 },
 map: {
   ...StyleSheet.absoluteFillObject,
 },
});

export default class MyMap extends React.Component {
 render() {
   const { region } = this.props;
   console.log(region);

   return (
     <View style ={styles.container}>
       <MapView
         style={styles.map}
         region={{
           latitude: 37.78825,
           longitude: -122.4324,
           latitudeDelta: 0.015,
           longitudeDelta: 0.0121,
         }}
       >
       </MapView>
     </View>
   );
 }
}