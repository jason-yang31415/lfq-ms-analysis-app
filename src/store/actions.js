export const ACTIONS = {
    SET_INPUT_SAMPLES: "SET_INPUT_SAMPLES",
    SET_INPUT_CONDITIONS: "SET_INPUT_CONDITIONS",
    SET_INPUT_COMPARISONS: "SET_INPUT_COMPARISONS",
    SET_VIEW_FIGURE_OPTIONS: "SET_VIEW_FIGURE_OPTIONS",
    APPEND_REPL_LOG: "APPEND_REPL_LOG",
};

export function createAction(type, data) {
    return {
        type,
        data,
    };
}
