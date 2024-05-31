import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import logger from "redux-logger";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { createBrowserHistory } from "history";
import thunk from "redux-thunk";

import * as reducers from "./ducks";
import { api, auth, user, tracking, printLabel, serviceOrder, generalSettings } from "./middlewares";
import configurei18n from "../i18n";
const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    ...reducers,
  });
const configureStore = (initialState = {}) => {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const rootPersistConfig = {
    key: "root",
    storage,
    version: 0.1,
    migrate: (state, version) => {
      state =
        state && version !== state._persist.version ? initialState : state;
      return Promise.resolve(state);
    },
  };
  const history = createBrowserHistory();
  const persistedReducer = persistReducer(
    rootPersistConfig,
    createRootReducer(history)
  );

  const routerHistory = routerMiddleware(history);
  const middlewares = [];

  if (process.env.NODE_ENV === "development") {
    middlewares.push(logger);
  }

  middlewares.push(...[routerHistory, ...api, ...auth, ...user, ...tracking, ...printLabel, ...serviceOrder, ...generalSettings]);
  const store = createStore(
    connectRouter(history)(persistedReducer),
    initialState,
    composeEnhancers(applyMiddleware(...middlewares, thunk))
  );

  const persistor = persistStore(store);

  configurei18n(store);

  return {
    store,
    persistor,
    history,
  };
};
export default configureStore;
