import { axiosCrud } from "@components/axios/axiosCrud";
import oAxios from "@components/axios/axiosInstace";
import { showErrorBackEnd } from "@/components/axios/showErrorBackEnd";
import Swal from "sweetalert2";

const HTTP_MSG_ALTA = import.meta.env.VITE_HTTP_MSG_ALTA;
const HTTP_MSG_MODI = import.meta.env.VITE_HTTP_MSG_MODI;
const HTTP_MSG_BAJA = import.meta.env.VITE_HTTP_MSG_BAJA;
const HTTP_MSG_ALTA_ERROR = import.meta.env.VITE_HTTP_MSG_ALTA_ERROR;
const HTTP_MSG_MODI_ERROR = import.meta.env.VITE_HTTP_MSG_MODI_ERROR;
const HTTP_MSG_BAJA_ERROR = import.meta.env.VITE_HTTP_MSG_BAJA_ERROR;

const URL_ENTITY = "/usuario/interno";

const showSwallSuccess = (MESSAGE_HTTP) => {
  Swal.fire({
    icon: "success",
    title: MESSAGE_HTTP,
    showConfirmButton: false,
    timer: 2000,
  });
};

export const consultar = async () => {
  try {
    const data = await axiosCrud.consultar(URL_ENTITY);
    return data || [];
  } catch (error) {
    console.log(
      "consultarRoles() - ERROR-catch - error: " + JSON.stringify(data)
    );
    return [];
  }
};

export const crear = async (registro) => {
  try {
    console.log("crearRoles - registro: " + JSON.stringify(registro));
    const data = await axiosCrud.crear(URL_ENTITY, registro);
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
      `crearRoles() - ERROR 1 - nuevoReg: ${JSON.stringify(
        registro
      )} - error: ${JSON.stringify(error)}`
    );
    return {};
  }
};

export const actualizar = async (registro) => {
  try {
    const response = await axiosCrud.actualizar(URL_ENTITY, registro);
    if (response == true) {
      showSwallSuccess(HTTP_MSG_MODI);
      return true;
    } else {
      showErrorBackEnd(HTTP_MSG_MODI_ERROR, response);
      return false;
    }
  } catch (error) {
    console.log(
      `actualizarRoles() - ERROR 1 - error: ${JSON.stringify(error)}`
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

export const habilitar = async (id, habilitar) => {
  let URL;
  if (habilitar) {
    URL = `/usuario/${id}/habilitar`;
  } else {
    URL = `/usuario/${id}/deshabilitar`;
  }

  try {
    const response = await oAxios.patch(URL, habilitar);
    if (response.status === 200 || response.status === 204) {
      showSwallSuccess(HTTP_MSG_MODI);
    } else {
      showErrorBackEnd(HTTP_MSG_MODI_ERROR, response);
    }
  } catch (error) {
    showErrorBackEnd(error);
  }
};

export const axiosUsuariosInternos = {
  consultar: async function (UrlApi) {
    return consultar(UrlApi);
  },

  crear: async function (oEntidad) {
    return crear(oEntidad);
  },

  actualizar: async function (oEntidad) {
    return actualizar(oEntidad);
  },

  eliminar: async function (id) {
    return eliminar(id);
  },

  habilitar: async function (id, habi) {
    return habilitar(id, habi);
  },
};
