import * as React from 'react';
import { Picker} from 'react-native';

interface State {
  typeOfTrip: string;
}

export default class App extends React.Component<{}, State> {

    render() {
        return (<Picker
          selectedValue={this.state.typeOfTrip}
          style={{ height: 50, width: 320, margin: 15, }}
          prompt={'Primary purpose of the trip'}
          mode={'dropdown'}
          onValueChange={(itemValue, itemIndex) => this.setState({ typeOfTrip: itemValue })}>
          <Picker.Item label="Business" value="business" />
          <Picker.Item label="Leisure" value="avoidHighways" />
          <Picker.Item label="Get Me Their Quickest" value="fast" />
          <Picker.Item label="Avoid Tolls" value="noTolls" />
          <Picker.Item label="Lets Explore" value="siteseing" />
        </Picker>
        )
    }
}