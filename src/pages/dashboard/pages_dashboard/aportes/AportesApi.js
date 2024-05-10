import { axiosCrud } from '@components/axios/axiosCrud';
import { showErrorBackEnd } from '@/components/axios/showErrorBackEnd';
import swal from '@/components/swal/swal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HTTP_MSG_ALTA = import.meta.env.VITE_HTTP_MSG_ALTA;
const HTTP_MSG_MODI = import.meta.env.VITE_HTTP_MSG_MODI;
const HTTP_MSG_BAJA = import.meta.env.VITE_HTTP_MSG_BAJA;
const HTTP_MSG_ALTA_ERROR = import.meta.env.VITE_HTTP_MSG_ALTA_ERROR;
const HTTP_MSG_MODI_ERROR = import.meta.env.VITE_HTTP_MSG_MODI_ERROR;
const HTTP_MSG_BAJA_ERROR = import.meta.env.VITE_HTTP_MSG_BAJA_ERROR;
const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;

const URL_ENTITY = '/aportes/calculo';

export const axiosAportes = {
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
  consultarEntidades: async function () {
    return consultaEntidades();
  },
  consultarAportes: async function () {
    return consultaAportes();
  },
  consultarTipo: async function () {
    return consultaTipo();
  },
  consultarBase: async function () {
    return consultaBase();
  },
  consultarCamara: async function () {
    return consultaCamara();
  },
  consultarCategoria: async function (camara) {
    return consultaCategoria(camara);
  },
  consultarAntiguedad: async function (categoria) {
    return consultaAntiguedad(categoria);
  },
};

export const consultar = async () => {
  try {
    const data = await axiosCrud.consultar(URL_ENTITY);
    return data || [];
  } catch (error) {
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
      toast.success(HTTP_MSG_ALTA, styles);
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
      toast.success(HTTP_MSG_MODI, styles);
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
      toast.success(HTTP_MSG_BAJA, styles);
      return true;
    }
    throw response;
  } catch (error) {
    showErrorBackEnd(HTTP_MSG_BAJA_ERROR, error);
    return false;
  }
};

export const consultaEntidades = async () => {
  try {
    const response = await axiosCrud.consultar('/entidad');
    return response;
  } catch (error) {
    showErrorBackEnd(
      'Error al consultar entidades' +
        ` (${URL_ENTITY} - status: ${error.status})`,
      error,
    );
    return [];
  }
};

export const consultaAportes = async () => {
  try {
    const response = await axiosCrud.consultar(`/aportes`);
    return response;
  } catch (error) {
    showErrorBackEnd(
      'Error al consultar aporte' +
        ` (${URL_ENTITY} - status: ${error.status})`,
      error,
    );
    return [];
  }
};

export const consultaTipo = async () => {
  try {
    const response = await axiosCrud.consultar(`${URL_ENTITY}/tipo`);
    return response;
  } catch (error) {
    showErrorBackEnd(
      'Error al consultar tipo' + ` (${URL_ENTITY} - status: ${error.status})`,
      error,
    );
    return [];
  }
};

export const consultaBase = async () => {
  try {
    const response = await axiosCrud.consultar(`${URL_ENTITY}/base`);
    return response;
  } catch (error) {
    showErrorBackEnd(
      'Error al consultar base' + ` (${URL_ENTITY} - status: ${error.status})`,
      error,
    );
    return [];
  }
};

export const consultaCamara = async () => {
  try {
    const response = await axiosCrud.consultar('/camara');
    return response;
  } catch (error) {
    showErrorBackEnd(
      'Error al consultar camara' +
        ` (${URL_ENTITY} - status: ${error.status})`,
      error,
    );
    return [];
  }
};

export const consultaCategoria = async (camara) => {
  try {
    const response = await axiosCrud.consultar(`/categoria/camara/${camara}`);
    return response;
  } catch (error) {
    showErrorBackEnd(
      'Error al consultar categoria' +
        ` (${URL_ENTITY} - status: ${error.status})`,
      error,
    );
    return [];
  }
};

export const consultaAntiguedad = async (categoria) => {
  try {
    const response = await axiosCrud.consultar(
      `/categoria/${categoria}/antiguedad`,
    );
    return response;
  } catch (error) {
    showErrorBackEnd(
      'Error al consultar antiguedad' +
        ` (${URL_ENTITY} - status: ${error.status})`,
      error,
    );
    return [];
  }
};

const styles = {
  position: 'top-right',
  autoClose: 2000,
  style: {
    fontSize: '1rem',
  },
};
