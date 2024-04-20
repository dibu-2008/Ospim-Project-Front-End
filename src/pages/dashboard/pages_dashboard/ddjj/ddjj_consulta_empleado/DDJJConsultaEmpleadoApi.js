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

export const obtenerDDJJ = async () => {
  const URL = `/ddjj/totales`;
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

export const consultaDDJJfiltrada = async (desde, hasta, cuit) => {
  let queryStringDesde = "";
  let queryStringHasta = "";

  if (desde !== null) {
    queryStringDesde = `&desde=${encodeURIComponent(desde)}`;
  }
  if (hasta !== null) {
    queryStringHasta = `&hasta=${encodeURIComponent(hasta)}`;
  }

  const URL = `/ddjj/totales?cuit=${cuit}${queryStringDesde}${queryStringHasta}`;

  try {
    const data = await axiosCrud.consultar(URL);
    return data || [];
  } catch (error) {
    console.log(
      "obtenerPorRangoCuit() - catch-error - URL: " +
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

export const axiosDDJJEmpleado = {
  consultar: async function () {
    return obtenerDDJJ();
  },
  consultarFiltrado: async function (desde, hasta, cuit) {
    return consultaDDJJfiltrada(desde, hasta, cuit);
  },
};
