import { createAction } from "redux-actions";
import types from "./types";

export const resetPrintLabel = createAction(types.RESET_PRINT_LABEL);
export const resetPrintLabelDo = createAction(types.RESET_PRINT_LABEL_DO);
export const sendToPrint = createAction(types.SEND_TO_PRINT);
export const getPrintLabel = createAction(types.GET_PRINT_LABEL);
export default {
    resetPrintLabel,
    resetPrintLabelDo,
    sendToPrint,
    getPrintLabel
};