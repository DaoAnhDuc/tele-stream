import { defauSiderState, ISiderState } from "../../models/reducers/stream/sider";


interface IAction {
  type: string;
  payload: any;
}

const ACTION_TYPES = {
  SET_SIDER_REDUCER: "SET_SIDER_REDUCER",
};

const initialstate: ISiderState = defauSiderState;

const siderReducer = (state = initialstate, action: IAction) => {
  switch (action.type) {
    case ACTION_TYPES.SET_SIDER_REDUCER:
      state = action.payload;
      return { ...state };
    default:
      return state;
  }
};

const setSiderState = (value: ISiderState) => {
  return {
    type: ACTION_TYPES.SET_SIDER_REDUCER,
    payload: value,
  };
};

export { siderReducer, setSiderState };
