import oAxios from "@components/axios/axiosInstace";
import { showErrorBackEnd } from "@/components/axios/showErrorBackEnd";
import Swal from "sweetalert2";

const HTTP_MSG_ALTA = import.meta.env.VITE_HTTP_MSG_ALTA;
const HTTP_MSG_MODI = import.meta.env.VITE_HTTP_MSG_MODI;
const HTTP_MSG_BAJA = import.meta.env.VITE_HTTP_MSG_BAJA;
const HTTP_MSG_ALTA_ERROR = import.meta.env.VITE_HTTP_MSG_ALTA_ERROR;
const HTTP_MSG_MODI_ERROR = import.meta.env.VITE_HTTP_MSG_MODI_ERROR;
const HTTP_MSG_BAJA_ERROR = import.meta.env.VITE_HTTP_MSG_BAJA_ERROR;

const showSwallSuccess = (MESSAGE_HTTP) => {
  Swal.fire({
    icon: "success",
    title: MESSAGE_HTTP,
    showConfirmButton: false,
    timer: 2000,
  });
};

export const obtenerTipoDomicilio = async () => {
  const URL = "/empresa/domicilio/tipo";
  try {
    const response = await oAxios.get(URL);
    const tipoDomicilio = await response.data;
    return tipoDomicilio || [];
  } catch (error) {
    showErrorBackEnd(error);
  }
};

export const obtenerProvincias = async () => {
  const URL = "/provincia";
  try {
    const response = await oAxios.get(URL);
    const provincias = await response.data;
    return provincias || [];
  } catch (error) {
    showErrorBackEnd(error);
  }
};

export const obtenerLocalidades = async (idProvincia) => {
  const URL = `/provincia/${idProvincia}/localidad`;
  try {
    const response = await oAxios.get(URL);
    const localidades = await response.data;
    return localidades || [];
  } catch (error) {
    showErrorBackEnd(error);
  }
};

export const obtenerDomicilios = async (empresaId) => {
  const URL = `/empresa/${empresaId}/domicilio`;
  try {
    const response = await oAxios.get(URL);
    const data = await response.data;
    return data || [];
  } catch (error) {
    showErrorBackEnd(error);
  }
};

export const crearDomicilio = async (empresaId, domicilio) => {
  const URL = `/empresa/${empresaId}/domicilio`;
  try {
    const response = await oAxios.post(URL, domicilio);
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
    console.log("crearDomicilio() - ERROR-Catch:" + JSON.stringify(error));
    showErrorBackEnd(HTTP_MSG_ALTA_ERROR, error);
    return {};
  }
};

export const actualizarDomicilio = async (empresaId, domicilio) => {
  const URL = `/empresa/${empresaId}/domicilio/${domicilio.id}`;
  try {
    const response = await oAxios.put(URL, domicilio);
    if (response.status === 204 || response.status === 200) {
      showSwallSuccess(HTTP_MSG_MODI);
      return true;
    } else {
      console.log(
        `actualizarDomicilio() - ERROR-UrlApi: ${URL} - response: ${response}`
      );
      return false;
    }
  } catch (error) {
    console.log("actualizarContacto() - ERROR-catch: " + JSON.stringify(error));
    showErrorBackEnd(HTTP_MSG_MODI_ERROR, error);
    return false;
  }
};

export const eliminarDomicilio = async (empresaId, idDomicilio) => {
  const URL = `/empresa/${empresaId}/domicilio/${idDomicilio}`;
  try {
    const response = await oAxios.delete(URL);
    if (response.status === 200 || response.status === 204) {
      showSwallSuccess(HTTP_MSG_BAJA);
      return true;
    } else {
      console.log(
        `eliminarDomicilio() - ERROR-URL: ${URL} - response.status !== 204 - response: ${JSON.stringify(
          response
        )} `
      );
      showErrorBackEnd(HTTP_MSG_BAJA_ERROR, response);
      return false;
    }
  } catch (error) {
    console.log("eliminarDomicilio() - ERROR-catch: " + JSON.stringify(error));
    showErrorBackEnd(HTTP_MSG_BAJA_ERROR, error);
    return false;
  }
};

export const axiosDomicilio = {
  obtenerTipo: async function () {
    return obtenerTipoDomicilio();
  },

  obtenerProvincias: async function () {
    return obtenerProvincias();
  },

  obtenerLocalidades: async function (provinciaId) {
    return obtenerLocalidades(provinciaId);
  },

  obtenerDomicilios: async function (empresaId) {
    return obtenerDomicilios(empresaId);
  },

  crear: async function (idEmpresa, registro) {
    return crearDomicilio(idEmpresa, registro);
  },

  actualizar: async function (idEmpresa, registro) {
    return actualizarDomicilio(idEmpresa, registro);
  },

  eliminar: async function (idEmpresa, idContacto) {
    return eliminarDomicilio(idEmpresa, idContacto);
  },
};
