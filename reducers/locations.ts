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
  destination?: Coordinates | null;
  isWatching: boolean;
  mainRoute: any | null;
}
const defaultState: State = {
  initialPosition: null,
  currentPosition: null,
  destination: null,
  isWatching: false,
  mainRoute: null
};

enum ActionType {
  SETINITIALPOSITION = "INITIAL/SET",
  SETCURRENTPOSITION = "CURRENT/SET",
  SETDESTINATIONPOSITION = "DESTINATION/SET",
  SETWATCHPOSITION = "WATCHING/SET",
  SETMAINROUTE = "MAINROUTE/SET"
}

export const mapDispatchToSetInititalPosition = (dispatch: Dispatch) => (
  position: Position
) => {
  dispatch(createAction(ActionType.SETINITIALPOSITION)({ initialPosition: position.coords }));
};

export const mapDispatchToSetCurrentPosition = (dispatch: Dispatch) => (
  position: Position
) => {
  dispatch(createAction(ActionType.SETCURRENTPOSITION)({ currentPosition: position.coords }));
};

export const mapDispatchToSetDestination = (dispatch: Dispatch) => (
  position: Position
) => {
  dispatch(createAction(ActionType.SETDESTINATIONPOSITION)({ destination: position.coords }));
};

export const mapDispatchToSetWatch = (dispatch: Dispatch) => (
  watch: boolean
) => {
  dispatch(createAction(ActionType.SETWATCHPOSITION)({ isWatching: watch }));
};

export const mapDispatchToSetMainRoute = (dispatch: Dispatch) => (
  route: any
) => {
  dispatch(createAction(ActionType.SETMAINROUTE)({ mainRoute: route }));
};

export const routeReducer = createReducer(ActionType.SETMAINROUTE)(defaultState)(
  (state: State, payload: State) => {
    const newState = { ...state, ...payload };
    return newState;
  }
);

export const watchreducer = createReducer(ActionType.SETWATCHPOSITION)(defaultState)(
  (state: State, payload: State) => {
    const newState = { ...state, ...payload };
    return newState;
  }
);

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

export const reducer = reduceReducers([initialreducer, currentreducer, destinationreducer, watchreducer]);

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

export const selectRoutes = (state: RootState) => state.Locations.mainRoute

export const watchingPosition = (state: RootState) => state.Locations.isWatching