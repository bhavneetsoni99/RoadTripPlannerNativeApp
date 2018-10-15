import * as React from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View, Dimensions } from "react-native";
import { connect } from "react-redux";

import { RootState } from '../store';
import { checkPermissionToGetLocation, Dispatch } from "../Util";
import { mapDispatchToSetTripPurpose, RootState as TripState, selectPurposeOfTrip } from "../reducers/tripPicker";
import {
  Position, Coordinates,
  mapDispatchToSetInititalPosition, State as LocationState, selectLocation, mapDispatchToSetCurrentPosition
} from "../reducers/locations";

// import {DirectionsRequest, DirectionsService} from 'googlemaps';
const WINDOW = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    height: (WINDOW.height - 200),
    width: WINDOW.width,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  map: {
    ...StyleSheet.absoluteFillObject
  }
});

interface State extends LocationState { }

interface Props {
  purposeOfTrip: string;
  setInitialPosition: (position: Position) => void;
  setCurrentPosition: (position: Position) => void;
  initialPosition: Coordinates;
  currentPosition: Coordinates;
  destination: Coordinates;
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setInitialPosition: (position: Position) =>
    mapDispatchToSetInititalPosition(dispatch)(position),
  setCurrentPosition: (position: Position) =>
    mapDispatchToSetCurrentPosition(dispatch)(position)
});

const mapStateToProps = (rootState: RootState) => ({
  purposeOfTrip: selectPurposeOfTrip(rootState),
  initialPosition: selectLocation(rootState, 'starting')
});


class MapComponent extends React.Component<Props, State> {
  props: Props;
  constructor(props: Props) {
    super(props)
  }
  public watchID;

  public render() {

    const { initialPosition, currentPosition, destination } = this.props;

    return (initialPosition &&
      <View style={styles.container}>
        <MapView
          style={styles.map}
          region={{
            latitude: initialPosition.latitude,
            longitude: initialPosition.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121
          }}
        >
          <Marker coordinate={initialPosition} />
          {destination && <Marker coordinate={destination} />}
        </MapView>
      </View >
    );
  }
  async componentWillMount() {
    await checkPermissionToGetLocation();
  }
  public componentDidMount() {
    const successMethod = (position: Position) => {
      console.log(position);
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
  componentWillUnmount = () => {
    navigator.geolocation.clearWatch(this.watchID);
  }
}

export default connect(mapStateToProps,
  mapDispatchToProps)(MapComponent);