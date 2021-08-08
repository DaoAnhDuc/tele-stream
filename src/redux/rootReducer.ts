import { combineReducers } from "redux";
import { authReducer } from "../reducers/authenticateReducer";
import { errorBoundryReducer } from "../reducers/errorBoudryReducer";
import { patientInfoReducer } from "../reducers/patientInfoReducer";
import { consultationCheckReducer } from "../reducers/stream/consultationCheckReducer";
import { loadingStreamReducer } from "../reducers/stream/loading";
import { localStreamsReducer } from "../reducers/stream/localStreams";
import { messageReducer } from "../reducers/stream/messageReducer";
import { modeStreamReducer } from "../reducers/stream/modeStream";
import { remoteStreamReducer } from "../reducers/stream/remoteStreams";
import { siderReducer } from "../reducers/stream/siderReducer";

const rootReducer = combineReducers({
    errorBoundryState: errorBoundryReducer, 
    isAuthenticate: authReducer,
    siderState: siderReducer,
    modeStream: modeStreamReducer,
    messageState: messageReducer,
    localStreams: localStreamsReducer,
    remoteStreams: remoteStreamReducer,
    loadingStream: loadingStreamReducer,
    consultationCheck: consultationCheckReducer,
    patientInfoState: patientInfoReducer,
});
export { rootReducer };
