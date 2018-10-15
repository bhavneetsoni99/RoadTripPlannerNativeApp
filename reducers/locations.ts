import { createAction, createReducer, Dispatch, reduceReducers } from "../Util";

export interface Coordinates {
  accuracy?: number;
  altitude?: number;
  heading?: number;
  latitude: number;
  longitude: number;
  speed?: number;
  address?: string;
}

export interface Position {
  coords: Coordinates;
  mocked?: boolean;
  timeStamp?: number;
}

export interface State {
  initialPosition: Coordinates | null;
  currentPosition: Coordinates | null;
  destination: Coordinates | null;
}
const defaultState: State = {
  initialPosition: null,
  currentPosition: null,
  destination: null
};

enum ActionType {
  SETINITIALPOSITION = "INITIAL/SET",
  SETCURRENTPOSITION = "CURRENT/SET",
  SETDESTINATIONPOSITION = "DESTINATION/SET",
}

export const mapDispatchToSetInititalPosition = (dispatch: Dispatch) => (
  position: Position
) => {
  // for show of concept only we can directly dispatch an Action object here
  dispatch(createAction(ActionType.SETINITIALPOSITION)({ initialPosition: position.coords }));
};

export const mapDispatchToSetCurrentPosition = (dispatch: Dispatch) => (
  position: Position
) => {
  // for show of concept only we can directly dispatch an Action object here
  dispatch(createAction(ActionType.SETCURRENTPOSITION)({ currentPosition: position.coords }));
};

export const mapDispatchToSetDestination = (dispatch: Dispatch) => (
  position: Position
) => {
  // for show of concept only we can directly dispatch an Action object here
  dispatch(createAction(ActionType.SETDESTINATIONPOSITION)({ destination: position.coords }));
};

export const initialreducer = createReducer(ActionType.SETINITIALPOSITION)(defaultState)(
  (state: State, payload: State) => {
    const newState = { ...state, ...payload };
    return newState;
  }
);

export const currentreducer = createReducer(ActionType.SETCURRENTPOSITION)(defaultState)(
  (state: State, payload: State) => {
    const newState = { ...state, ...payload };
    return newState;
  }
);

export const destinationreducer = createReducer(ActionType.SETDESTINATIONPOSITION)(defaultState)(
  (state: State, payload: State) => {
    const newState = { ...state, ...payload };
    return newState;
  }
);

export const reducer = reduceReducers([initialreducer, currentreducer, destinationreducer]);

export interface RootState {
  Locations: State;
}

export const selectLocation = (state: RootState, type: string) => {
  const { initialPosition, currentPosition, destination } = state.Locations
  switch (type) {
    case ('starting'):
      return initialPosition;
    case ('current'):
      return currentPosition;
    case ('destination'):
      return destination;

  }
}