import { applyMiddleware, createStore, compose } from "redux";
import thunk from "redux-thunk";
import { ACTIONS } from "./actions";

const initialState = {
    input: {
        samples: [],
        conditions: [],
    },
    view: {
        figureOptions: {},
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
        case ACTIONS.SET_INPUT_CONDITIONS:
            return Object.assign({}, state, {
                conditions: action.data,
            });
        case ACTIONS.SET_INPUT_COMPARISONS:
            return Object.assign({}, state, {
                comparisons: action.data,
            });
    }
    return state;
}

function viewReducer(state, action) {
    switch (action.type) {
        case ACTIONS.SET_VIEW_FIGURE_OPTIONS:
            return Object.assign({}, state, {
                figureOptions: action.data,
            });
    }
    return state;
}

function rootReducer(state = initialState, action) {
    const cpy = { ...state };
    switch (action.type) {
        case ACTIONS.SET_INPUT_SAMPLES:
        case ACTIONS.SET_INPUT_CONDITIONS:
        case ACTIONS.SET_INPUT_COMPARISONS:
            cpy.input = inputReducer(state.input, action);
            break;
        case ACTIONS.SET_VIEW_FIGURE_OPTIONS:
            cpy.view = viewReducer(state.view, action);
            break;
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
