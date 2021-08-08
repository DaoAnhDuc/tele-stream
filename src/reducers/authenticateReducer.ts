export const ACTION_TYPES = {
  AUTHENTICATE: "AUTHENTICATE",
};

interface IAction {
  type: string;
  payload: any;
}

const initializeAuthenticate = false;

const authReducer = (state = initializeAuthenticate, action: IAction) => {
  switch (action.type) {
    case ACTION_TYPES.AUTHENTICATE:
      state = action.payload;
      return state;

    default:
      return state;
  }
};

const setAuth = (data: boolean) => {
  return {
    type: ACTION_TYPES.AUTHENTICATE,
    payload: data,
  };
};

export { authReducer, setAuth };
