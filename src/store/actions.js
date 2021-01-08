export const ACTIONS = {
    SET_INPUT_SAMPLES: "SET_INPUT_SAMPLES",
    SET_INPUT_CONDITIONS: "SET_INPUT_CONDITIONS",
};

export function createAction(type, data) {
    return {
        type,
        data,
    };
}
