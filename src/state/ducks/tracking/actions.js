import { createAction } from "redux-actions";
import types from "./types";

export const resetTracking = createAction(types.RESET_TRACKING);
export const resetTrackingDo = createAction(types.RESET_TRACKING_DO);
const setSaidToken = createAction(types.SET_SAID_TOKEN);
const getSaidToken = createAction(types.GET_SAID_TOKEN);
const setDeliveryState = createAction(types.SET_DELIVERY_STATE);
const getDeliveryState = createAction(types.GET_DELIVERY_STATE);
const getAllDeliveries = createAction(types.GET_ALL_DELIVERIES);
export default {
    resetTracking,
    resetTrackingDo,
    setSaidToken,
    getSaidToken,
    getDeliveryState,
    setDeliveryState,
    getAllDeliveries
};