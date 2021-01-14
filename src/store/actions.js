export const ACTIONS = {
    SET_INPUT_SAMPLES: "SET_INPUT_SAMPLES",
    SET_INPUT_CONDITIONS: "SET_INPUT_CONDITIONS",
    SET_INPUT_COMPARISONS: "SET_INPUT_COMPARISONS",
    SET_VIEW_FIGURE_OPTIONS: "SET_VIEW_FIGURE_OPTIONS",
};

export function createAction(type, data) {
    return {
        type,
        data,
    };
}
