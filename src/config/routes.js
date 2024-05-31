import React from "react";
import { Redirect, Route } from "react-router-dom";
import { connect } from "react-redux";
import Login from "../scenes/login/Login";
import Layout from "../scenes/layout/Layout";
import Home from "../scenes/home/Home";

// register
import CorporateRegister from "../scenes/corporateRegister/CorporateRegister";
import AdminRegister from "../scenes/adminRegister/AdminRegister";

// accounts manager
import UserAccountManager from "../scenes//userAccountManager/UserAccountManager";
import PasswordRecovery from "../scenes/passwordRecovery/PasswordRecovery";
import UserPreferences from "../scenes//userPreferences/UserPreferences";
import PasswordChange from "../scenes/passwordChange/PasswordChange";
import AccountModification from "../scenes/accountModification/AccountModification";
import RootsModification from "../scenes/rootsModification/RootsModification";
import UserModification from "../scenes/userModification/UserModification";
import FormatModification from "../scenes/formatModification/FormatModification";
import LocationResult from "../scenes/locationResult/LocationResult";
import LocationModification from "../scenes/locationModification/LocationModification";
import EditAccount from "../scenes/editAccount/EditAccount";

// app services
import PrintLabel from "../scenes/printLabel/PrintLabel";
import ServiceRequests from "../scenes/serviceRequests/ServiceRequests";
import Tracking from "../scenes/tracking/Tracking";

// service requests
import ServiceRequestsPreload from "../scenes/serviceRequests/ServiceRequestsPreload";
import ServiceRequestsEdit from "../scenes/serviceRequests/ServiceRequestsEdit";
import ServiceRequestsEditDetail from "../scenes/serviceRequests/ServiceRequestsEditDetail";
import ServiceRequestsQuery from "../scenes/serviceRequests/ServiceRequestsQuery";
import ServiceRequestSummary from "../scenes/serviceRequests/ServiceRequestSummary";

// settings
import GeneralSettings from "../scenes/generalSettings/GeneralSettings";

// zones and rates
import ZoneandRates from "../scenes/ZoneandRates/ZoneandRates";
import LocationbyZone from "../scenes/locationbyZone/LocationbyZone";

const mapStateToProps = ({ auth }) => ({
  auth,
});

export const privateRoute = (WrappedComponent, roles) =>
  connect(mapStateToProps)(({ auth, ...rest }) => {
    if (auth.logged) {
      if(auth.userData.firstTimeLogged){
        <Redirect to="/password-change" />
      }
      return roles && roles.includes(auth.userData.roles) ? (
        <WrappedComponent auth={true} {...rest} />
      ) : (
        <Redirect to="/home" />
      );
    } else {
      return <Redirect to="/login" />;
    }
  });

export const RouteWithSubRoutes = (route) => (
  <Route
    path={route.path}
    exact={route.exact}
    render={(props) => <route.component {...props} {...route} />}
  />
);
export const NotFound = () => <Redirect to="/home" />;

const permissions = {
  //in this case everyone can see the screen
  fullAccess: ["ADMINISTRADOR", "CORPORATIVO_ADMINISTRADOR", "CORPORATIVO"],

  //in the following cases the routes are restricted by roles:
  adminAndCorpo: ["CORPORATIVO_ADMINISTRADOR", "CORPORATIVO"],
  rootAndAdmin: ["CORPORATIVO_ADMINISTRADOR", "ADMINISTRADOR"],
  onlyRoot: ["ADMINISTRADOR"],
};

const routes = [
  {
    path: "/login",
    component: Login,
    exact: true,
  },
  {
    path: "/password-recovery",
    component: PasswordRecovery,
    exact: true,
  },
  {
    path: "/",
    component: privateRoute(Layout, permissions.fullAccess),
    routes: [
      {
        path: "/home",
        component: privateRoute(Home, permissions.fullAccess),
        exact: true,
      },
      {
        path: "/password-change",
        component: privateRoute(PasswordChange, permissions.fullAccess),
        exact: true,
      },
      {
        path: "/user-preferences",
        component: privateRoute(UserPreferences, permissions.fullAccess),
        exact: true,
      },
      {
        path: "/user-account-manager",
        component: privateRoute(UserAccountManager, permissions.rootAndAdmin),
        exact: true,
      },
      {
        path: "/user-modification",
        component: privateRoute(UserModification, permissions.rootAndAdmin),
        exact: true,
      },
      {
        path: "/format-modification",
        component: privateRoute(FormatModification, permissions.rootAndAdmin),
        exact: true,
      },
      {
        path: "/location-modification",
        component: privateRoute(LocationModification, permissions.rootAndAdmin),
        exact: true,
      },
      {
        path: "/location-result",
        component: privateRoute(LocationResult, permissions.rootAndAdmin),
        exact: true,
      },
      {
        path: "/account-modification",
        component: privateRoute(AccountModification, permissions.onlyRoot),
        exact: true,
      },
      {
        path: "/edit-users",
        component: privateRoute(EditAccount, permissions.rootAndAdmin),
        exact: true,
      },

      {
        path: "/user-account-manager/register-corporate-account",
        component: privateRoute(CorporateRegister, permissions.rootAndAdmin),
        exact: true,
      },
      {
        path: "/user-account-manager/register-admin-account",
        component: privateRoute(AdminRegister, permissions.onlyRoot),
      },
      {
        path: "/roots-modification",
        component: privateRoute(RootsModification, permissions.onlyRoot),
      },
      {
        path: "/service-requests",
        component: privateRoute(ServiceRequests, permissions.adminAndCorpo),
        exact: true,
      },
      {
        path: "/service-requests/query",
        component: privateRoute(
          ServiceRequestsQuery,
          permissions.adminAndCorpo
        ),
        exact: true,
      },
      {
        path: "/service-requests/preload",
        component: privateRoute(
          ServiceRequestsPreload,
          permissions.adminAndCorpo
        ),
        exact: true,
      },
      {
        path: "/service-requests/preload/edit",
        component: privateRoute(ServiceRequestsEdit, permissions.adminAndCorpo),
        exact: true,
      },
      {
        path: "/service-requests/preload/editdetail",
        component: privateRoute(ServiceRequestsEditDetail, permissions.adminAndCorpo),
        exact: true,
      },
      {
        path: "/print-label",
        component: privateRoute(PrintLabel, permissions.adminAndCorpo),
      },
      {
        path: "/service-requests/summary",
        component: privateRoute(
          ServiceRequestSummary,
          permissions.adminAndCorpo
        ),
        exact: true,
      },
      {
        path: "/tracking",
        component: privateRoute(Tracking, permissions.adminAndCorpo),
        exact: true,
      },
      {
        path: "/general-settings",
        component: privateRoute(GeneralSettings, permissions.onlyRoot),
        exact: true,
      },
      {
        path: "/zones-and-rates",
        component: privateRoute(ZoneandRates, permissions.onlyRoot),
        exact: true,
      },
      {
        path: "/zones-and-rates/location-by-zone",
        component: privateRoute(LocationbyZone, permissions.onlyRoot),
        exact: true,
      },
    ],
  },
  {
    component: NotFound,
  },
];

export default routes;
