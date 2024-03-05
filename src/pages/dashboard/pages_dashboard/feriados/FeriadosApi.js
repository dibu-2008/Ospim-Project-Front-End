import { axiosCrud } from "@components/axios/axiosCrud";
import { showErrorBackEnd } from "@/components/axios/showErrorBackEnd";
import Swal from "sweetalert2";

const HTTP_MSG_ALTA = import.meta.env.VITE_HTTP_MSG_ALTA;
const HTTP_MSG_MODI = import.meta.env.VITE_HTTP_MSG_MODI;
const HTTP_MSG_BAJA = import.meta.env.VITE_HTTP_MSG_BAJA;
const HTTP_MSG_ALTA_ERROR = import.meta.env.VITE_HTTP_MSG_ALTA_ERROR;
const HTTP_MSG_MODI_ERROR = import.meta.env.VITE_HTTP_MSG_MODI_ERROR;
const HTTP_MSG_BAJA_ERROR = import.meta.env.VITE_HTTP_MSG_BAJA_ERROR;

const URL_ENTITY = "/feriados";

const showSwallSuccess = (MESSAGE_HTTP) => {
  Swal.fire({
    icon: "success",
    title: MESSAGE_HTTP,
    showConfirmButton: false,
    timer: 2000,
  });
};

export const axiosFeriados = {
  consultar: async function (UrlApi) {
    return consultar(UrlApi);
  },

  crear: async function (UrlApi, oEntidad) {
    return crear(UrlApi, oEntidad);
  },

  actualizar: async function (UrlApi, oEntidad) {
    return actualizar(UrlApi, oEntidad);
  },

  eliminar: async function (UrlApi, id) {
    return eliminar(UrlApi, id);
  },
};

export const consultar = async () => {
  try {
    const data = await axiosCrud.consultar(URL_ENTITY);
    return data || [];
  } catch (error) {
    console.log(
      "obtenerFeriados() - ERROR-catch - error: " + JSON.stringify(data)
    );
    return [];
  }
};

export const crear = async (nuevoReg) => {
  try {
    console.log("crearFeriado - nuevoReg: " + JSON.stringify(nuevoReg));
    const data = await axiosCrud.crear(URL_ENTITY, nuevoReg);
    if (data && data.id) {
      showSwallSuccess(HTTP_MSG_ALTA);
      return data;
    } else {
      showErrorBackEnd(HTTP_MSG_ALTA_ERROR, data);
      return {};
    }
  } catch (error) {
    console.log("error:");
    console.log(error);
    console.log(
      `crearFeriado() - ERROR 1 - nuevoReg: ${JSON.stringify(
        nuevoReg
      )} - error: ${JSON.stringify(error)}`
    );
    return {};
  }
};

export const actualizar = async (feriado) => {
  try {
    const response = await axiosCrud.actualizar(URL_ENTITY, feriado);
    if (response == true) {
      showSwallSuccess(HTTP_MSG_MODI);
      return true;
    } else {
      showErrorBackEnd(HTTP_MSG_MODI_ERROR, response);
      return false;
    }
  } catch (error) {
    console.log(
      `actualizarFeriado() - ERROR 1 - error: ${JSON.stringify(error)}`
    );
    return false;
  }
};

export const eliminar = async (id) => {
  try {
    const response = await axiosCrud.eliminar(URL_ENTITY, id);

    if (response == true) {
      showSwallSuccess(HTTP_MSG_BAJA);
      return true;
    } else {
      showErrorBackEnd(HTTP_MSG_BAJA_ERROR, response);
      return false;
    }
  } catch (error) {
    console.log(
      `eliminarFeriado() - ERROR 1 - error: ${JSON.stringify(error)}`
    );
    return false;
  }
};
