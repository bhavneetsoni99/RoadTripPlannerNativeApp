export interface AnyRootState {
    [key: string]: any;
  }
  
  export interface Action<P> {
    readonly type: string;
    readonly payload: P;
  }
  
  export interface ActionCreator<P> {
    (payload: P): Action<P>;
  }
  
  // returns {type:string, payload: Payload}
  export const createAction = (type: string) => <P>(payload: P): Action<P> => ({
    type,
    payload,
  });
  
  export interface PayloadReducer<S, P> {
    (state: S, payload: P): S;
  }
  
  // creates a Reducer that returns new state based on current state and payload
  export const createReducer = (type: string) => <S>(defaultState: S) => <P>(
    payloadReducer: PayloadReducer<S, P>,
  ) => {
    return (state: S | undefined, action: Action<P>): S => {
      if (typeof state === 'undefined') {
        return defaultState;
      }
      if (action.type === type) {
        return payloadReducer(state, action.payload);
      }
      return state;
    };
  };
  
  export const reduceReducers = <S>(reducers: ((state: S, action: Action<any>) => S)[]) => (
    state: S,
    action: Action<any>,
  ) => {
    return reducers.reduce((acc, r) => r(acc, action), state);
  };
  
  export interface Dispatch {
    <P>(action: Action<P>): Action<P>;
  }