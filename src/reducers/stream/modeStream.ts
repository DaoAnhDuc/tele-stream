
interface IAction {
    type: string;
    payload: any;
}

const ACTION_TYPES = {
    SET_STREAM_SCREEN_MODE: "SET_STREAM_SCREEN_MODE",
};

const initialstate: number = 0;

const modeStreamReducer = (state = initialstate, action: IAction) => {
    switch (action.type) {
        case ACTION_TYPES.SET_STREAM_SCREEN_MODE:
            state = action.payload;
            return state;
        default:
            return state;
    }
};

const setModeScreenStream = (value: number) => {
    return {
        type: ACTION_TYPES.SET_STREAM_SCREEN_MODE,
        payload: value,
    };
};

export { modeStreamReducer, setModeScreenStream };
