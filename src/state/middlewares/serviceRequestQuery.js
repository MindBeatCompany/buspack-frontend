import { MethodConstants } from "../../config/constants";
import { serviceRequestQueryActions, serviceRequestQueryTypes } from "../ducks/serviceRequestQuery";
import { authActions } from "../ducks/auth";

const onStart = () => authActions.startFetch();
const onEnd = () => authActions.endFetch();
const onError = (response) => console.error(response, JSON.stringify(response));


const getSaidToken = ({ dispatch }) => (next) => (action) => {
    next(action);
    if(action.type !== serviceRequestQueryTypes.GET_SAID_TOKEN){
        return;
    }
    const { callback } = action.payload || {};
    const url = "services-sait/token";
    const method = MethodConstants.GET;
    const onComplete = (response) => {
        let validResponse;
        try {
            validResponse = validateResponse(response.data);
        }catch(error){
            console.error(error , JSON.stringify(error));
        }
        if(validResponse){
            const { token } = validResponse;
            dispatch({ 
                type: serviceRequestQueryTypes.SET_SAID_TOKEN,
                payload: { token }
            });
            console.debug('Token set.');
            callback({success:true})
        }
    };

    dispatch({
        type:trackingTypes.API_CALL,
        payload: {
            config: { url, method },
            authorization: true,
            onStart,
            onComplete,
            onEnd,
            onError,
        }
    });
}

const validateResponse = (response) => {
    
    if(!response.data.token){
        throw Error("No devolvió el token.")
    }
    return { token: response.data.token };
    
}


export default [getSaidToken];