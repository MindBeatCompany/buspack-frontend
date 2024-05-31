import { serviceOrderTypes } from "../ducks/serviceOrder";
import { authActions } from "../ducks/auth";
import { BASEURL } from "../../config/constants";
import axios from "axios";

const resetServiceOrder =
    ({ dispatch }) =>
    (next) =>
    (action) => {
        next(action);
        if (action.type !== serviceOrderTypes.RESET_SERVICE_ORDER) {
            return;
        }
        dispatch({ type: serviceOrderTypes.RESET_SERVICE_ORDER_DO });
    };

let customStandard = false;

const sendServiceRequest =
    ({ dispatch }) =>
    (next) =>
    (action) => {
        next(action);
        if (action.type !== serviceOrderTypes.SEND_SERVICE_REQUEST) {
            return;
        }
        const { excelUploaded, callback } = action.payload;
        const data = new FormData();
        data.append("file", excelUploaded[0]);
        return dispatch({
            type: serviceOrderTypes.API_CALL,
            payload: {
                config: {
                    method: "POST",
                    url: service - request / upload,
                    data: data,
                },
                authorization: true,
                onStart: () => authActions.startFetch(),
                onComplete: async ({ data }) => {
                    if (data.success) {
                        callback({ success: true });
                        dispatch({
                            type: serviceOrderTypes.UPDATE_SERVICE_ORDER_LIST,
                            payload: {
                                serviceOrderList: data.data,
                            },
                        });
                    } else {
                        callback({
                            success: false,
                            data: data.data.message,
                        });
                    }
                },
                onError: async (error) => {
                    // Manejar el error si la solicitud original falla
                    console.error(
                        "Error al realizar la solicitud original:",
                        error
                    );
                },
                onEnd: () => authActions.endFetch(),
            },
        });
    };

const sendServiceRequestStandard =
    ({ dispatch }) =>
    (next) =>
    (action) => {
        next(action);
        if (action.type !== serviceOrderTypes.SEND_SERVICE_REQUEST_STANDARD) {
            return;
        }
        const { excelUploadedStandard, typeExcelStandard, callback } =
            action.payload;
        customStandard = typeExcelStandard;
        const data = new FormData();
        data.append("file", excelUploadedStandard[0]);
        return dispatch({
            type: serviceOrderTypes.API_CALL,
            payload: {
                config: {
                    method: "POST",
                    url: `service-request/upload?is-standard-format=${typeExcelStandard}`,
                    data: data,
                },
                authorization: true,
                onStart: () => authActions.startFetch(),
                onComplete: ({ data }) => {
                    if (data.success) {
                        callback({ success: true });
                        dispatch({
                            type: serviceOrderTypes.UPDATE_SERVICE_ORDER_LIST,
                            payload: {
                                serviceOrderList: data.data,
                            },
                        });
                    } else {
                        callback({
                            success: false,
                            data: data.data.message,
                        });
                    }
                },
                onError: async (error) => {
                    // Manejar el error si la solicitud original falla
                    console.error(
                        "Error al realizar la solicitud original:",
                        error
                    );
                },
                onEnd: () => authActions.endFetch(),
            },
        });
    };

const sendServiceRequestPersonalizado =
    ({ dispatch }) =>
    (next) =>
    (action) => {
        next(action);
        if (
            action.type !== serviceOrderTypes.SEND_SERVICE_REQUEST_PERSONALIZADO
        ) {
            return;
        }
        const { excelUploaded, typeExcel, callback } = action.payload;
        customStandard = !typeExcel;
        const data = new FormData();
        data.append("file", excelUploaded[0]);

        return dispatch({
            type: serviceOrderTypes.API_CALL,
            payload: {
                config: {
                    method: "POST",
                    url: `service-request/upload?is-standard-format=${!typeExcel}`,
                    data: data,
                },
                authorization: true,
                onStart: () => authActions.startFetch(),
                onComplete: ({ data }) => {
                    if (data.success) {
                        callback({ success: true });
                        dispatch({
                            type: serviceOrderTypes.UPDATE_SERVICE_ORDER_LIST,
                            payload: {
                                serviceOrderList: data.data,
                            },
                        });
                    } else {
                        callback({
                            success: false,
                            data: data.data.message,
                        });
                    }
                },
                onError: async (error) => {
                    // Manejar el error si la solicitud original falla
                    console.error(
                        "Error al realizar la solicitud original:",
                        error
                    );
                },
                onEnd: () => authActions.endFetch(),
            },
        });
    };

