import types from "./types";
import { initialState } from '../../../config/constants';

const auth = (state = {}, action) => {
    switch (action.type) {
        case types.CLEAR:
            {
                return {
                    ...state, ...initialState.auth,
                };
            }
        case types.LOGGED:
            {
                return {
                    ...state,
                    logged: true,
                };
            }
        case types.START_FETCH:
            {
                return {
                    ...state,
                    loading: true,
                };
            }
        case types.END_FETCH:
            {
                return {
                    ...state,
                    loading: false,
                };
            }
        case types.REGISTER: {
            const userData = action.payload;
            return {
                ...state,
                register: userData,
            };
        }
        case types.ADD_VALUE: {
            const { key, value } = action.payload;
            return {
                ...state,
                [key]: {
                    ...state[key], ...value
                }
            };
        }
        case types.LOGOUT:
            {
                return {
                    ...state,
                    ...initialState.auth
                }
            }
        case types.SET_LENGUAGE:
            {
                const { language } = action.payload
                return {
                    ...state,
                    language
                }
            }
        case types.ADD_FAILED_LOGIN:
            {
                const {failedLoggins} = action.payload;
                return {
                    ...state,
                    failedLoggins
                }
            }    
        case types.BLOCK_ACCOUNT_DO:
            {
                return {
                    ...state,
                    blocked:true
                }
            }
        default:
            return state;
    }
};

export default auth