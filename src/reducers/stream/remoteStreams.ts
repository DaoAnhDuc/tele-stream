import { defaulttRemoteStreams, IRemoteStreams } from "../../models/reducers/stream/remoteStream";



interface IAction {
    type: string;
    payload: any;
}

const ACTION_TYPES = {
    SET_REMOTE_STREAMS: "SET_REMOTE_STREAMS",
};

const initialstate: Array<IRemoteStreams> = defaulttRemoteStreams;

const remoteStreamReducer = (state = initialstate, action: IAction) => {
    switch (action.type) {
        case ACTION_TYPES.SET_REMOTE_STREAMS:
            state = action.payload;
            return [...state];
        default:
            return state;
    }
};

const setRemoteStream = (value: Array<IRemoteStreams>) => {
  
    return {
        type: ACTION_TYPES.SET_REMOTE_STREAMS,
        payload: value,
    };
};

export { remoteStreamReducer, setRemoteStream };
