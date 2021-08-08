import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import { rootReducer } from "./rootReducer";

// const logger = (store) => (next) => (action) => {
//     let result = next(action);
//     return result;
// };

const middleWare = [thunk];

const store = createStore(rootReducer, applyMiddleware(...middleWare));

export { store };