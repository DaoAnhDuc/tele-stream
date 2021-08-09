import { Dispatch } from "redux";
import { defaultKeyStreamsNew, IKeyStreamsNew } from "../../models/reducers/stream/keyStreamsNew";
import { StreamAxiosInstance } from "../../utils/setupAxiosInterceptors";

interface IAction {
    type: string;
    payload: any;
}

const ACTION_TYPES = {
    SET_KEY_STREAMS: "SET_KEY_STREAMS",
};

const initialstate: Array<IKeyStreamsNew> = defaultKeyStreamsNew;

const keyStreamsNewReducer = (state = initialstate, action: IAction) => {
    switch (action.type) {
        case ACTION_TYPES.SET_KEY_STREAMS:
            state = action.payload;
            return state;
        default:
            return state;
    }
};

const setKeyStreamsNew = (value: Array<IKeyStreamsNew>) => {
    return {
        type: ACTION_TYPES.SET_KEY_STREAMS,
        payload: value,
    };
};

const getKeyStreamsNew = (roomname: string) => async (dispatch: Dispatch) => {
    console.log(roomname)
    const keyUser = await StreamAxiosInstance.post("/call/getKeyUser", { roomname });
    return dispatch(setKeyStreamsNew(keyUser.data));
};

export { keyStreamsNewReducer, setKeyStreamsNew, getKeyStreamsNew };
