import { defaultPatientInfo, IPatientInfo } from "../models/variables/patientInfo";



const ACTION_TYPES = {
    SET_PATIENT_INFO: 'SET_PATIENT_INFO'
};

interface IAction {
    type: string;
    payload: any;
}

const initialstate: IPatientInfo = defaultPatientInfo

const patientInfoReducer = (state = initialstate, action: IAction) => {
    switch (action.type) {
        case ACTION_TYPES.SET_PATIENT_INFO:
            state = action.payload;
            return state;
        default:
            return state;
    }
};

const setPatientInfo = (userInfo: IPatientInfo) => {
    return {
        type: ACTION_TYPES.SET_PATIENT_INFO,
        payload: userInfo,
    };
};
export { patientInfoReducer, setPatientInfo };
