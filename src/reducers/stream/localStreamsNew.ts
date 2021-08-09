import { defaultLocalStreamsNew, ILocalStreamsNew } from "../../models/reducers/stream/localStreamsNew";


interface IAction {
    type: string;
    payload: any;
}

const ACTION_TYPES = {
    SET_LOCAL_STREAMS: "SET_LOCAL_STREAMS",
};

const initialstate: Array<ILocalStreamsNew> = defaultLocalStreamsNew;

const localStreamsNewReducer = (state = initialstate, action: IAction) => {
    switch (action.type) {
        case ACTION_TYPES.SET_LOCAL_STREAMS:
            state = action.payload;
            return state;
        default:
            return state;
    }
};

const setLocalStreamsNew = (value: Array<ILocalStreamsNew>) => {
  
    return {
        type: ACTION_TYPES.SET_LOCAL_STREAMS,
        payload: value,
    };
};

export { localStreamsNewReducer, setLocalStreamsNew };
