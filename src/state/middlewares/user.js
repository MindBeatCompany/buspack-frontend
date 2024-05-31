import { userActions, userTypes } from "../ducks/user";
import { authActions, authTypes } from "../ducks/auth";

const getUsers =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    next(action);
    if (!action || action.type !== userTypes.GET_USERS) {
      return;
    }
    const { callback } = action.payload || {};
    dispatch({
      type: authTypes.API_CALL,
      payload: {
        config: {
          method: "GET",
          url: "users",
        },
        authorization: true,
        onStart: () => authActions.startFetch(),
        onComplete: ({ data }) => {
          if (data.success) {
            callback({ data: data.data, success: true });
            dispatch({
              type: userTypes.UPDATE_USERS_LIST,
              payload: data.data,
            });
          } else {
            callback({ success: false, message: "Ha ocurrido un error" });
          }
        },
        onError: async (error) => {
          console.error("User preferences PUT error: ", error);
          callback(false);
        },
        onEnd: () => authActions.endFetch(),
      },
    });
  };

const getRoles =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    next(action);
    if (!action || action.type !== userTypes.GET_ROLES) {
      return;
    }
    dispatch({
      type: userTypes.API_CALL,
      payload: {
        config: {
          method: "GET",
          url: "role",
        },
        authorization: true,
        onStart: () => authActions.startFetch(),
        onComplete: ({ data }) => {
          if (data.success) {
            dispatch({ type: userTypes.UPDATE_ROLES, payload: data.data });
          }
        },
        onError: async ({ data }) => {
        },
        onEnd: () => authActions.endFetch(),
      },
    });
  };

const getUser =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    next(action);
    if (!action || action.type !== userTypes.GET_USER) {
      return;
    }
    const { id } = action.payload || {};
    dispatch({
      type: userTypes.API_CALL,
      payload: {
        config: {
          method: "GET",
          url: `users/${id}`,
        },
        authorization: true,
        onStart: () => authActions.startFetch(),
        onComplete: ({ data }) => {

        },
        onError: async ({ data }) => {
        },
        onEnd: () => authActions.endFetch(),
      },
    });
  };

const updateUser =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    next(action);
    if (!action || action.type !== userTypes.UPDATE_USER) {
      return;
    }
    const { data, id, callback } = action.payload || {};
    const body = {
      userName: data.userName,
      firstName: data.name,
      lastName: data.lastname,
      email: data.email,
      rol: data.role.id,
      isActive: data.isActive,
      passReset: data.passReset,
    };
    dispatch({
      type: userTypes.API_CALL,
      payload: {
        config: {
          method: "PUT",
          url: `users/${id}`,
          data: body,
        },
        authorization: true,
        onStart: () => authActions.startFetch(),
        onComplete: ({ data }) => {
          callback({
            success: data.success,
            message: data.data.message,
          });
          if (data.success) {
            dispatch({
              type: userTypes.UPDATE_USER_DO,
              payload: data.data,
            });
          }
        },
        onError: async (error) => {
          console.error("Users PUT error: ", error);
          callback({
            message: "Ha ocurrido un error, intenta nuevamente más tarde",
            success: false,
          });
        },
        onEnd: () => authActions.endFetch(),
      },
    });
  };

const getUserPreferences =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    next(action);
    if (!action || action.type !== userTypes.GET_USER_PREFERENCES) {
      return;
    }
    const { id } = action.payload || {};
    dispatch({
      type: userTypes.API_CALL,
      payload: {
        config: {
          method: "GET",
          url: `users/${id}/preferences`,
        },
        authorization: true,
        onStart: () => authActions.startFetch(),
        onComplete: ({ data }) => {
          if (data.success) {
            dispatch({
              type: userTypes.CHANGE_CONFIGURATION_DO,
              payload: { idleTimeInSeconds: data.data.sessionTime },
            });
          }
        },
        onError: async (error) => {
          console.error("Users Preferences GET error: ", error);
        },
        onEnd: () => authActions.endFetch(),
      },
    });
  };
