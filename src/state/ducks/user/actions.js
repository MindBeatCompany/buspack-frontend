import { createAction } from "redux-actions";
import types from "./types";
export const getUser = createAction(types.GET_USER);
export const getUsers = createAction(types.GET_USERS);
export const changeConfiguration = createAction(types.CHANGE_CONFIGURATION);
export const changeConfigurationDo = createAction(types.CHANGE_CONFIGURATION_DO);
export const getUserPreferences = createAction(types.GET_USER_PREFERENCES);
export const updateUser = createAction(types.UPDATE_USER);
export const updateUserDo = createAction(types.UPDATE_USER_DO);
export const resetState = createAction(types.RESET_STATE);
export const resetStateDo = createAction(types.RESET_STATE_DO);
export const getRoles = createAction(types.GET_ROLES);
export const createUser = createAction(types.CREATE_USER);
export const createCorporateUser = createAction(types.CREATE_CORPORATE_USER);
export const createUserDo = createAction(types.CREATE_USER_DO);
export const deleteUser = createAction(types.DELETE_USER);
export const uploadFile = createAction(types.UPLOAD_FILE);
export const deactivateAccounts = createAction(types.DEACTIVATE_ACCOUNTS);
export const fetchAccounts = createAction(types.FETCH_ACCOUNTS);
export const fetchUsers = createAction(types.FETCH_USERS);
export const deactivateUsers = createAction(types.DEACTIVATE_USERS);
export const recoveryUsers = createAction(types.RECOVERY_USERS);
export const updateAccount = createAction(types.UPDATE_ACCOUNT);
export const updatePricingFile = createAction(types.UPDATE_PRICING_FILE);
export const updateLocationFile = createAction(types.UPDATE_PRICING_FILE);

/* export const addValue = createAction(types.ADD_VALUE, (key, value) => (
    {
        key,
        value
    }
)); */

export default {
    getUser,
    getUsers,
    changeConfiguration,
    changeConfigurationDo,
    getUserPreferences,
    updateUser,
    updateUserDo,
    resetState,
    resetStateDo,
    getRoles,
    createUser,
    createCorporateUser,
    createUserDo,
    deleteUser,
    uploadFile,
    deactivateAccounts,
    fetchAccounts,
    fetchUsers,
    deactivateUsers,
    recoveryUsers,
    updateAccount,
    updatePricingFile,
    updateLocationFile
};
