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

import { Position, mapDispatchToSetDestination, selectLocation, Coordinates, mapDispatchToSetWatch } from '../reducers/locations';

interface Props {
    setWatchPosition: (watch: boolean) => void;
    destination: Coordinates | null;
};
interface State {
    showInput: boolean;
    addressQuery: string;
    predictions: any[];
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
    setWatchPosition: (watch: boolean) =>
        mapDispatchToSetWatch(dispatch)(watch)
});

const mapStateToProps = (rootState: RootState) => ({
    destination: selectLocation(rootState, 'destination')
});

class ModifyButtons extends React.Component<Props, State> {
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

    render() {
        const { setWatchPosition } = this.props;
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.button} onPress={() => setWatchPosition(true)}>
                    <Text style={styles.buttonText}>Start</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 12,
        flexDirection: 'row',
        alignContent: 'space-between',
    },
    button: {
        backgroundColor: 'green',
        flexDirection: 'row',
        width: 60,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        borderRadius: 5,
        borderColor: "black",
        borderWidth: 1
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
    mapDispatchToProps)(ModifyButtons);