const changeConfiguration =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    next(action);
    if (!action || action.type !== userTypes.CHANGE_CONFIGURATION) {
      return;
    }
    const { idleTimeInSeconds, id, callback } = action.payload || {};
    // dispatch({
    //     type: userTypes.CHANGE_CONFIGURATION_DO,
    //     payload: { idleTimeInSeconds },
    // });
    dispatch({
      type: authTypes.API_CALL,
      payload: {
        config: {
          method: "PUT",
          url: `users/${id}/preferences`,
          data: { sessionTime: parseInt(idleTimeInSeconds) },
        },
        authorization: true,
        onStart: () => authActions.startFetch(),
        onComplete: ({ data }) => {
          if (data.success) {
            dispatch({
              type: userTypes.CHANGE_CONFIGURATION_DO,
              payload: { idleTimeInSeconds: data.data.sessionTime },
            });
            callback(true);
          } else {
            callback(false);
          }
        },
        onError: async (error) => {
          console.error("User preferences PUT error: ", error);
          callback(false);
        },
        onEnd: () => authActions.endFetch(),
      },
    });
  };
const resetState =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    next(action);
    if (!action || action.type !== userTypes.RESET_STATE) {
      return;
    }
    userActions.resetStateDo();
  };

const createUser =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    next(action);
    if (action.type !== userTypes.CREATE_USER) {
      return;
    }
    const { data, callback } = action.payload || {};
    dispatch({
      type: userTypes.API_CALL,
      payload: {
        config: {
          method: "POST",
          url: `users`,
          data,
        },
        authorization: true,
        onStart: authActions.startFetch,
        onComplete: ({ data }) => {
          if (data.success) {
            callback(true);
          } else {
            let msg = "";

            if (typeof data.data === "string") {
              msg = data.data;

              // it means that the uploaded file has some wrong fields and we have to show them
              if (msg.includes("Columna")) {
                // let's transform the message of the response
                let modifiedMsg = "";
                msg
                  .split("[")
                  .map(
                    (n, i) =>
                      (modifiedMsg += ` ${n.replace("]", "").replace(",", "")}. ${
                        i === 0
                          ? " Revisar los siguientes datos: "
                          : ""
                      }`)
                  );
                msg = modifiedMsg;
              }
            }

            //if there is an error about users (eg. duplicated emails), let's create the messagge's body
            if (data.data.users && data.data.users.length > 0) {
              msg = data.data.message + ":";
              data.data.users.forEach((user) => {
                msg = msg.concat(` ${user.email} `);
              });
            }
            callback(false, msg);
          }
        },
        onError: (error) => {
          callback(false, "Ocurrió un error, intenta nuevamente más tarde");
          console.error("Users POST error: ", error);
        },
        onEnd: authActions.endFetch,
      },
    });
  };

  const createCorporateUser =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    next(action);
    if (action.type !== userTypes.CREATE_CORPORATE_USER) {
      return;
    }
    const { data, callback } = action.payload || {};
    dispatch({
      type: userTypes.API_CALL,
      payload: {
        config: {
          method: "POST",
          url: `users/corporate`,
          data,
        },
        authorization: true,
        onStart: authActions.startFetch,
        onComplete: ({ data }) => {
          if (data.success) {
            callback(true);
          } else {
            let msg = "";

            //if there is an error about users (eg. duplicated emails), let's create the messagge's body
            if (data.data.users && data.data.users.length > 0) {
              msg = data.data.message + ":";
              data.data.users.forEach((user) => {
                msg = msg.concat(` ${user.email} `);
              });
            }
            callback(false, msg);
          }
        },
        onError: (error) => {
          callback(false, "Ocurrió un error, intenta nuevamente más tarde");
          console.error("Users POST error: ", error);
        },
        onEnd: authActions.endFetch,
      },
    });
  };

const deleteUser =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    next(action);
    if (action.type !== userTypes.DELETE_USER) {
      return;
    }
    const { id, callback } = action.payload || {};
    dispatch({
      type: userTypes.API_CALL,
      payload: {
        config: {
          method: "DELETE",
          url: `users/${id}`,
        },
        authorization: true,
        onStart: authActions.startFetch,
        onComplete: ({ data }) => {
          callback(data);
        },
        onError: (error) => {
          console.error("Users DELETE error: ", error);
        },
        onEnd: authActions.endFetch,
      },
    });
  };
const uploadFile =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    next(action);
    if (action.type !== userTypes.UPLOAD_FILE) {
      return;
    }
    const { formData, callback } = action.payload || {};
    dispatch({
      type: userTypes.API_CALL,
      payload: {
        config: {
          method: "POST",
          url: `users/uploadFile`,
          data: { formData },
        },
        authorization: true,
        onStart: authActions.startFetch,
        onComplete: ({ data }) => {
          if (data.success) {
            callback({
              success: data.success,
              message: "Se cambio correctamente la contraseña",
            });
          } else {
            callback({
              success: data.success,
              message: "Error al cambiar la contraseña",
            });
          }
        },
        onError: ({ data }) => {
          callback({
            success: data.success,
            message: "Error al cambiar la contraseña",
          });
        },
        onEnd: authActions.endFetch,
      },
    });
  };

