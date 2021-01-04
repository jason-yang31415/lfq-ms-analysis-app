import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";

const initialState = {
    input: {},
    side: {},
    main: {},
};

function rootReducer(state = initialState, action) {
    return {};
}

export default createStore(rootReducer, applyMiddleware(thunk));
