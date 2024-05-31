import { createAction } from 'redux-actions';
import types from './types'

const createSettings = createAction(types.CREATE_SETTINGS);
const updateSettings = createAction(types.UPDATE_SETTINGS);
const getSettings = createAction(types.GET_SETTINGS);

export default {
    createSettings,
    updateSettings,
    getSettings
}
