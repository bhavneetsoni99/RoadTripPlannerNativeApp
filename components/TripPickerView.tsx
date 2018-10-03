import * as React from "react";
import { Picker } from "react-native";
import { connect } from "react-redux";
import {toPairs} from "lodash";
import { Dispatch } from "../Util";
import {TripPurpose} from "../constants";
import {
  mapDispatchToSetTripPurpose,
  RootState,
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

class TripPickerView extends React.Component<Props> {
  constructor(props: Props){
    super(props)
  }

  public render() {
    const tripTypes = toPairs(TripPurpose);
    const pickerItems = tripTypes.map((trip, i) => 
        <Picker.Item label={trip[0]} value={trip[1]} key={i} />)
    return (
      <Picker
        selectedValue={this.props.purposeOfTrip}
        style={{ height: 50, width: 320, margin: 15 }}
        prompt={"Primary purpose of the trip"}
        mode={"dialog"}
        onValueChange={(itemValue, itemIndex) =>
          this.props.setPurpose(itemValue)
        }
      >
        {pickerItems}
      </Picker>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TripPickerView);