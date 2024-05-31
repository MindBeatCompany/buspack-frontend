import configureStore from "./state/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { withTranslation } from "react-i18next";
import { ConnectedRouter } from "connected-react-router";
import { BrowserRouter, Switch } from "react-router-dom";
import routes, { RouteWithSubRoutes } from "./config/routes";
import {initialState} from './config/constants';
import { LoaderSpinner } from "./components";
import "./styles/index.scss";



const App = () => {
  const { store, persistor, history } = configureStore(initialState);
  return (
    <Provider store={store}>
      <PersistGate loading={<LoaderSpinner />} persistor={persistor}>
        <ConnectedRouter history={history}>
          <BrowserRouter>
            <Switch>
              {routes.map((route) => (
                <RouteWithSubRoutes key={`${route.path}`} {...route} />
              ))}
            </Switch>
          </BrowserRouter>
        </ConnectedRouter>
      </PersistGate>
    </Provider>
  );
};

export default withTranslation()(App);
