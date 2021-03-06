import * as React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Image,
    FlatList,
    Dimensions
} from 'react-native';
import RNGooglePlaces from 'react-native-google-places';
import { connect } from 'react-redux';
import { Dispatch } from '../Util';
import { RootState } from '../store';

import { Position, mapDispatchToSetDestination, selectLocation, Coordinates } from '../reducers/locations';

interface Props {
    setDestination: (destination: Position) => void;
    destination: Coordinates | null;
};
interface State {
    showInput: boolean;
    addressQuery: string;
    predictions: any[];
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
    setDestination: (destination: Position) =>
        mapDispatchToSetDestination(dispatch)(destination)
});

const mapStateToProps = (rootState: RootState) => ({
    destination: selectLocation(rootState, 'destination')
});

class AddressPicker extends React.Component<Props, State> {
    pickUpInput: React.RefObject<{}>;
    constructor(props: Props) {
        super(props);
        this.pickUpInput = React.createRef();
        this.state = {
            showInput: false,
            addressQuery: '',
            predictions: []
        };
    }

    onShowInputPress = () => {
        console.log('show input');
        this.setState({ showInput: true });
    }

    onOpenPickerPress = () => {
        console.log('picker');
        RNGooglePlaces.openPlacePickerModal()
            .then((place) => {
                console.log(place);
            })
            .catch(error => console.log(error.message));
    }

    openSearchModal = () => {
        RNGooglePlaces.openAutocompleteModal({
            type: 'address',
            country: 'US',
        })
            .then((place) => {
                const destination = {
                    coords: {
                        latitude: place.latitude,
                        longitude: place.longitude,
                        address: place.address,
                    }
                }
                this.props.setDestination(destination);
                console.log(place);
            })
            .catch(error => console.log(error.message));
    }

    onQueryChange = (text) => {
        this.setState({ addressQuery: text });
        RNGooglePlaces.getAutocompletePredictions(this.state.addressQuery, {
            country: 'US'
        })
            .then((places) => {
                console.log(places);
                this.setState({ predictions: places });
            })
            .catch(error => console.log(error.message));
    }

    keyExtractor = item => item.placeID;

    render() {
        const { destination } = this.props;
        return (
            <View style={{
                borderWidth: 1, borderLeftWidth: 6,
                borderLeftColor: 'black', backgroundColor: "white",
                borderRadius: 5, borderColor: 'black', opacity: 0.5,
                height: 50
            }}>
                <TouchableOpacity style={styles.button} onPress={this.openSearchModal}>
                    <Text style={styles.buttonText}>{destination ? destination.address : 'Please select a destination'}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        padding: 12,
    },
    button: {
        //backgroundColor: 'transparent',
        flexDirection: 'row',
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: 'black'
    },
    inputLauncher: {
        backgroundColor: '#F3F7F9',
        width: '100%',
        borderRadius: 4,
        height: 35,
        justifyContent: 'center',
        paddingLeft: 10,
        marginBottom: 16
    },
    inputWrapper: {
        backgroundColor: '#F3F7F9',
        width: '100%',
        borderRadius: 2,
        justifyContent: 'center',
        paddingHorizontal: 8
    },
    input: {
        color: '#222B2F',
        height: 35,
        fontSize: 15,
        paddingVertical: 4
    },
    list: {
        marginTop: 16,
        height: Dimensions.get('window').height - 70
    },
    listItemWrapper: {
        backgroundColor: 'transparent',
        height: 56
    },
    avatar: {

    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: '100%'
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#DAE4E9',
        width: '92%',
        marginHorizontal: 16,
        opacity: 0.6
    },
    primaryText: {
        color: '#222B2F',
        fontSize: 15,
        marginBottom: 3
    },
    placeMeta: {
        flex: 1,
        marginLeft: 15
    },
    secondaryText: {
        color: '#9BABB4',
        fontSize: 13,
    },
    listIcon: {
        width: 25,
        height: 25
    }
});

export default connect(mapStateToProps,
    mapDispatchToProps)(AddressPicker);