import { createStore } from "redux";

const initialState = {
    input: {},
    side: {},
    main: {},
};

function rootReducer(state = initialState, action) {
    return {};
}

export default createStore(rootReducer);
