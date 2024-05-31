import { createAction } from "redux-actions";
import types from "./types";


const setSaidToken = createAction(types.SET_SAID_TOKEN);
const getSaidToken = createAction(types.GET_SAID_TOKEN);
export default {
    setSaidToken,
    getSaidToken
};