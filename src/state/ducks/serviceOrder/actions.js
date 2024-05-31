import { createAction } from "redux-actions";
import types from "./types";

export const resetServiceOrder = createAction(types.RESET_SERVICE_ORDER);
export const resetServiceOrderDo = createAction(types.RESET_SERVICE_ORDER_DO);
export const sendServiceRequest = createAction(types.SEND_SERVICE_REQUEST);
export const sendServiceRequestStandard = createAction(
  types.SEND_SERVICE_REQUEST_STANDARD
);
export const sendServiceRequestPersonalizado = createAction(
  types.SEND_SERVICE_REQUEST_PERSONALIZADO
);
export const sendServiceRequestUpload = createAction(
  types.SEND_SERVICE_REQUEST_UPLOAD
);
export const sendServiceRequestPutArchivo = createAction(
  types.SEND_SERVICE_REQUEST_PUTARCHIVO
);
export const editServiceRequest = createAction(types.EDIT_SERVICE_ORDER);
export const createServiceRequest = createAction(types.CREATE_SERVICE_REQUEST);
export const deleteServiceRequest = createAction(types.DELETE_SERVICE_ORDER);
export const getCustomerByCuit = createAction(types.GET_CUSTOMER_BY_CUIT);
export const getQuery = createAction(types.GET_QUERY);
export const getEnabledPlaces = createAction(types.GET_ENABLED_PLACES);
export default {
  resetServiceOrder,
  resetServiceOrderDo,
  sendServiceRequest,
  sendServiceRequestUpload,
  sendServiceRequestPutArchivo,
  editServiceRequest,
  createServiceRequest,
  deleteServiceRequest,
  getCustomerByCuit,
  getQuery,
  getEnabledPlaces,
  sendServiceRequestStandard,
  sendServiceRequestPersonalizado,
};
