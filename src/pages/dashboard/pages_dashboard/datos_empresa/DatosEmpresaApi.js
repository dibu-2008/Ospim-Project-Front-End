import oAxios from "@components/axios/axiosInstace";
import { showErrorBackEnd } from "@/components/axios/showErrorBackEnd";
import swal from "@components/swal/swal";

const HTTP_MSG_ALTA = import.meta.env.VITE_HTTP_MSG_ALTA;
const HTTP_MSG_MODI = import.meta.env.VITE_HTTP_MSG_MODI;
const HTTP_MSG_BAJA = import.meta.env.VITE_HTTP_MSG_BAJA;
const HTTP_MSG_ALTA_ERROR = import.meta.env.VITE_HTTP_MSG_ALTA_ERROR;
const HTTP_MSG_MODI_ERROR = import.meta.env.VITE_HTTP_MSG_MODI_ERROR;
const HTTP_MSG_BAJA_ERROR = import.meta.env.VITE_HTTP_MSG_BAJA_ERROR;
const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;

export const consultarRamo = async () => {
  const URL = `/empresa/ramo`;
  try {
    const response = await oAxios.get(URL);
    const data = await response.data;
    return data || [];
  } catch (error) {
    console.log("getRamo() - ERROR-catch - error: " + JSON.stringify(error));
    showErrorBackEnd(HTTP_MSG_CONSUL_ERROR, error);
    return [];
  }
};

export const consultarEmpresa = async () => {
  const URL = "/auth/login/usuario";
  try {
    const response = await oAxios.get(URL);
    const data = await response.data;
    return data || [];
  } catch (error) {
    console.log("getEmpresa() - ERROR-catch - error: " + JSON.stringify(error));
    showErrorBackEnd(HTTP_MSG_CONSUL_ERROR, error);
  }
};

export const actualizar = async (registro) => {
  const URL = `/empresa/${registro.id}`;
  try {
    const oRegistro = { ...registro };
    delete oRegistro.id;
    const response = await oAxios.put(URL, oRegistro);
    if (response.status === 200 || response.status === 204) {
      swal.showSuccess(HTTP_MSG_MODI);
    }
  } catch (error) {
    console.log("actualizar() - ERROR-catch - error: " + JSON.stringify(error));
    showErrorBackEnd(HTTP_MSG_MODI_ERROR, error);
  }
};

export const axiosDatosEmpre = {
  consultarEmpresa: async function () {
    return consultarEmpresa();
  },

  consultarRamo: async function () {
    return consultarRamo();
  },

  actualizar: async function (oEntidad) {
    return actualizar(oEntidad);
  },
};
