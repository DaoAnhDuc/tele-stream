import { combineReducers } from "redux";
import { authReducer } from "../reducers/authenticateReducer";
import { errorBoundryReducer } from "../reducers/errorBoudryReducer";
import { patientInfoReducer } from "../reducers/patientInfoReducer";
import { consultationCheckReducer } from "../reducers/stream/consultationCheckReducer";
import { consumerStreamsNewReducer } from "../reducers/stream/consumerStreamNew";
import { keyStreamsNewReducer } from "../reducers/stream/keyStreamNew";
import { loadingStreamReducer } from "../reducers/stream/loading";
import { localStreamsNewReducer } from "../reducers/stream/localStreamsNew";
import { messageReducer } from "../reducers/stream/messageReducer";
import { modeStreamReducer } from "../reducers/stream/modeStream";
import { producersActiveReducer } from "../reducers/stream/producersActiveReducer";
import { siderReducer } from "../reducers/stream/siderReducer";

const rootReducer = combineReducers({
    errorBoundryState: errorBoundryReducer, 
    isAuthenticate: authReducer,
    siderState: siderReducer,
    modeStream: modeStreamReducer,
    messageState: messageReducer,
    loadingStream: loadingStreamReducer,
    consultationCheck: consultationCheckReducer,
    patientInfoState: patientInfoReducer,
    localStreamsNewState:localStreamsNewReducer,
    keyStreamsNewState:keyStreamsNewReducer,
    consumerStreamsNewState:consumerStreamsNewReducer,
    producersActiveState: producersActiveReducer,
});
export { rootReducer };
