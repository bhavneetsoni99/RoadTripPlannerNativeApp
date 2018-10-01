import { combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import {
  RootState as TripRootState,
  reducer as tripReducer,
} from './reducers/tripPicker';

interface RootState extends TripRootState {}

const rootReducer = combineReducers<RootState>({
  Trip: tripReducer,
});

const store = createStore<RootState>(rootReducer, composeWithDevTools());

export default store;