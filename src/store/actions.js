export const ACTIONS = {
    SET_INPUT_SAMPLES: "SET_INPUT_SAMPLES",
};

export function createAction(type, data) {
    return {
        type,
        data,
    };
}
