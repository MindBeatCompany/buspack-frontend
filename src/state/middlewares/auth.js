import { authActions, authTypes } from "../ducks/auth";

const login =
    ({ dispatch, getState }) =>
    (next) =>
    (action) => {
        next(action);
        if (action.type !== authTypes.LOGIN) {
            return;
        }
        const { data, callback } = action.payload || {};
        dispatch({
            type: authTypes.API_CALL,
            payload: {
                config: {
                    method: "POST",
                    url: "auth/login",
                    data,
                },
                authorization: false,
                onStart: () => authActions.startFetch(),
                onComplete: async ({ data }) => {
                    if (data.success) {
                        dispatch(authActions.addValue("userData", data.data));
                        dispatch(authActions.logged());
                        dispatch({
                            type: authTypes.ADD_FAILED_LOGIN,
                            payload: {
                                failedLoggins: "",
                            },
                        });
                        callback(true, data.data);
                        // Realizar la solicitud a la ruta deseada de manera asíncrona
                        try {
                            await fetch(
                                "https://back-test.derservicios.com.ar/runUpdaterEnabledPlacesProcess"
                            );
                            // La solicitud se realizó con éxito, puedes continuar con otras acciones si es necesario
                        } catch (error) {
                            // Ocurrió un error al realizar la solicitud, puedes manejarlo si es necesario
                            console.error(
                                "Error al realizar la solicitud:",
                                error
                            );
                        }
                    } else {
                        callback(false, data.data.message);
                    }
                },
                onError: async (error) => {
                    if (data.data) {
                        callback(false, data.data.message);
                    } else {
                        callback(
                            false,
                            "Ocurrió un error, intenta nuevamente más tarde "
                        );
                    }
                },
                onEnd: () => authActions.endFetch(),
            },
        });
    };

const changePassword =
    ({ dispatch }) =>
    (next) =>
    (action) => {
        next(action);
        if (!action || action.type !== authTypes.CHANGE_PASSWORD) {
            return;
        }
        const { currentPassword, newPassword, repeatPassword, callback } =
            action.payload || {};
        if (newPassword !== repeatPassword) {
            callback({
                success: false,
                message: "Las contraseñas no coinciden",
            });
            return;
        }
        dispatch({
            type: authTypes.API_CALL,
            payload: {
                config: {
                    method: "POST",
                    url: `auth/updatepass`,
                    data: { oldPass: currentPassword, newPass: newPassword },
                },
                authorization: true,
                onStart: () => authActions.startFetch(),
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
                onError: async (error) => {
                    callback({
                        success: false,
                        message: "Error al cambiar la contraseña",
                    });
                },
                onEnd: () => authActions.endFetch(),
            },
        });
    };

const blockAccount =
    ({ dispatch, getState }) =>
    (next) =>
    (action) => {
        next(action);
        if (!action || action.type !== authTypes.BLOCK_ACCOUNT) {
            return;
        }
        const {
            auth: {
                userData: { id },
            },
        } = getState();
        const { callback } = action.payload || {};
        dispatch({ type: authTypes.BLOCK_ACCOUNT_DO });
        dispatch({
            type: authTypes.API_CALL,
            payload: {
                config: {
                    method: "PUT",
                    url: `users/${id}`,
                    data: { isActive: false },
                },
                authorization: false,
                onStart: () => authActions.startFetch(),
                onComplete: ({ data }) => {
                    if (data.success) {
                        callback({
                            success: data.success,
                            message: "Cuenta bloqueada",
                        });
                    } else {
                        callback({
                            success: data.success,
                            message: "Error interno",
                        });
                    }
                },
                onError: async (error) => {
                    callback({
                        success: error.success,
                        message: "Error interno",
                    });
                },
                onEnd: () => authActions.endFetch(),
            },
        });
    };
const getAccountStatus =
    ({ dispatch, getState }) =>
    (next) =>
    (action) => {
        next(action);
        if (!action || action.type !== authTypes.GET_ACCOUNT_STATUS) {
            return;
        }
        const isActive = getState().auth.userData.isActive;
        if (!isActive) {
            dispatch(authActions.blockAccount());
        }
    };

const recoveryPass =
    ({ dispatch }) =>
    (next) =>
    (action) => {
        next(action);
        if (!action || action.type !== authTypes.RECOVERY_PASS) {
            return;
        }
        const { userName, callback } = action.payload || {};
        dispatch({
            type: authTypes.API_CALL,
            payload: {
                config: {
                    method: "POST",
                    url: `auth/recovery`,
                    data: { userName },
                },
                authorization: false,
                onStart: () => authActions.startFetch(),
                onComplete: ({ data }) => {
                    if (data.success) {
                        callback({
                            success: data.success,
                            message:
                                "Se envio un email para el reinicio de contraseña",
                        });
                    } else {
                        callback({
                            success: data.success,
                            message:
                                "Error al intentar recuperar la contraseña",
                        });
                    }
                },
                onError: async (error) => {
                    callback({
                        success: false,
                        message: "Error al intentar recuperar la contraseña",
                    });
                },
                onEnd: () => authActions.endFetch(),
            },
        });
    };

const resetAccounts =
    ({ dispatch }) =>
    (next) =>
    (action) => {
        next(action);
        if (!action || action.type !== authTypes.RESET_ACCOUNTS) {
            return;
        }
        const { ids, callback } = action.payload || {};
        dispatch({
            type: authTypes.API_CALL,
            payload: {
                config: {
                    method: "PUT",
                    url: `auth/reset`,
                    data: { ids },
                },
                authorization: false,
                onStart: () => authActions.startFetch(),
                onComplete: ({ data }) => {
                    if (data.success) {
                        callback({
                            success: data.success,
                            message:
                                "Se envio un email para el reinicio de contraseña",
                        });
                    } else {
                        callback({
                            success: data.success,
                            message:
                                "Error al intentar recuperar la contraseña",
                        });
                    }
                },
                onError: async (error) => {
                    callback({
                        success: false,
                        message: "Error al intentar recuperar la contraseña",
                    });
                },
                onEnd: () => authActions.endFetch(),
            },
        });
    };
const getHeaders =
    ({ getState }) =>
    (next) =>
    (action) => {
        next(action);
        if (!action || action.type !== authTypes.GET_HEADERS) {
            return;
        }
        const { auth } = getState();
        const headers = {
            Authorization: `Bearer ${auth.userData.token}`,
        };
        const { callback } = action.payload;
        callback(headers);
    };

export default [
    login,
    changePassword,
    recoveryPass,
    blockAccount,
    getAccountStatus,
    resetAccounts,
    getHeaders,
];
