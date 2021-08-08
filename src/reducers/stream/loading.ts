

interface IAction {
    type: string;
    payload: any;
}

const ACTION_TYPES = {
    SET_LOADING_STREAM: "SET_LOADING_STREAM",
};

const initialstate: boolean = false;

const loadingStreamReducer = (state = initialstate, action: IAction) => {
    switch (action.type) {
        case ACTION_TYPES.SET_LOADING_STREAM:
            state = action.payload;
            return state;
        default:
            return state;
    }
};

const setLoadingStream = (value: boolean) => {
  
    return {
        type: ACTION_TYPES.SET_LOADING_STREAM,
        payload: value,
    };
};

export { loadingStreamReducer, setLoadingStream };
