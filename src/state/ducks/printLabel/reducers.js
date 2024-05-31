import types from "./types";
import { initialState } from '../../../config/constants';

const printLabel = (state = {}, action) => {
    switch (action.type) {
        case types.RESET_PRINT_LABEL_DO:
            {
                return {
                    ...state, ...initialState.printLabel,
                };
            }
        default:
            return state;
    }
};

export default printLabel;