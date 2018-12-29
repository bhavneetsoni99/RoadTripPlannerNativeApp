import * as React from "react";
import MapView, { Marker, Polyline as PlolylineComp } from "react-native-maps";
import { StyleSheet, View, Dimensions, Modal, Alert, TouchableHighlight, Text } from "react-native";
import { connect } from "react-redux";
import Polyline from "@mapbox/polyline";
import { RootState } from '../store';
import { isEqual } from 'lodash';
import { checkPermissionToGetLocation, Dispatch } from "../Util";
import { selectPurposeOfTrip } from "../reducers/tripPicker";
import {
  Position, Coordinates, State as LocationState, selectLocation, mapDispatchToSetDestination
} from "../reducers/locations";

import key from '../key';

const WINDOW = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: (WINDOW.height),
    width: WINDOW.width,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  }
});
// initialPosition: Coordinates | null;
// currentPosition: Coordinates | null;
// destination?: Coordinates | null;
// isWatching: boolean;
// mainRoute: any | null;
interface State extends LocationState {
  coords: any | null;
  promptForMultidayTrip: boolean;
  midPoints: Coordinates[];
}

interface Props {
  purposeOfTrip: string;
  destination: Coordinates;
  setDestination: (destination: Position) => void
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setDestination: (destination: Position) =>
    mapDispatchToSetDestination(dispatch)(destination)
});

const mapStateToProps = (rootState: RootState) => ({
  purposeOfTrip: selectPurposeOfTrip(rootState),
  destination: selectLocation(rootState, 'destination'),
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
      initialPosition: null,
      currentPosition: null,
      promptForMultidayTrip: false,
      coords: null,
      isWatching: false,
      mainRoute: null,
      midPoints: []
    }
  }
  public watchID;

  public render() {
    const { destination, setDestination } = this.props;
    const { initialPosition, currentPosition, midPoints } = this.state;
    return (initialPosition &&
      <View style={styles.container}>
        <MapView
          ref={this.map}
          style={styles.map}
          showsPointsOfInterest={this.state.isWatching}
          showsCompass={true}
          showsTraffic={this.state.isWatching}
          rotateEnabled={true}
          loadingEnabled={true}
          region={{
            latitude: currentPosition.latitude,
            longitude: currentPosition.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121
          }}
        >
          <Marker coordinate={initialPosition}
            title={"Home"}
            ref={this.initMarker} />
          {destination && <Marker draggable coordinate={destination}
            onDragEnd={(e) => setDestination({ coords: e.coordinate })}
            ref={this.destMarker} />}
          {midPoints.map((midPoint, i) => <Marker draggable key={key} coordinate={midPoint} />)}
          {this.state.coords && <PlolylineComp
            coordinates={this.state.coords}
            strokeWidth={2}
            strokeColor="red" />}
        </MapView>
        <Modal
          animationType="slide"
          hardwareAccelerated={true}
          transparent={true}
          visible={this.state.promptForMultidayTrip}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={{
            marginTop: 250, marginHorizontal: 30,
            borderColor: 'black',
            borderRadius: 5,
            borderWidth: 1,
            backgroundColor: 'white', height: 100
          }}>
            <Text style={{
              fontSize: 20, backgroundColor: 'green',
              borderBottomWidth: 1
            }}>Travel Time is more than 6 hours, do you want to make it a Multi day Trip</Text>
            <View style={{ marginTop: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
              <TouchableHighlight
                onPress={() => this.setMultidayModalVisibility(!this.state.promptForMultidayTrip, false)}>
                <Text style={{ marginHorizontal: 100, fontSize: 20 }}>No</Text>
              </TouchableHighlight>
              <TouchableHighlight
                onPress={() => this.setMultidayModalVisibility(!this.state.promptForMultidayTrip, true)}>
                <Text style={{ marginHorizontal: 100, fontSize: 20 }}>Yes</Text>
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
      this.setState({
        initialPosition: position.coords,
        currentPosition: position.coords
      })
    };
    const errorMethod = (error) => { alert(error) };
    navigator.geolocation.getCurrentPosition(
      successMethod, errorMethod,
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
    this.watchID = navigator.geolocation.watchPosition((position: Position) => {
      this.setState({ currentPosition: position.coords });
    });
  }
  componentDidUpdate(prevProps, prevState) {
    const previousDestination = prevProps.destination;
    const previousPurposeOfTrip = prevProps.purposeOfTrip;
    const { purposeOfTrip, destination } = this.props;
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
    const { initialPosition } = this.state;
    const { destination } = this.props;
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
    this.setState({ coords: coords, mainRoute: respJson.routes[0] })
  }
  setMultidayModalVisibility(visible: boolean, splitTrip?: boolean) {
    this.setState({ promptForMultidayTrip: visible });
    splitTrip !== undefined && splitTrip && this.findReaasonableHalfwaySpot();
  }
  findReaasonableHalfwaySpot() {
    const { mainRoute, midPoints } = this.state;
    const routeLeg = mainRoute.legs[0]
    const totalDrivingTime = routeLeg.duration.value;
    const timeFormidwayPoint = totalDrivingTime / 2;
    let drivingTime = 0, stepIndex = 0
    while (drivingTime < timeFormidwayPoint) {
      drivingTime = routeLeg.steps[stepIndex].duration.value
      stepIndex++
    }
    const point = routeLeg.steps[stepIndex].end_location
    midPoints.unshift({
      latitude: point.lat,
      longitude: point.lng
    });
    this.setState({ midPoints });
  }
}

export default connect(mapStateToProps,
  mapDispatchToProps)(MapComponent);