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

export const getBoletasByEmpresa = async (empresa_id) => {
  try {
    const URL = `/empresa/${empresa_id}/boletas/consulta-gral`;
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
  const URL = `/empresa/${empresa_id}/boletas`;
  try {
    body.intencion_de_pago = formatter.toFechaValida(body.intencion_de_pago);
    body.periodo = formatter.toFechaValida(body.intencion_de_pago);
    // Descomentar en caso de querer enviar solo los datos que se modifican
    /*
     const bodynuevo ={
     'intencion_de_pago':body.intencion_de_pago,
      'forma_de_pago':body.forma_de_pago}
      await axiosCrud.actualizar(URL, bodynuevo)
      */
    await axiosCrud.actualizar(URL, body);
  } catch (error) {
    const HTTP_MSG =
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`;
    showErrorBackEnd(HTTP_MSG, error);
  }
};

export const axiosBoletas = {
  getBoletasByDDJJid,
  getBoletasByEmpresa,
  getBoletaById,
  modificarBoletaById,
};
