import axios from "axios";
import { getToken } from "@/http_header/getHttpHeader";
import { errorBackendResponse as backendErrorHandler } from "@/errors/errorBackendResponse";

// Set config defaults when creating the instance
let oAxios = axios.create();

// Alter defaults after instance has been created
oAxios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
oAxios.defaults.headers.common["Access-Control-Allow-Headers"] =
  "POST, GET, PUT, DELETE, OPTIONS, HEAD, Authorization, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Access-Control-Allow-Origin";
oAxios.defaults.headers.common["Content-Type"] = "application/json";

oAxios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    //console.log("** oAxios.interceptors - ejecutando getToken() .");
    oAxios.defaults.headers.common["Authorization"] = getToken();
    return config;
  },
  function (error) {
    // Do something with request error
    console.log(
      "** oAxios.interceptors - REQUEST - backendErrorHandler(error) ."
    );
    backendErrorHandler(error);
    return Promise.reject(error);
  }
);

oAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(
      "** oAxios.interceptors - RESPONSE - backendErrorHandler(error) ."
    );
    backendErrorHandler(error);
  }
);

export default oAxios;
