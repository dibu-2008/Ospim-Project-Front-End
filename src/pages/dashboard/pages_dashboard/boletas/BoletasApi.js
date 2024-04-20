import axios from 'axios';
import { axiosCrud } from '@/components/axios/axiosCrud';
import { showErrorBackEnd } from '@/components/axios/showErrorBackEnd';
import formatter from '@/common/formatter';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;

export const getBoletasByDDJJid = async (empresa_id, ddjj_id) => {
  const URL = `${BACKEND_URL}/empresa/${empresa_id}/ddjj/${ddjj_id}/boletas`;
  return axios.get(URL);
};

export const getBoletasByEmpresa = async (empresa_id) => {
  const URL = `${BACKEND_URL}/empresa/${empresa_id}/boletas`;
  return axios.get(URL);
};

export const getBoletaById = async (empresa_id, numero_boleta) => {
  const URL = `${BACKEND_URL}/empresa/${empresa_id}/numero-boleta/${numero_boleta}`;
  return await axios.get(URL);
};

export const downloadPdfDetalle = async (empresa_id, ddjj_id, concepto) => {
  const URL = `${BACKEND_URL}/empresa/${empresa_id}/ddjj/${ddjj_id}/boleta-pago/concepto/${concepto}/imprimir-detalle`;

  try {
    const response = await axios({
      url: URL,
      method: 'GET',
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'detalle_boleta.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Error al descargar el archivo PDF:', error);
  }
};

export const downloadPdfBoleta = async (empresa_id, ddjj_id, concepto) => {
  const URL = `${BACKEND_URL}/empresa/${empresa_id}/ddjj/${ddjj_id}/boleta-pago/concepto/${concepto}/imprimir-boleta`;
  try {
    const response = await axios({
      url: URL,
      method: 'GET',
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'boleta.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Error al descargar el archivo PDF:', error);
  }
};

export const modificarBoletaById = async (empresa_id, numero_boleta, body) => {
  const URL = `${BACKEND_URL}/empresa/${empresa_id}/numero-boleta/${numero_boleta}/modificar`;
  try {
    console.log(body);
    body.intencion_de_pago = formatter.toFechaValida(body.intencion_de_pago);
    body.periodo = formatter.toFechaValida(body.intencion_de_pago);
    console.log(body);
    // const reponse = await axiosCrud.crear(URL,body)
    // return reponse
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
  downloadPdfDetalle,
  modificarBoletaById,
};
