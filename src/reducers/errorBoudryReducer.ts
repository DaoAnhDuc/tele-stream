import { defaultError, IError } from "../models/reducers/error.model";

const ACTION_TYPES = {
  ERROR_BOUDRY: "ERROR_BOUDRY",
};

interface IAction {
  type: string;
  payload: any;
}

const initialstate: IError = defaultError;

const errorBoundryReducer = (state = initialstate, action: IAction) => {
  switch (action.type) {
    case ACTION_TYPES.ERROR_BOUDRY:
      state = action.payload;
      return state;
    default:
      return state;
  }
};

const setErrorBoundry = (error: IError) => {
  return {
    type: ACTION_TYPES.ERROR_BOUDRY,
    payload: error,
  };
};

export { errorBoundryReducer, setErrorBoundry };
