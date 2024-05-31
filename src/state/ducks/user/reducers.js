import types from "./types";
import { initialState } from '../../../config/constants';

const user = (state = {}, action) => {
    switch (action.type) {
        case types.RESET_STATE_DO:
            {
                return { ...initialState.user }
            }
        case types.UPDATE_ROLES:
            {
                const { payload } = action
                return { ...state, roles: payload }
            }
        case types.UPDATE_USER_DO:
            {
                const { payload } = action;
                const newUserList = state.usersList.map(user => {
                    if (user.id === payload.id) {
                        return payload;
                    } else {
                        return user;
                    }
                })
                return {
                    ...state,
                    usersList: newUserList
                };
            }
        case types.UPDATE_USERS_LIST:
            {
                const { payload } = action
                return { ...state, usersList: payload };
            }
        case types.CHANGE_CONFIGURATION_DO:
            {
                const { idleTimeInSeconds } = action.payload;
                return {
                    ...state,
                    idleTimeInSeconds: parseInt(idleTimeInSeconds) * 60
                }
            }
        default:
            return state;
    }
};

export default user