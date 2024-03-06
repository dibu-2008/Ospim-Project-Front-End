import { axiosCrud } from "@components/axios/axiosCrud";
import { showErrorBackEnd } from "@/components/axios/showErrorBackEnd";
import swal from "@components/swal/swal";

const HTTP_MSG_ALTA = import.meta.env.VITE_HTTP_MSG_ALTA;
const HTTP_MSG_MODI = import.meta.env.VITE_HTTP_MSG_MODI;
const HTTP_MSG_BAJA = import.meta.env.VITE_HTTP_MSG_BAJA;
const HTTP_MSG_ALTA_ERROR = import.meta.env.VITE_HTTP_MSG_ALTA_ERROR;
const HTTP_MSG_MODI_ERROR = import.meta.env.VITE_HTTP_MSG_MODI_ERROR;
const HTTP_MSG_BAJA_ERROR = import.meta.env.VITE_HTTP_MSG_BAJA_ERROR;
const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;

export const obtenerTipoDomicilio = async () => {
  const URL = "/empresa/domicilio/tipo";
  try {
    const data = await axiosCrud.consultar(URL);
    return data || [];
  } catch (error) {
    showErrorBackEnd(HTTP_MSG_CONSUL_ERROR, error);
    return [];
  }
};

export const obtenerProvincias = async () => {
  const URL = "/provincia";
  try {
    const data = await axiosCrud.consultar(URL);
    return data || [];
  } catch (error) {
    showErrorBackEnd(HTTP_MSG_CONSUL_ERROR, error);
    return [];
  }
};

export const obtenerLocalidades = async (idProvincia) => {
  const URL = `/provincia/${idProvincia}/localidad`;
  try {
    const data = await axiosCrud.consultar(URL);
    return data || [];
  } catch (error) {
    showErrorBackEnd(HTTP_MSG_CONSUL_ERROR, error);
    return [];
  }
};

export const obtenerDomicilios = async (empresaId) => {
  const URL = `/empresa/${empresaId}/domicilio`;
  try {
    const data = await axiosCrud.consultar(URL);
    return data || [];
  } catch (error) {
    showErrorBackEnd(HTTP_MSG_CONSUL_ERROR, error);
    return [];
  }
};

export const crearDomicilio = async (empresaId, domicilio) => {
  const URL = `/empresa/${empresaId}/domicilio`;
  try {
    const data = await axiosCrud.crear(URL, domicilio);
    if (data && data.id) {
      swal.showSuccess(HTTP_MSG_ALTA);
      return data;
    }
    throw data;
  } catch (error) {
    showErrorBackEnd(HTTP_MSG_ALTA_ERROR, error);
    return {};
  }
};

export const actualizarDomicilio = async (empresaId, domicilio) => {
  const URL = `/empresa/${empresaId}/domicilio/${domicilio.id}`;
  try {
    const response = await axiosCrud.actualizar(URL, domicilio);
    if (response == true) {
      swal.showSuccess(HTTP_MSG_MODI);
      return true;
    }
    throw response;
  } catch (error) {
    showErrorBackEnd(HTTP_MSG_MODI_ERROR, error);
    return false;
  }
};

export const eliminarDomicilio = async (empresaId, idDomicilio) => {
  const URL = `/empresa/${empresaId}/domicilio`;
  try {
    const response = await axiosCrud.eliminar(URL, idDomicilio);
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
