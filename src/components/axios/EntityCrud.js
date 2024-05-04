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

let URL_ENTITY = '/feriados';

export const axiosFeriados = {
  init: function (url) {
    URL_ENTITY = url;
  },

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
      //swal.showSuccess(HTTP_MSG_ALTA);
      toast.info(HTTP_MSG_ALTA, styles);
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
      //swal.showSuccess(HTTP_MSG_MODI);
      toast.info(HTTP_MSG_MODI, styles);
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
      //swal.showSuccess(HTTP_MSG_BAJA);
      toast.info(HTTP_MSG_BAJA, styles);
      return true;
    }
    throw response;
  } catch (error) {
    showErrorBackEnd(HTTP_MSG_BAJA_ERROR, error);
    return false;
  }
};

const styles = {
  position: 'top-right',
  autoClose: 2000,
  style: {
    fontSize: '1rem',
  },
};
