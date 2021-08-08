import { defaultMessageState, IMessageState } from "../../models/reducers/stream/message";


export const ACTION_TYPES = {
  SET_MESSAGE: "SET_MESSAGE",
};

interface IAction {
  type: string;
  payload: any;
}

const initializeMessage: Array<IMessageState> = defaultMessageState;

const messageReducer = (state = initializeMessage, action: IAction) => {
  switch (action.type) {
    case ACTION_TYPES.SET_MESSAGE:
      state = action.payload;
      return state;

    default:
      return state;
  }
};

const setMessage = (stream: IMessageState) => {
  return {
    type: ACTION_TYPES.SET_MESSAGE,
    payload: stream,
  };
};

export { messageReducer, setMessage };