const fetchUsers =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    next(action);
    if (!action || action.type !== userTypes.FETCH_USERS) {
      return;
    }
    const { callback, id } = action.payload || {};
    dispatch({
      type: authTypes.API_CALL,
      payload: {
        config: {
          method: "GET",
          url: `account/${id}/users`,
        },
        authorization: true,
        onStart: () => authActions.startFetch(),
        onComplete: ({ data }) => {
          // ATENCION!! CORREGIR ACÁ QUITAR EL NEGATIVO HASTA TENER EL FIX DEL BACKEND
          if (data.success) {
            dispatch({
              type: userTypes.UPDATE_USERS_LIST,
              payload: data.data,
            });
            callback({ data: data.data, success: true });
          } else {
            callback({ success: false, message: "Ha ocurrido un error" });
          }
        },
        onError: async (error) => {
          console.error("User preferences PUT error: ", error);
          callback(false);
        },
        onEnd: () => authActions.endFetch(),
      },
    });
  };
const fetchAccounts =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    next(action);
    if (!action || action.type !== userTypes.FETCH_ACCOUNTS) {
      return;
    }
    const { callback } = action.payload || {};
    dispatch({
      type: authTypes.API_CALL,
      payload: {
        config: {
          method: "GET",
          url: "account",
        },
        authorization: true,
        onStart: () => authActions.startFetch(),
        onComplete: ({ data }) => {
          if (data.success) {
            callback({ data: data.data, success: true });
          } else {
            callback({ success: false, message: "Ha ocurrido un error" });
          }
        },
        onError: async (error) => {
          console.error("User preferences GET account error: ", error);
          callback(false);
        },
        onEnd: () => authActions.endFetch(),
      },
    });
  };
const deactivateAccount =
  ({ dispatch, getState }) =>
  (next) =>
  (action) => {
    next(action);
    if (action.type !== userTypes.DEACTIVATE_ACCOUNTS) {
      return;
    }
    const state = getState();
    if (!state) {
      return;
    }
    const { data, isActive, callback } = action.payload || {};
    const body = {
      ids: data,
      isActive: isActive,
    };
    dispatch({
      type: userTypes.API_CALL,
      payload: {
        config: {
          method: "PUT",
          url: `account/deactivate`,
          data: body,
        },
        authorization: true,
        onStart: authActions.startFetch,
        onComplete: ({ data }) => {
          if (data.success) {
            callback({
              success: data.success,
              message: "Se desactivaron los usuarios",
            });
          } else {
            callback({
              success: data.success,
              message: "Error al desactivar usuarios y/o cuentas",
            });
          }
        },
        onError: (data) => {
          callback({
            success: false,
            message: "Error al conectarse con la base de datos.",
          });
        },
        onEnd: authActions.endFetch,
      },
    });
  };
const deactivateUsers =
  ({ dispatch, getState }) =>
  (next) =>
  (action) => {
    next(action);
    if (action.type !== userTypes.DEACTIVATE_USERS) {
      return;
    }
    const state = getState();
    if (!state) {
      return;
    }
    const { data, isActive, callback } = action.payload || {};
    const body = {
      ids: data,
      isActive: isActive,
    };
    dispatch({
      type: userTypes.API_CALL,
      payload: {
        config: {
          method: "POST",
          url: `users/status`,
          data: body,
        },
        authorization: true,
        onStart: authActions.startFetch,
        onComplete: ({ data }) => {
          if (data.success) {
            callback({
              success: data.success,
              message: "Se desactivaron los usuarios",
              data: data.data,
            });
          } else {
            callback({
              success: data.success,
              message: "Error al desactivar usuarios y/o cuentas",
            });
          }
        },
        onError: (data) => {
          callback({
            success: false,
            message: "Error al conectarse con la base de datos.",
          });
        },
        onEnd: authActions.endFetch,
      },
    });
  };

const recoveryUsers =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    next(action);
    if (action.type !== userTypes.RECOVERY_USERS) {
      return;
    }
    const { data, callback } = action.payload || {};
    dispatch({
      type: userTypes.API_CALL,
      payload: {
        config: {
          method: "PUT",
          url: `users/reset`,
          data,
        },
        authorization: true,
        onStart: authActions.startFetch,
        onComplete: ({ data }) => {
          if (data.success) {
            callback({
              success: data.success,
            });
          } else {
            callback({
              success: data.success,
              message: "Error al recuperar usuarios",
            });
          }
        },
        onError: (data) => {
          callback({
            success: false,
            message: "Error al conectarse con la base de datos.",
          });
        },
        onEnd: authActions.endFetch,
      },
    });
  };
