import types from "./types";
import { initialState } from '../../../config/constants';

const tracking = (state = {}, action) => {
    switch (action.type) {
        case types.RESET_TRACKING_DO:
            {
                return {
                    ...state, ...initialState.tracking,
                };
            }
        case types.SET_SAID_TOKEN:
            {
                const {token} = action.payload;
                return {
                    ...state, token:{token}
                }
            }
        case types.SET_DELIVERY_STATE:
            {
                const {estados, estadodelivery }= action.payload;
                return { ...state, estados, estadodelivery}
            }
        case types.GET_ALL_DELIVERIES:
            {
                const {deliveries} = action.payload;
                return { ...state, deliveries}
            }
        default:
            return state;
    }
};

export default tracking;