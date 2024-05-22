import oAxios from '@components/axios/axiosInstace';
import { axiosCrud } from '@/components/axios/axiosCrud';
import { showErrorBackEnd } from '@/components/axios/showErrorBackEnd';

import formatter from '@/common/formatter';

const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;

export const getBoletasByDDJJid = async (empresa_id, ddjj_id) => {
  try {
    const URL = `/empresa/${empresa_id}/ddjj/${ddjj_id}/boletas/armado`;
    const response = axiosCrud.consultar(URL);
    console.log(response);
    return response;
  } catch (error) {
    const HTTP_MSG =
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`;
    showErrorBackEnd(HTTP_MSG, error);
  }
};

export const getBoletas = async (empresa_id, desde, hasta) => {
  try {
    let queryString = '';

    if (desde !== null) {
      queryString += `&desde=${desde}`;
    }
    if (hasta !== null) {
      queryString += `&hasta=${hasta}`;
    }

    const URL = `/empresa/${empresa_id}/boletas/consulta-gral?${queryString}`;
    const response = axiosCrud.consultar(URL);
    return response;
  } catch (error) {
    const HTTP_MSG =
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`;
    showErrorBackEnd(HTTP_MSG, error);
  }
};

export const getBoletaById = async (empresa_id, boleta_id) => {
  const URL = `/empresa/${empresa_id}/boletas/${boleta_id}`;
  try {
    const response = axiosCrud.consultar(URL);
    return response;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const modificarBoletaById = async (empresa_id, body) => {
  console.log(body);
  const URL = `/empresa/${empresa_id}/boletas`;
  try {
    body.intencionDePago = formatter.toFechaValida(body.intencionDePago);
    body.periodo = formatter.toFechaValida(body.intencionDePago);
    await axiosCrud.actualizar(URL, body);
  } catch (error) {
    const HTTP_MSG =
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`;
    showErrorBackEnd(HTTP_MSG, error);
  }
};

export const axiosBoletas = {
  getBoletasByDDJJid,
  getBoletas,
  getBoletaById,
  modificarBoletaById,
};
