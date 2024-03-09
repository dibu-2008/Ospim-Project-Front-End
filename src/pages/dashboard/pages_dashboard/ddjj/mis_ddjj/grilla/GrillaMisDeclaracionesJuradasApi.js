import oAxios from "@components/axios/axiosInstace";
import { axiosCrud } from "@components/axios/axiosCrud";
import { showErrorBackEnd } from "@/components/axios/showErrorBackEnd";
import swal from "@/components/swal/swal";

const HTTP_MSG_ALTA = import.meta.env.VITE_HTTP_MSG_ALTA;
const HTTP_MSG_MODI = import.meta.env.VITE_HTTP_MSG_MODI;
const HTTP_MSG_BAJA = import.meta.env.VITE_HTTP_MSG_BAJA;
const HTTP_MSG_ALTA_ERROR = import.meta.env.VITE_HTTP_MSG_ALTA_ERROR;
const HTTP_MSG_MODI_ERROR = import.meta.env.VITE_HTTP_MSG_MODI_ERROR;
const HTTP_MSG_BAJA_ERROR = import.meta.env.VITE_HTTP_MSG_BAJA_ERROR;
const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;

export const obtenerAportes = async () => {
  const URL = "/aportes/";
  try {
    const data = await axiosCrud.consultar(URL);
    return data || [];
  } catch (error) {
    showErrorBackEnd(
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`,
      error
    );
    return [];
  }
};

export const obtenerMisDeclaracionesJuradas = async (empresaId) => {
  const URL = `/empresa/${empresaId}/ddjj/totales`;
  try {
    const data = await axiosCrud.consultar(URL);
    return data || [];
  } catch (error) {
    console.log(
      "obtenerMisDeclaracionesJuradas() - catch-error - URL: " +
        URL +
        " - status: " +
        error.status
    );

    showErrorBackEnd(
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`,
      error
    );
    return [];
  }
};

export const obtenerMiDeclaracionJurada = async (empresaId, ddjjId) => {
  const URL = `/empresa/${empresaId}/ddjj/${ddjjId}`;
  try {
    const data = await axiosCrud.consultar(URL);
    return data || {};
  } catch (error) {
    showErrorBackEnd(
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`,
      error
    );
    return [];
  }
};

export const imprimirDeclaracionJurada = async (empresaId, ddjjId) => {
  const URL = `/empresa/${empresaId}/ddjj/${ddjjId}/imprimir`;

  try {
    const response = await oAxios.get(URL, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `DeclaracionJurada${ddjjId}.pdf`);
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    showErrorBackEnd("Error de Impresion", error);
  }
};

export const presentarDeclaracionJurada = async (empresaId, ddjjId) => {
  const URL = `/empresa/${empresaId}/ddjj/${ddjjId}/presentar`;
  try {
    const response = await oAxios.patch(URL);
    if (response.status === 200) {
      swal.showSuccess(HTTP_MSG_MODI);
      return true;
    }
  } catch (error) {
    showErrorBackEnd(HTTP_MSG_MODI_ERROR, error);
    return [];
  }
  return false;
};

export const eliminarDeclaracionJurada = async (empresaId, ddjjId) => {
  const URL = `/empresa/${empresaId}/ddjj`;
  try {
    const response = await axiosCrud.eliminar(URL, ddjjId);
    if (response == true) {
      swal.showSuccess(HTTP_MSG_BAJA);
      return true;
    }
    throw response;
  } catch (error) {
    showErrorBackEnd(HTTP_MSG_BAJA_ERROR, error);
    return false;
  }
};

export const axiosDDJJ = {
  getAportes: async function () {
    return obtenerAportes();
  },

  consultar: async function (empresaId) {
    return obtenerMisDeclaracionesJuradas(empresaId);
  },

  getDDJJ: async function (empresaId, ddjjId) {
    return obtenerMiDeclaracionJurada(empresaId, ddjjId);
  },

  imprimir: async function (empresaId, ddjjId) {
    return imprimirDeclaracionJurada(empresaId, ddjjId);
  },

  presentar: async function (empresaId, ddjjId) {
    return presentarDeclaracionJurada(empresaId, ddjjId);
  },

  eliminar: async function (empresaId, ddjjId) {
    return eliminarDeclaracionJurada(empresaId, ddjjId);
  },
};
