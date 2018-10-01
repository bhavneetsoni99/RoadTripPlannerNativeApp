import { createAction, createReducer, Dispatch } from '../Util';

export interface State {
  purposeOfTrip: string;
}
const defaultState: State = { purposeOfTrip: '' };

enum ActionType {
  SET = 'TRIP/SET',
}

export const mapDispatchToSetTripPurpose = (dispatch: Dispatch) => (purpose: String) => {
  // for show of concept only we can directly dispatch an Action object here
  dispatch(createAction(ActionType.SET)({ purposeOfTrip: purpose }));
};

export const reducer = createReducer(ActionType.SET)(defaultState)(
  (state: State, payload: State) => {
    const newState = { ...state, ...payload };
    return newState;
  },
);

export interface RootState {
  Trip: State;
}

export const selectPurpiseOfTrip = (state: RootState) => state.Trip.purposeOfTrip;
