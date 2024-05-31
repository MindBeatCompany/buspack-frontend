import types from "./types";
import { initialState } from '../../../config/constants';

const serviceOrder = (state = {}, action) => {
    switch (action.type) {
        case types.RESET_SERVICE_ORDER_DO:
            {
                return {
                    ...state, ...initialState.serviceOrder,
                };
            }
        case types.UPDATE_SERVICE_ORDER_LIST:
            {
                const { serviceOrderList } = action.payload
                return { ...state, serviceOrderList: serviceOrderList };
            }
        case types.DELETE_SERVICE_ORDER_DO:
            {
                const { newOrderList } = action.payload
                return { ...state, serviceOrderList: newOrderList };
            }
        case types.EDIT_SERVICE_ORDER_DO:
            {
                 const { requestData, idToModify } = action.payload;
                 const ordersData = state.serviceOrderList;
                 let requestIndex = ordersData.findIndex(req => req.requestId.value === idToModify);
                 
                 ordersData[requestIndex] = requestData;
                return { ...state, serviceOrderList: ordersData };
            }
        default:
            return state;
    }
};

export default serviceOrder;