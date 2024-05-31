import { MethodConstants } from "../../config/constants";
import { trackingActions, trackingTypes } from "../ducks/tracking";
import { authActions } from "../ducks/auth";

const onStart = () => authActions.startFetch();
const onEnd = () => authActions.endFetch();
const onError = (response) => console.error(response, JSON.stringify(response));

const resetTracking = ({ dispatch }) => (next) => (action) => {
    next(action);
    if (action.type !== trackingTypes.RESET_TRACKING) {
        return;
    }
    dispatch({type:trackingTypes.RESET_TRACKING_DO});
}

const getSaidToken = ({ dispatch }) => (next) => (action) => {
    next(action);
    if(action.type !== trackingTypes.GET_SAID_TOKEN){
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
                type: trackingTypes.SET_SAID_TOKEN,
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

const validateDelivery = (response) => {
    if(!response.mensaje && !response.estado){
        throw Error("Error no definido");
    }
    if ((response.mensaje && response.mensaje !== "Correcto") || (response.estado && response.estado !== 1)) {
        throw Error("Hubo un error.", response.mensaje);
    }
    if(response.estados.length === 0) {
        throw Error("Sin estados");
    }
    return {
        estados: response.estados,
        estadodelivery: response.estadodelivery
    }
}

const getDeliveryState = ({ dispatch, getState }) => (next) =>async  (action) => {
    next(action);
    if(action.type !== trackingTypes.GET_DELIVERY_STATE){
        return;
    }
    const { data, callback } = action.payload || {};
    const { tracking } = getState();
    if(!tracking.token) {
        await dispatch(trackingActions.getSaidToken());
    }
    const url = `services-sait/status-delivery`
    const method = MethodConstants.POST;
    const onComplete = (response) => {
        if(response.data.success){
            let validResponse;
            try {
                validResponse = validateDelivery(response.data.data);
            }catch(error){
                console.error(error , JSON.stringify(error));
            }
            if(validResponse){
                const { estados, estadodelivery } = validResponse;
                const payload = {
                    estados,
                    estadodelivery: {
                        fechadeestado: estadodelivery.fechaestado,
                        estado: estadodelivery.estado,
                    },
                };
                
                dispatch({
                    type: trackingTypes.SET_DELIVERY_STATE,
                  payload
                });
                
                callback({success:true, data:payload})
            }
        }
    };

    dispatch({
        type:trackingTypes.API_CALL,
        payload: {
            config: { url, data, method },
            authorization: true,
            onStart,
            onComplete,
            onEnd,
            onError,
        }
    });

}

const getAllDeliveries = ({ dispatch }) => (next) => (action) => {
    next(action);
    if(action.type !== trackingTypes.GET_ALL_DELIVERIES){
        return;
    }
    const { callback } = action.payload || {};
    const url = "service-request";
    const method = MethodConstants.GET;
    const onComplete = (response) => {
        callback({success:true, data:response.data.data})    };
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

export default [resetTracking, getSaidToken, getDeliveryState, getAllDeliveries];