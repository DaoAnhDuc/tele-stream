import { IProducersActive, defaultProducersActive } from './../../models/reducers/stream/producersActiveState';



interface IAction {
    type: string;
    payload: any;
}

const ACTION_TYPES = {
    SET_PRODUCERS_ACTIVE_STATE: "SET_PRODUCERS_ACTIVE_STATE",
};

const initialstate: IProducersActive = defaultProducersActive;

const producersActiveReducer = (state = initialstate, action: IAction) => {
    switch (action.type) {
        case ACTION_TYPES.SET_PRODUCERS_ACTIVE_STATE:
            state = action.payload;
            return { ...state };
        default:
            return state;
    }
};

const setProducersActive = (value: IProducersActive) => {

    return {
        type: ACTION_TYPES.SET_PRODUCERS_ACTIVE_STATE,
        payload: value,
    };
};

export { producersActiveReducer, setProducersActive };
