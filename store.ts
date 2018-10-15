import { combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import {
  RootState as TripRootState,
  reducer as tripReducer,
} from './reducers/tripPicker';
import {
  RootState as PositionsRootState,
  reducer as locationsReducer,
} from './reducers/locations';

export interface RootState extends TripRootState, PositionsRootState { }

const rootReducer = combineReducers<RootState>({
  Trip: tripReducer,
  Locations: locationsReducer,
});

const store = createStore<RootState>(rootReducer, composeWithDevTools());

export default store;