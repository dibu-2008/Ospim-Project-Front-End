import oAxios from '@components/axios/axiosInstace';
import { axiosCrud } from '@/components/axios/axiosCrud';
import { showErrorBackEnd } from '@/components/axios/showErrorBackEnd';
import { boletaPdfDownload } from '@/common/api/BoletaCommonApi';
import formatter from '@/common/formatter';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;

export const getBoletasByDDJJid = async (empresa_id, ddjj_id) => {
  const URL = `/empresa/${empresa_id}/ddjj/${ddjj_id}/boletas`;
  return axios.get(URL);
};

export const getBoletasByEmpresa = async (empresa_id) => {
  const URL = `/empresa/${empresa_id}/boletas`;
  return oAxios.get(URL);
};

export const getBoletaById = async (empresa_id, numero_boleta) => {
  const URL = `/empresa/${empresa_id}/numero-boleta/${numero_boleta}`;
  return await oAxios.get(URL);
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
  boletaPdfDownload,  
};
