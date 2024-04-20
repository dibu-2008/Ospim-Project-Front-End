import { axiosCrud } from '@components/axios/axiosCrud';
import { showErrorBackEnd } from '@/components/axios/showErrorBackEnd';
import swal from '@/components/swal/swal';

const HTTP_MSG_ALTA = import.meta.env.VITE_HTTP_MSG_ALTA;
const HTTP_MSG_MODI = import.meta.env.VITE_HTTP_MSG_MODI;
const HTTP_MSG_BAJA = import.meta.env.VITE_HTTP_MSG_BAJA;
const HTTP_MSG_ALTA_ERROR = import.meta.env.VITE_HTTP_MSG_ALTA_ERROR;
const HTTP_MSG_MODI_ERROR = import.meta.env.VITE_HTTP_MSG_MODI_ERROR;
const HTTP_MSG_BAJA_ERROR = import.meta.env.VITE_HTTP_MSG_BAJA_ERROR;
const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;

export const obtenerTipoDomicilio = async () => {
  const URL = '/empresa/public/domicilio/tipo';
  try {
    const data = await axiosCrud.consultar(URL);
    return data || [];
  } catch (error) {
    showErrorBackEnd(
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`,
      error,
    );
    return [];
  }
};

export const obtenerProvincias = async () => {
  const URL = '/public/provincia';
  try {
    const data = await axiosCrud.consultar(URL);
    return data || [];
  } catch (error) {
    showErrorBackEnd(
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`,
      error,
    );
    return [];
  }
};

export const obtenerLocalidades = async (idProvincia) => {
  if (idProvincia == null) {
    return [];
  }
  const URL = `/public/provincia/${idProvincia}/localidad`;
  try {
    const data = await axiosCrud.consultar(URL);
    return data || [];
  } catch (error) {
    showErrorBackEnd(
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`,
      error,
    );
    return [];
  }
};

export const axiosDomicilios = {
  getTipoDomicilio: async function () {
    return obtenerTipoDomicilio();
  },

  getProvincias: async function () {
    return obtenerProvincias();
  },

  getLocalidades: async function (provinciaId) {
    return obtenerLocalidades(provinciaId);
  },
};
