import { generalSettingsTypes } from "../ducks/generalSettings";
import { authActions } from "../ducks/auth";

const createSettings = ({ dispatch }) => (next) => (action) => {
    next(action);
    if (action.type !== generalSettingsTypes.CREATE_SETTINGS) {
        return;
    }
    const { data,callback } = action.payload;
    dispatch({
        type: generalSettingsTypes.API_CALL,
        payload: {
          config: {
            method: "POST",
            url: "general-settings",
            data:data
          },
          authorization: true,
          onStart: () => authActions.startFetch(),
          onComplete: ({ data }) => {
            if (data.success) {
              callback({ success: true , data: data.data });
            } else {
              callback({
                success: false,
                data: { message: "Ha ocurrido un error" },
              });
            }
          },
          onError: async (error) => {
            console.error("General settings POST error: ", error);
            callback({
                success: false,
                data: { message: "Ha ocurrido un error" },
              });
          },
          onEnd: () => authActions.endFetch(),
        },
      });
}

const updateSettings = ({ dispatch }) => (next) => (action) => {
    next(action);
    if (action.type !== generalSettingsTypes.UPDATE_SETTINGS) {
        return;
    }
    const { data,callback } = action.payload;
    dispatch({
        type: generalSettingsTypes.API_CALL,
        payload: {
          config: {
            method: "PUT",
            url: "general-settings",
            data:data
          },
          authorization: true,
          onStart: () => authActions.startFetch(),
          onComplete: ({ data }) => {
            if (data.success) {
              callback({ success: true , data: data.data });
            } else {
              callback({
                success: false,
                data: { message: "Ha ocurrido un error" },
              });
            }
          },
          onError: async (error) => {
            console.error("General settings PUT  error: ", error);
            callback({
                success: false,
                data: { message: "Ha ocurrido un error" },
              });
          },
          onEnd: () => authActions.endFetch(),
        },
      });
}

const getSettings = ({ dispatch }) => (next) => (action) => {
    next(action);
    if (action.type !== generalSettingsTypes.GET_SETTINGS) {
        return;
    }
    const { callback } = action.payload;
    dispatch({
        type: generalSettingsTypes.API_CALL,
        payload: {
          config: {
            method: "GET",
            url: "general-settings",
          },
          authorization: true,
          onStart: () => authActions.startFetch(),
          onComplete: ({ data }) => {
            if (data.success) {
              callback({ success: true , data: data.data });
            } else {
              callback({
                success: false,
                data: { message: "Ha ocurrido un error" },
              });
            }
          },
          onError: async (error) => {
            console.error("General settings GET error: ", error);
            callback({
                success: false,
                data: { message: "Ha ocurrido un error" },
              });
          },
          onEnd: () => authActions.endFetch(),
        },
      });
}

const components = [createSettings, updateSettings, getSettings]

export default components

