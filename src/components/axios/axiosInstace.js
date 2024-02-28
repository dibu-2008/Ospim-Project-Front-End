import axios from "axios";
import { getToken } from "@/http_header/getHttpHeader";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Set config defaults when creating the instance
const oAxios = axios.create({
  baseURL: BACKEND_URL, //"http://127.0.0.1:8400/sigeco",
  timeout: 30000,
});

// Alter defaults after instance has been created
oAxios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
oAxios.defaults.headers.common["Access-Control-Allow-Headers"] =
  "POST, GET, PUT, DELETE, OPTIONS, HEAD, Authorization, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Access-Control-Allow-Origin";
oAxios.defaults.headers.common["Content-Type"] = "application/json";
//oAxios.defaults.headers.common["Authorization"] = getToken();

oAxios.interceptors.request.use(
  (req) => {
    req.headers = {
      ...req.headers,
      Authorization: getToken(),
    };
    return req;
  },
  (error) => {
    console.log(
      `** oAxios.interceptors - REQUEST - ERROR - error: ${JSON.stringify(
        error
      )}`
    );
    return Promise.reject(error);
  }
);

oAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log(
      `** oAxios.interceptors - RESPONSE - ERROR - error: ${JSON.stringify(
        error
      )}`
    );

    if (error.response.status == 401) {
      console.log(
        "** oAxios.interceptors - RESPONSE - HTTP - ERROR 401 - VOY AL LOGUIN"
      );
      //showSwalError("Su Sesion expiró. Debe loguearse nuevamente.");
      window.location.href = "/";
      console.log("HTTP - ERROR 401 - ya ajusto window.location.href  ");
      return Promise.reject(error);
    }

    if (error.response.status == 404) {
      console.log("** oAxios.interceptors - RESPONSE - HTTP - ERROR 404");
      if (error.response.config.url) {
        console.log(
          "- URL INCORRECTA: " +
            error.response.config.url +
            ". verificar que el Backend este activo"
        );
      }
      return Promise.reject(error);
    }

    if (error.response && error.response.data) {
      const oJsonResponse = error.response.data;
      console.log(
        "** oAxios.interceptors - RESPONSE - HTTP - oJsonResponse:" +
          JSON.stringify(oJsonResponse)
      );
      return Promise.reject(error);
    }
  }
);

export default oAxios;