const sendServiceRequestUpload =
    ({ dispatch }) =>
    (next) =>
    (action) => {
        next(action);
        if (action.type !== serviceOrderTypes.SEND_SERVICE_REQUEST_UPLOAD) {
            return;
        }
        const { excelUploaded, callback, clientId } = action.payload;
        const data = new FormData();
        data.append("formatLocalitiesXls", excelUploaded[0]);
        dispatch({
            type: serviceOrderTypes.API_CALL,
            payload: {
                config: {
                    method: "POST",
                    // url: `https://qa.derservicios.com.ar/v1/api/v1/api/service-request/xls-format-localities/upload?accountId=${clientId}`,
                    // url: `http://localhost:4200/v1/api/service-request/xls-format-localities/upload?accountId=${clientId}`,
                    url: `${BASEURL}/service-request/xls-format-localities/upload?accountId=${clientId}`,
                    data: data,
                },
                authorization: true,
                onStart: () => authActions.startFetch(),
                onComplete: ({ data }) => {
                    if (data.success) {
                        callback({ success: true });
                        dispatch({
                            type: serviceOrderTypes.UPDATE_SERVICE_ORDER_LIST,
                            payload: { serviceOrderList: data.data },
                        });
                    } else {
                        if (
                            data.data instanceof Object &&
                            data.data[0] != null
                        ) {
                            callback({
                                success: false,
                                data: data.data[0].messages,
                            });
                        } else if (data.data[0] === undefined) {
                            callback({
                                success: false,
                                data: "planillaCargada",
                            });
                        } else {
                            callback({
                                success: false,
                                data: data.data,
                            });
                        }
                    }
                },
                onError: async (error) => {},
                onEnd: () => authActions.endFetch(),
            },
        });
    };

const sendServiceRequestPutArchivo =
    ({ dispatch }) =>
    (next) =>
    (action) => {
        next(action);
        if (action.type !== serviceOrderTypes.SEND_SERVICE_REQUEST_PUTARCHIVO) {
            return;
        }
        const { excelUploaded, callback, clientId } = action.payload;
        const data = new FormData();
        data.append("formatLocalitiesXls", excelUploaded[0]);
        dispatch({
            type: serviceOrderTypes.API_CALL,
            payload: {
                config: {
                    method: "PUT",
                    // url: `https://qa.derservicios.com.ar/v1/api/v1/api/service-request/xls-format-localities?accountId=${clientId}`,
                    // url: `http://localhost:4200/v1/api/service-request/xls-format-localities?accountId=${clientId}`,
                    url: `${BASEURL}/service-request/xls-format-localities?accountId=${clientId}`,
                    data: data,
                },
                authorization: true,
                onStart: () => authActions.startFetch(),
                onComplete: ({ data }) => {
                    if (data.success) {
                        callback({ success: true });
                        dispatch({
                            type: serviceOrderTypes.UPDATE_SERVICE_ORDER_LIST,
                            payload: { serviceOrderList: data.data },
                        });
                    } else {
                        callback({
                            success: false,
                            data: data,
                        });
                    }
                },
                onError: async (error) => {},
                onEnd: () => authActions.endFetch(),
            },
        });
    };

const editServiceRequest =
    ({ dispatch }) =>
    (next) =>
    (action) => {
        next(action);
        if (action.type !== serviceOrderTypes.EDIT_SERVICE_ORDER) {
            return;
        }
        const data = action.payload;
        dispatch({
            type: serviceOrderTypes.EDIT_SERVICE_ORDER_DO,
            payload: data,
        });
    };

const deleteServiceRequest =
    ({ dispatch }) =>
    (next) =>
    (action) => {
        next(action);
        if (action.type !== serviceOrderTypes.DELETE_SERVICE_ORDER) {
            return;
        }
        const data = action.payload;
        dispatch({
            type: serviceOrderTypes.DELETE_SERVICE_ORDER_DO,
            payload: data,
        });
    };