const updateAccount =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    next(action);
    if (action.type !== userTypes.UPDATE_ACCOUNT) {
      return;
    }
    const { data, callback } = action.payload || {};
    const body = {
      companyName: data.companyName,
      codeECO: data.codeECO,
    };
    dispatch({
      type: userTypes.API_CALL,
      payload: {
        config: {
          method: "PUT",
          url: `account/${data.id}`,
          data: body,
        },
        authorization: true,
        onStart: authActions.startFetch,
        onComplete: ({ data }) => {
          if (data.success) {
            callback({
              success: data.success,
              message: "Se actualizaron los datos de la cuenta",
            });
          } else {
            callback({
              success: data.success,
              message: data.message,
            });
          }
        },
        onError: (data) => {
          callback({
            success: false,
            message: "Error al conectarse con la base de datos.",
          });
        },
        onEnd: authActions.endFetch,
      },
    });
  };

// to update an user's tarifario
const updatePricingFile =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    next(action);
    if (action.type !== userTypes.UPDATE_PRICING_FILE) {
      return;
    }
    const { data, accountId, callback } = action.payload || {};
    dispatch({
      type: userTypes.API_CALL,
      payload: {
        config: {
          method: "PUT",
          url: `users/tariff?accountid=${accountId}`,
          data
        },
        authorization: true,
        onStart: authActions.startFetch,
        onComplete: ({ data }) => {
           if (data.success) {
             callback({
               success: data.success,
               message: "Se actualizaron los datos de la cuenta",
             });
           } else {

            let msg = "";

            if (typeof data.data === "string") {
              msg = data.data;

              // it means that the uploaded file has some wrong fields and we have to show them
              if (msg.includes("Columna")) {
                // let's transform the message of the response
                let modifiedMsg = "";
                msg
                  .split("[")
                  .map(
                    (n, i) =>
                      (modifiedMsg += ` ${n.replace("]", "").replace(",", "")}. ${
                        i === 0
                          ? " Revisar los siguientes datos: "
                          : ""
                      }`)
                  );
                msg = modifiedMsg;
              }
            }



             callback({
               success: false,
               message: msg,
             });
           }
        },
        onError: (data) => {
          console.error(data)
          callback({
            success: false,
            message: "Error al conectarse con la base de datos.",
          });
        },
        onEnd: authActions.endFetch,
      },
    });
  };

  const updateLocationFile =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    next(action);
    if (action.type !== userTypes.UPDATE_PRICING_FILE) {
      return;
    }
    const { data, accountId, callback } = action.payload || {};
    dispatch({
      type: userTypes.API_CALL,
      payload: {
        config: {
          method: "PUT",
          url: `users/tariff?accountid=${accountId}`,
          data
        },
        authorization: true,
        onStart: authActions.startFetch,
        onComplete: ({ data }) => {
           if (data.success) {
             callback({
               success: data.success,
               message: "Se actualizaron los datos de la cuenta",
             });
           } else {

            let msg = "";

            if (typeof data.data === "string") {
              msg = data.data;

              // it means that the uploaded file has some wrong fields and we have to show them
              if (msg.includes("Columna")) {
                // let's transform the message of the response
                let modifiedMsg = "";
                msg
                  .split("[")
                  .map(
                    (n, i) =>
                      (modifiedMsg += ` ${n.replace("]", "").replace(",", "")}. ${
                        i === 0
                          ? " Revisar los siguientes datos: "
                          : ""
                      }`)
                  );
                msg = modifiedMsg;
              }
            }



             callback({
               success: false,
               message: msg,
             });
           }
        },
        onError: (data) => {
          console.error(data)
          callback({
            success: false,
            message: "Error al conectarse con la base de datos.",
          });
        },
        onEnd: authActions.endFetch,
      },
    });
  };

const components = [
  getUsers,
  getUser,
  getUserPreferences,
  updateUser,
  resetState,
  changeConfiguration,
  getRoles,
  createUser,
  createCorporateUser,
  deleteUser,
  uploadFile,
  fetchUsers,
  deactivateAccount,
  fetchAccounts,
  deactivateUsers,
  recoveryUsers,
  updateAccount,
  updatePricingFile,
  updateLocationFile
];

export default components;


