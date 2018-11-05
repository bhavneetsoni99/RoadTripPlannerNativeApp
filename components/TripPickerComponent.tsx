import * as React from "react";
import { Picker, View, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { toPairs } from "lodash";
import { Dispatch } from "../Util";
import { TripPurpose } from "../constants";
import { RootState } from '../store';
import {
  mapDispatchToSetTripPurpose,
  selectPurposeOfTrip
} from "../reducers/tripPicker";

interface Props {
  setPurpose: (purposeOfTrip: string) => void;
  purposeOfTrip: string;
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setPurpose: (purpose: string) =>
    mapDispatchToSetTripPurpose(dispatch)(purpose)
});

const mapStateToProps = (rootState: RootState) => ({
  purposeOfTrip: selectPurposeOfTrip(rootState)
});

class TripPicker extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
  }

  public render() {
    const tripTypes = toPairs(TripPurpose);
    const pickerItems = tripTypes.map((trip, i) =>
      <Picker.Item label={trip[0]} value={trip[1]} key={i} />)
    return (
      <View style={{
        borderWidth: 1, borderLeftWidth: 6,
        borderLeftColor: 'black', backgroundColor: "white",
        borderRadius: 5, borderColor: 'black', opacity: 0.5,
        height: 50, marginBottom: 15
      }}>
        <Picker
          selectedValue={this.props.purposeOfTrip}
          prompt={"Primary purpose of the trip"}
          mode={"dialog"}
          onValueChange={(itemValue, itemIndex) =>
            this.props.setPurpose(itemValue)
          }
        >{pickerItems}
        </Picker>
      </View >

    );
  }
}

const styles = StyleSheet.create({
  picker: {

    // flexDirection: "column",
    // padding: 10
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TripPicker);