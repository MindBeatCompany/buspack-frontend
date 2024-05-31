import { printLabelTypes } from "../ducks/printLabel";
import { authActions } from "../ducks/auth";

const sendToPrint = ({ dispatch }) => (next) => (action) => {
    next(action);
    if (action.type !== printLabelTypes.SEND_TO_PRINT) {
        return;
    }
    const {data, callback} = action.payload ;
    dispatch({
        type: printLabelTypes.API_CALL,
        payload: {
          config: {
            method: "POST",
            url: `print-labels/pdf`,
            data: data,
            responseType: 'blob',
            headers:{
              responseType: 'blob',
            }
          },
          authorization: true,
          onStart: () => authActions.startFetch(),
          onComplete: ({data}) => {
            const blob = new Blob([data], {type: "application/pdf"});
            callback(blob);
          },
          onError: (error) => {
          },
          onEnd: () => authActions.endFetch(),
        },
      });

}
const resetPrintLabel = ({ dispatch }) => (next) => (action) => {
    next(action);
    if (action.type !== printLabelTypes.RESET_PRINT_LABEL) {
        return;
    }
    dispatch({type:printLabelTypes.RESET_PRINT_LABEL_DO});
}

const getPrintLabel = ({dispatch})=> (next) => (action) => {
  next(action);
  if (action.type !== printLabelTypes.GET_PRINT_LABEL) {
    return;
  }
  const { requestId, voucher, delivery , callback} = action.payload;
  dispatch({
    type: printLabelTypes.API_CALL,
    payload: {
      config: {
        method: "GET",
        url: `service-request/print-label?request-id=${requestId}&voucher=${voucher}&delivery=${delivery}`
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
    }
  })
}
export default [sendToPrint, resetPrintLabel, getPrintLabel];