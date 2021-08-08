import { message } from 'antd';
import { Dispatch } from 'redux';
import { AxiosInstance } from '../../utils/setupAxiosInterceptors';

interface IAction {
    type: string;
    payload: any;
}

const ACTION_TYPES = {
    SET_CONSULTATION_REDUCER: "SET_CONSULTATION_REDUCER",
};

export interface IRequestServicerConsult {
    svid: number,
    flag: string
}

export interface IConclusion {
    sid: number,
    svpSelect: Array<number>,
    svid: number,
    flag: string
}

const initialstate: boolean = false;

const consultationCheckReducer = (state = initialstate, action: IAction) => {
    switch (action.type) {
        case ACTION_TYPES.SET_CONSULTATION_REDUCER:
            state = action.payload;
            return state;
        default:
            return state;
    }
};

const checkServiceConsultation = (data: IRequestServicerConsult) => async (dispatch: Dispatch) => {
    const response = await AxiosInstance.post('/api/Conclusion/service-consult', {
        svid: data.svid,
        flag: data.flag
    })
    if (response.status !== 1) {
        message.error(response.message)
    }
    dispatch(setConsultationCheck(response.data))
}

const updateConclusion = (data: IConclusion) => async (dispatch: Dispatch) => {
    const response = await AxiosInstance.post('/api/Conclusion', data);
    if (response.status !== 1) {
        message.error(response.message)
    }
}

const setConsultationCheck = (value: boolean) => {
    return {
        type: ACTION_TYPES.SET_CONSULTATION_REDUCER,
        payload: value,
    };
};

export { consultationCheckReducer, setConsultationCheck, checkServiceConsultation, updateConclusion };
