import { axiosCrud } from '@components/axios/axiosCrud';
import oAxios from '@components/axios/axiosInstace';
import { showErrorBackEnd } from '@/components/axios/showErrorBackEnd';
import swal from '@/components/swal/swal';

const HTTP_MSG_ALTA = import.meta.env.VITE_HTTP_MSG_ALTA;
const HTTP_MSG_MODI = import.meta.env.VITE_HTTP_MSG_MODI;
const HTTP_MSG_BAJA = import.meta.env.VITE_HTTP_MSG_BAJA;
const HTTP_MSG_ALTA_ERROR = import.meta.env.VITE_HTTP_MSG_ALTA_ERROR;
const HTTP_MSG_MODI_ERROR = import.meta.env.VITE_HTTP_MSG_MODI_ERROR;
const HTTP_MSG_BAJA_ERROR = import.meta.env.VITE_HTTP_MSG_BAJA_ERROR;
const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;

const URL_ENTITY = '/usuario/interno';

export const consultar = async () => {
  try {
    const data = await axiosCrud.consultar(URL_ENTITY);
    return data || [];
  } catch (error) {
    console.log(
      'consultar() - catch-error - URL: ' +
        URL_ENTITY +
        ' - status: ' +
        error.status,
    );
    showErrorBackEnd(
      HTTP_MSG_CONSUL_ERROR + ` (${URL_ENTITY} - status: ${error.status})`,
      error,
    );
    return [];
  }
};

export const crear = async (registro) => {
  try {
    const data = await axiosCrud.crear(URL_ENTITY, registro);
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

export const actualizar = async (registro) => {
  try {
    const response = await axiosCrud.actualizar(URL_ENTITY, registro);
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

export const eliminar = async (id) => {
  try {
    const response = await axiosCrud.eliminar(URL_ENTITY, id);
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
      swal.showSuccess(HTTP_MSG_MODI);
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
