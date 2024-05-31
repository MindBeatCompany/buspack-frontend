import types from './types';
import { initialState } from '../../../config/constants';

const generalSettings = (state={}, action)=>{
    switch(action.type){
        case types.RESET_SETTINGS:
            {
                return { ...initialState.generalSettings };
            }
        case types.SET_SETTINGS:
            {
                const { settings } = action.payload;
                return{...state, settings}
            }
        default: 
            return state;
    }

}

export default generalSettings;