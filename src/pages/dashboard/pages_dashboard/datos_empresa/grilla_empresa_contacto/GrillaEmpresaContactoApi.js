import oAxios from "@components/axios/axiosInstace";
import { showErrorBackEnd } from "@/components/axios/showErrorBackEnd";
import Swal from "sweetalert2";

const HTTP_MSG_ALTA = import.meta.env.VITE_HTTP_MSG_ALTA;
const HTTP_MSG_MODI = import.meta.env.VITE_HTTP_MSG_MODI;
const HTTP_MSG_BAJA = import.meta.env.VITE_HTTP_MSG_BAJA;
const HTTP_MSG_ALTA_ERROR = import.meta.env.VITE_HTTP_MSG_ALTA_ERROR;
const HTTP_MSG_MODI_ERROR = import.meta.env.VITE_HTTP_MSG_MODI_ERROR;
const HTTP_MSG_BAJA_ERROR = import.meta.env.VITE_HTTP_MSG_BAJA_ERROR;
const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;

const showSwallSuccess = (MESSAGE_HTTP) => {
  Swal.fire({
    icon: "success",
    title: MESSAGE_HTTP,
    showConfirmButton: false,
    timer: 2000,
  });
};

export const obtenerTipo = async () => {
  const URL = "/empresa/contacto/tipo";
  try {
    const response = await oAxios.get(URL);
    const data = await response.data;
    return data || [];
  } catch (error) {
    console.log(
      "obtenerTipo() - ERROR-catch - error: " + JSON.stringify(error)
    );
    showErrorBackEnd(HTTP_MSG_CONSUL_ERROR, error);
  }
};

export const obtenerDatosEmpresa = async (id) => {
  const URL = `/empresa/${id}/contacto`;
  try {
    const response = await oAxios.get(URL);
    const data = await response.data;
    return data || [];
  } catch (error) {
    console.log(
      "obtenerDatosEmpresa() - ERROR-catch: " + JSON.stringify(error)
    );
    showErrorBackEnd(HTTP_MSG_CONSUL_ERROR, error);
  }
};

export const crearContacto = async (idEmpresa, contacto) => {
  const URL = `/empresa/${idEmpresa}/contacto`;
  try {
    const response = await oAxios.post(URL, contacto);
    if (response.status === 201 || response.status === 200) {
      const data = response.data;
      if (data && data.id) {
        showSwallSuccess(HTTP_MSG_ALTA);
        return data;
      } else {
        showErrorBackEnd(HTTP_MSG_ALTA_ERROR, data);
        return {};
      }
    } else {
      showErrorBackEnd(HTTP_MSG_ALTA_ERROR, response.data);
      return {};
    }
  } catch (error) {
    console.log("crearContacto() - ERROR-catch: " + JSON.stringify(error));
    showErrorBackEnd(HTTP_MSG_ALTA_ERROR, error);
    return {};
  }
};

export const actualizarContacto = async (idEmpresa, contacto) => {
  const URL = `/empresa/${idEmpresa}/contacto/${contacto.id}`;
  try {
    const response = await oAxios.put(URL, contacto);
    if (response.status === 204 || response.status === 200) {
      showSwallSuccess(HTTP_MSG_MODI);
      return true;
    } else {
      console.log(
        `actualizarContacto() - ERROR-UrlApi: ${URL} - response: ${response}`
      );
      return false;
    }
  } catch (error) {
    console.log("actualizarContacto() - ERROR-catch: " + JSON.stringify(error));
    showErrorBackEnd(HTTP_MSG_MODI_ERROR, error);
    return false;
  }
};

export const eliminarContacto = async (idEmpresa, idContacto) => {
  const URL = `/empresa/${idEmpresa}/contacto/${idContacto}`;
  try {
    const response = await oAxios.delete(URL);
    if (response.status === 200 || response.status === 204) {
      showSwallSuccess(HTTP_MSG_BAJA);
      return true;
    } else {
      console.log(
        `eliminarContacto() - ERROR 2 - URL: ${URL} - response.status !== 204 - response: ${JSON.stringify(
          response
        )} `
      );
      showErrorBackEnd(HTTP_MSG_BAJA_ERROR, response);
      return false;
    }
  } catch (error) {
    console.log("eliminarContacto() - ERROR-catch: " + JSON.stringify(error));
    showErrorBackEnd(HTTP_MSG_BAJA_ERROR, error);
    return false;
  }
};

export const axiosContacto = {
  obtenerTipo: async function () {
    return obtenerTipo();
  },

  obtenerDatosEmpresa: async function (idEmpresa) {
    return obtenerDatosEmpresa(idEmpresa);
  },

  crear: async function (idEmpresa, contacto) {
    return crearContacto(idEmpresa, contacto);
  },

  actualizar: async function (idEmpresa, contacto) {
    return actualizarContacto(idEmpresa, contacto);
  },

  eliminar: async function (idEmpresa, idContacto) {
    return eliminarContacto(idEmpresa, idContacto);
  },
};
