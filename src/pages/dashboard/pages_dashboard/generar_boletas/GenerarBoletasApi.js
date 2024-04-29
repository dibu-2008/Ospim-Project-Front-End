import formatter from '@/common/formatter';
import { axiosCrud } from '@/components/axios/axiosCrud';
import oAxios from '@/components/axios/axiosInstace';
import { showErrorBackEnd } from '@/components/axios/showErrorBackEnd';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;

const calcularInteres = async (url, intencion_de_pago) => {
  const body = { intencion_de_pago: intencion_de_pago };
  //const response = await oAxios.get(url, body);
  console.log(body)
  const response = await axiosCrud.crear(url,body)
  return response;
};

export const getBoletasByDDJJid = async (empresa_id, ddjj_id) => {
  const URL = `/empresa/${empresa_id}/ddjj/${ddjj_id}/boletas/armar`;
  try {
    console.log(empresa_id)
    console.log(ddjj_id)
    const data = await axiosCrud.consultar(URL);
    return data;
  } catch (error) {
    const HTTP_MSG =
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`;
    showErrorBackEnd(HTTP_MSG, error);
  }
};

export const calcularInteresBoleta = async (
  empresa_id,
  ddjj_id,
  boleta_codigo,
  intencion_de_pago,
) => {
  const URL = `/empresa/${empresa_id}/ddjj/${ddjj_id}/boletas/${boleta_codigo}/armar`;
  console.log(URL);
  try {
    const response = await calcularInteres(URL, intencion_de_pago);
    console.log(response.detalle_boletas)
    return response.detalle_boletas[0];
  } catch (error) {
    const HTTP_MSG =
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`;
    showErrorBackEnd(HTTP_MSG, error);
  }
};

export const calcularInteresBoletas = async (
  empresa_id,
  ddjj_id,
  intencion_de_pago,
) => {
  //const URL = `/empresa/${empresa_id}/ddjj/${ddjj_id}/calcular-intereses`;
  const URL = `/empresa/${empresa_id}/ddjj/${ddjj_id}/boletas/armar`
  try {
    console.log(intencion_de_pago)
    const response = await calcularInteres(URL, intencion_de_pago);
    console.log(response)
    return response;
  } catch (error) {
    const HTTP_MSG =
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`;
    showErrorBackEnd(HTTP_MSG, error);
  }
};

const ordernarBoletas = (boletas) => {
  const newArray = boletas.detalle_boletas.map((detalle) => ({
    codigo: detalle.codigo,
    intencion_de_pago: formatter.toFechaValida(detalle.intencion_de_pago),
    forma_de_pago: detalle.forma_de_pago,
  }));

  return newArray;
};

export const generarBoletasPost = async (empresa_id, ddjj_id, boletas) => {
  try {
    const URL = `/empresa/${empresa_id}/ddjj/${ddjj_id}/guardar-boletas`;
    const arr_boletas = ordernarBoletas(boletas);

    const response = await axiosCrud.crear(URL, arr_boletas);
    if (response) {
      return response;
    } else {
      console.error('Error al generar boletas');
    }
  } catch (error) {
    const HTTP_MSG =
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`;
    showErrorBackEnd(HTTP_MSG, error);
  }
};

export const axiosGenerarBoletas = {
  getBoletasByDDJJid,
  calcularInteresBoleta,
  calcularInteresBoletas,
  generarBoletasPost,
};
