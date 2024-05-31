//import axios from "axios";
import { api as axios } from "../../config/constants";
import { apiTypes } from "../ducks/api";
import { authActions, authTypes } from "../ducks/auth";
import { serviceOrderTypes } from "../ducks/serviceOrder";
import { userTypes } from "../ducks/user";
import { printLabelTypes } from "../ducks/printLabel";
import { generalSettingsTypes } from "../ducks/generalSettings";
import { trackingTypes } from "../ducks/tracking";
const api = ({ dispatch, getState }) => (next) => (action) => {
  const types = [authTypes.API_CALL,userTypes.API_CALL, serviceOrderTypes.API_CALL, printLabelTypes.API_CALL, generalSettingsTypes.API_CALL, trackingTypes.API_CALL];

  next(action);
  if (!action || !types.includes(action.type) || !action.payload) {
    return;
  }
  const {
    config: preConfig,
    authorization,
    onStart,
    onEnd,
    onComplete,
    onError
  } = action.payload;
  const { auth } = getState();
  const config = authorization
    ? {
        ...preConfig,
        headers: {
          ...preConfig.headers,
          Authorization: `Bearer ${auth.userData.token}`,
        },
      }
    : preConfig;
  dispatch(onStart ? onStart() : { type: apiTypes.ON_START_NO_DEFINED });

  axios(config)
    .then((response) => {
      const { status } = response;
      if (status === 401) {
        dispatch(authActions.logout());
      }
      onComplete(response);
      dispatch(onEnd());
    })
    .catch((error) => {
      onError(error);
      //const { response } = error;
      // if (response) {
      //   onError(response);
      // } else {
      //   onError(error);
      // }
      dispatch(onEnd());
    });
};

export default [api];
