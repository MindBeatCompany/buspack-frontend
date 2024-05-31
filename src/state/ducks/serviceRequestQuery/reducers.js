import types from "./types";
import { initialState } from '../../../config/constants';

const serviceRequestQuery = (state = {}, action) => {
    switch (action.type) {
        case types.SET_SAID_TOKEN:
            {
                const {token} = action.payload;
                return {
                    ...state, token:{token}
                }
            }
        default:
            return state;
    }
};

export default serviceRequestQuery;