const createServiceRequest =
    ({ dispatch }) =>
    (next) =>
    (action) => {
        next(action);
        if (action.type !== serviceOrderTypes.CREATE_SERVICE_REQUEST) {
            return;
        }
        const { data, callback } = action.payload;

        dispatch({
            type: serviceOrderTypes.API_CALL,
            payload: {
                config: {
                    method: "POST",
                    url: `service-request/create?is-standard-format=${customStandard}`,
                    data: data,
                },
                authorization: true,
                onStart: () => authActions.startFetch(),
                onComplete: ({ data }) => {
                    if (data.success) {
                        if (data.status === 200) {
                            dispatch({
                                type: serviceOrderTypes.UPDATE_SERVICE_ORDER_LIST,
                                payload: { serviceOrderList: data.data },
                            });
                        }
                        callback(data);
                    } else {
                        callback({
                            success: false,
                            data: { message: "Ha ocurrido un error" },
                        });
                    }
                },
                onError: async (error) => {},
                onEnd: () => authActions.endFetch(),
            },
        });
    };

const getCustomerByCuit =
    ({ dispatch }) =>
    (next) =>
    (action) => {
        next(action);
        if (action.type !== serviceOrderTypes.GET_CUSTOMER_BY_CUIT) {
            return;
        }
        const { data, callback } = action.payload;
        dispatch({
            type: serviceOrderTypes.API_CALL,
            payload: {
                config: {
                    method: "GET",
                    url: `/services-sait/cuit?code=${data.code}`,
                },
                authorization: true,
                onStart: () => authActions.startFetch(),
                onComplete: ({ data }) => {
                    if (data.success) {
                        callback({ success: true, data: data.data });
                    } else {
                        callback({
                            success: false,
                            data: {
                                message: "No se ha conseguido la informaci�n.",
                            },
                        });
                    }
                },
                onError: (error) => {
                    if (error.response && error.response.status === 412) {
                        callback({
                            data: { message: "Este CUIT ya fue dado de Alta" },
                            success: false,
                        });
                    } else {
                        callback({ data: error, success: false });
                    }
                },
                onEnd: () => authActions.endFetch(),
            },
        });
    };

const getQuery =
    ({ dispatch }) =>
    (next) =>
    (action) => {
        next(action);
        if (action.type !== serviceOrderTypes.GET_QUERY) {
            return;
        }
        const { fromDate, toDate, requestId, voucher, delivery, callback } =
            action.payload;

        dispatch({
            type: serviceOrderTypes.API_CALL,
            payload: {
                config: {
                    method: "GET",
                    url: `service-request/query?request-id=${requestId}&voucher=${voucher}&delivery=${delivery}&fromDate=${fromDate}&toDate=${toDate}`,
                },
                authorization: true,
                onStart: () => authActions.startFetch(),
                onComplete: ({ data }) => {
                    callback({ success: true, data: data });
                },
                onError: async (error) => {
                    callback({ success: false, data: error });
                },
                onEnd: () => authActions.endFetch(),
            },
        });
    };

const getEnabledPlaces =
    ({ dispatch }) =>
    (next) =>
    (action) => {
        next(action);
        if (action.type !== serviceOrderTypes.GET_ENABLED_PLACES) {
            return;
        }
        const { callback } = action.payload;
        dispatch({
            type: serviceOrderTypes.API_CALL,
            payload: {
                config: {
                    method: "GET",
                    url: `enabled-places`,
                },
                authorization: true,
                onStart: () => authActions.startFetch(),
                onComplete: ({ data }) => {
                    callback(data);
                },
                onError: async (error) => {
                    console.error(error);
                    callback({ success: false });
                },
                onEnd: () => authActions.endFetch(),
            },
        });
    };

export default [
    resetServiceOrder,
    sendServiceRequest,
    editServiceRequest,
    createServiceRequest,
    deleteServiceRequest,
    getQuery,
    getCustomerByCuit,
    getEnabledPlaces,
    sendServiceRequestUpload,
    sendServiceRequestPutArchivo,
    sendServiceRequestStandard,
    sendServiceRequestPersonalizado,
];
