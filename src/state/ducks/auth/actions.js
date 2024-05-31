import { createAction } from "redux-actions";
import types from "./types";

export const clear = createAction(types.CLEAR);
export const endFetch = createAction(types.END_FETCH);
export const login = createAction(types.LOGIN);
export const logout = createAction(types.LOGOUT);
export const logged = createAction(types.LOGGED);
export const register = createAction(types.REGISTER);
export const signIn = createAction(types.SIGN_IN);
export const startFetch = createAction(types.START_FETCH);
export const setLenguage = createAction(types.SET_LENGUAGE);
export const changePassword = createAction(types.CHANGE_PASSWORD);
export const recoveryPass = createAction(types.RECOVERY_PASS);
export const addFailedLogin = createAction(types.ADD_FAILED_LOGIN);
export const blockAccount = createAction(types.BLOCK_ACCOUNT);
export const getAccountStatus = createAction(types.GET_ACCOUNT_STATUS);
export const resetAccounts = createAction(types.RESET_ACCOUNTS);
export const getHeaders = createAction(types.GET_HEADERS);
export const addValue = createAction(types.ADD_VALUE, (key, value) => (
    {
        key,
        value
    }
));

export default {
  clear,
  endFetch,
  login,
  logout,
  logged,
  register,
  signIn,
  startFetch,
  addValue,
  setLenguage,
  changePassword,
  recoveryPass,
  addFailedLogin,
  blockAccount,
  getAccountStatus,
  getHeaders,
  resetAccounts
};
