import * as React from "react";
import MapView, { Marker, Polyline as PlolylineComp } from "react-native-maps";
import { StyleSheet, View, Dimensions, Modal, Alert, TouchableHighlight, Text } from "react-native";
import { connect } from "react-redux";
import Polyline from "@mapbox/polyline";
import { RootState } from '../store';
import { isEqual } from 'lodash';
import { checkPermissionToGetLocation, Dispatch } from "../Util";
import { mapDispatchToSetTripPurpose, RootState as TripState, selectPurposeOfTrip } from "../reducers/tripPicker";
import {
  Position, Coordinates,
  mapDispatchToSetInititalPosition, State as LocationState, selectLocation, mapDispatchToSetCurrentPosition, mapDispatchToSetDestination
} from "../reducers/locations";

import key from '../key';

// import {DirectionsRequest, DirectionsService} from 'googlemaps';
const WINDOW = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    height: (WINDOW.height - 150),
    width: WINDOW.width,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  map: {
    ...StyleSheet.absoluteFillObject
  }
});

interface State extends LocationState {
  coords: any | null;
  promptForMultidayTrip: boolean;
}

interface Props {
  purposeOfTrip: string;
  setInitialPosition: (position: Position) => void;
  setCurrentPosition: (position: Position) => void;
  setDestination: (position: Position) => void;
  initialPosition: Coordinates;
  currentPosition: Coordinates;
  destination: Coordinates;
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setInitialPosition: (position: Position) =>
    mapDispatchToSetInititalPosition(dispatch)(position),
  setCurrentPosition: (position: Position) =>
    mapDispatchToSetCurrentPosition(dispatch)(position),
  setDestination: (position: Position) =>
    mapDispatchToSetDestination(dispatch)(position)
});

const mapStateToProps = (rootState: RootState) => ({
  purposeOfTrip: selectPurposeOfTrip(rootState),
  initialPosition: selectLocation(rootState, 'starting'),
  currentPosition: selectLocation(rootState, 'current'),
  destination: selectLocation(rootState, 'destination')
});


class MapComponent extends React.Component<Props, State> {
  map: React.RefObject<MapView>;
  initMarker: React.RefObject<Marker>;
  destMarker: React.RefObject<Marker>;
  props: Props;
  constructor(props: Props) {
    super(props)
    this.map = React.createRef();
    this.initMarker = React.createRef();
    this.destMarker = React.createRef();
    this.state = {
      coords: null,
      promptForMultidayTrip: false
    }
  }
  public watchID;

  public render() {
    const { initialPosition, currentPosition, destination } = this.props;
    return (initialPosition &&
      <View style={styles.container}>
        <MapView
          ref={this.map}
          style={styles.map}
          showsPointsOfInterest={true}
          showsCompass={true}
          showsTraffic={false}
          rotateEnabled={true}
          loadingEnabled={true}
          region={{
            latitude: initialPosition.latitude,
            longitude: initialPosition.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121
          }}
        >
          <Marker coordinate={initialPosition}
            title={"Home"}
            ref={this.initMarker} />
          {destination && <Marker draggable coordinate={destination}
            onDragEnd={(e) => this.setState({ destination: e.coordinate })}
            ref={this.destMarker} />}
          {this.state.coords && <PlolylineComp
            coordinates={this.state.coords}
            strokeWidth={2}
            strokeColor="red" />}
        </MapView>
        <Modal
          animationType="slide"
          hardwareAccelerated={true}
          transparent={false}
          visible={this.state.promptForMultidayTrip}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={{ marginTop: 22 }}>
            <View>
              <Text>Do you want to make it a Multi day Trip</Text>

              <TouchableHighlight
                onPress={() => this.setMultidayModalVisibility(!this.state.promptForMultidayTrip)}>
                <Text>Yes</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View >
    );
  }
  async componentWillMount() {
    await checkPermissionToGetLocation();
  }
  public componentDidMount() {
    const successMethod = (position: Position) => {
      this.props.setInitialPosition(position);
      this.props.setCurrentPosition(position);
    };
    const errorMethod = (error) => { alert(error) };
    navigator.geolocation.getCurrentPosition(
      successMethod, errorMethod,
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
    this.watchID = navigator.geolocation.watchPosition((position: any) => {
      this.props.setCurrentPosition(position);
    });
  }
  componentDidUpdate(prevProps, prevState) {
    const previousDestination = prevProps.destination;
    const previousPurposeOfTrip = prevProps.purposeOfTrip;
    const { destination, purposeOfTrip } = this.props;
    this.destMarker.current && this.fitToMarkersToMap();
    if (
      !isEqual(destination, previousDestination) || !isEqual(purposeOfTrip, previousPurposeOfTrip)) {

      const url = this.getURL();
      this.getDirections(url);
    }
  }
  fitToMarkersToMap() {
    const members = [this.initMarker.current, this.destMarker.current];
    this.map.current.fitToSuppliedMarkers(members.map(m => m.id), true);
  }
  getURL() {
    const { initialPosition, destination } = this.props;
    const startLoc = `${initialPosition.latitude},${initialPosition.longitude}`;
    const destinationLoc = `${destination.latitude},${destination.longitude}`;
    let avoid = '';
    switch (this.props.purposeOfTrip) {
      case "business":
      case "fast":
        avoid = ""
        break
      case "avoidHighways":
      case "siteseing":
        avoid = "&avoid=highways"
        break
      case "noTolls":
        avoid = "&avoid=tolls"

    }
    //waypoints alternatives avoid tolls highways arrival_time departure_time
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}${avoid}&key=${key}`;
    return url;
  }

  componentWillUnmount = () => {
    navigator.geolocation.clearWatch(this.watchID);
  }
  async getDirections(url: string) {
    try {
      let resp = await fetch(url);
      let respJson = await resp.json();
      console.log(respJson);
      respJson.routes[0].legs[0].duration.value > 18000 && this.setMultidayModalVisibility(true);
      this.plotRoute(respJson);
    } catch (error) {
      Alert.alert('Unable to get the Route information at the moment. Please try again later')
    }
  }
  plotRoute(respJson) {
    let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
    let coords = points.map(point => {
      return {
        latitude: point[0],
        longitude: point[1]
      }
    })
    this.setState({ coords: coords })
  }
  setMultidayModalVisibility(visible) {
    this.setState({ promptForMultidayTrip: visible });
  }
}

export default connect(mapStateToProps,
  mapDispatchToProps)(MapComponent);