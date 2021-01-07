import { applyMiddleware, createStore, compose } from "redux";
import thunk from "redux-thunk";
import { ACTIONS } from "./actions";

const initialState = {
    input: {
        samples: [],
    },
    side: {},
    main: {},
};

function inputReducer(state, action) {
    switch (action.type) {
        case ACTIONS.SET_INPUT_SAMPLES:
            return Object.assign({}, state, {
                samples: action.data,
            });
    }
    return state;
}

function rootReducer(state = initialState, action) {
    const cpy = { ...state };
    switch (action.type) {
        case ACTIONS.SET_INPUT_SAMPLES:
            cpy.input = inputReducer(state.input, action);
    }
    return cpy;
}

const composeEnhancers =
    (typeof window !== "undefined" &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
    compose;

export default createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunk))
);
