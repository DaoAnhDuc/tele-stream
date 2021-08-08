import { defaultLocalStreams, ILocalStreams } from "../../models/reducers/stream/localStreams";


interface IAction {
    type: string;
    payload: any;
}

const ACTION_TYPES = {
    SET_LOCAL_STREAMS: "SET_LOCAL_STREAMS",
};

const initialstate: ILocalStreams = defaultLocalStreams;

const localStreamsReducer = (state = initialstate, action: IAction) => {
    switch (action.type) {
        case ACTION_TYPES.SET_LOCAL_STREAMS:
            state = action.payload;
            return {...state};
        default:
            return state;
    }
};

const setLocalStreams = (value: ILocalStreams) => {
  
    return {
        type: ACTION_TYPES.SET_LOCAL_STREAMS,
        payload: value,
    };
};

export { localStreamsReducer, setLocalStreams };
