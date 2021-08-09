import { Dispatch } from "redux";
import { defaultConsumerStreamsNew, IConsumerStreamsNew } from "../../models/reducers/stream/consumerStreamsNew";
import { StreamAxiosInstance } from "../../utils/setupAxiosInterceptors";

interface IAction {
    type: string;
    payload: any;
}

const ACTION_TYPES = {
    SET_CONSUMER_STREAMS: "SET_CONSUMER_STREAMS",
};

const initialstate: Array<IConsumerStreamsNew> = defaultConsumerStreamsNew;

const consumerStreamsNewReducer = (state = initialstate, action: IAction) => {
    switch (action.type) {
        case ACTION_TYPES.SET_CONSUMER_STREAMS:
            state = action.payload;
            return state;
        default:
            return state;
    }
};

const setConsumerStreamsNew = (value: Array<IConsumerStreamsNew>) => {
    return {
        type: ACTION_TYPES.SET_CONSUMER_STREAMS,
        payload: value,
    };
};

const getConsumerStreamsNew = (roomname: string) => async (dispatch: Dispatch) => {
    const keyUser = await StreamAxiosInstance.post("/call/getConsumerUser", { roomname });
    return dispatch(setConsumerStreamsNew(keyUser.data));
};

export { setConsumerStreamsNew, getConsumerStreamsNew, consumerStreamsNewReducer };
