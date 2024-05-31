import { createAction } from "redux-actions";
import types from "./types";

export const onStartNoDefined = createAction(types.ON_START_NO_DEFINED);
export const onCompleteNoDefined = createAction(types.ON_COMPLETE_NO_DEFINED);
export const onEndNoDefined = createAction(types.ON_END_NO_DEFINED);
export const onErrorNoDefined = createAction(types.ON_ERROR_NO_DEFINED);

export default { onStartNoDefined, onCompleteNoDefined, onEndNoDefined, onErrorNoDefined };
