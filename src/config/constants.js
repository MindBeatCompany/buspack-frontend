import axios from "axios";

import { API_VERSION, ENDPOINTS, ENV } from "./env.js";

const { API } = ENDPOINTS;
export const URL = API[ENV];
export const API_URL = `${URL}/${API_VERSION}/api`;
export const BASEURL = API_URL;
export const HEADERS = ({ token, expToken, contentType = null }) => {
  const headers = new Headers();
  headers.append("cache-control", "no-cache");
  headers.append("Access-Control-Allow-Origin", "*");
  headers.append("Access-Control-Allow-Credentials", true);
  headers.append(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  headers.append(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  if (contentType) {
    headers.append("Content-Type", contentType);
  } else {
    headers.append("Content-Type", "application/json");
  }
  headers.append("Authorization", token);
  headers.append("Exptoken", expToken);
  return headers;
};

export const api = axios.create({
  // baseURL: API_URL,
  baseURL: "https://api-test.derservicios.com.ar//v1/api",
  // baseURL: "https://qa.derservicios.com.ar/v1/api/v1/api",

  timeout: 120000,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

export const URL_CONSTANTS = {
  downloadPlanilla: "/service-request/download/planilla",
  downloadTarifario: "/users/download/tariff",
  downloadLocalidades: "/users/download/localidades",
};

export const FILENAME_CONSTANTS = {
  planilla: "planilla-solicitudes.xlsx",
  planillaTarifario: "planilla-tarifario.xlsx",
  planillaLocalidades: "planilla-localidades.xlsx",
};

export const initialState = {
  auth: {
    logged: false,
    local: "es-AR",
    currency: "ARS",
    loading: false,
    error: null,
    blocked: false,
    failedLoggins: 0,
  },
  tracking: {
    id: 0,
    token: "",
  },
  printLabel: {
    id: 0,
  },
  serviceOrder: {
    id: 0,
    serviceOrderList: [],
  },
  user: {
    idleTimeInSeconds: 600,
    roles: [],
    usersList: [],
  },
  generalSettings: {
    originPlaceId: "",
    secureId: "",
    takeAwayId: "",
    homeDeliveryId: "",
    originAgencyId: "",
    voucherLetter: "",
    voucherPoint: "",
    originPlace: "",
  },
};

export const MethodConstants = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
};
