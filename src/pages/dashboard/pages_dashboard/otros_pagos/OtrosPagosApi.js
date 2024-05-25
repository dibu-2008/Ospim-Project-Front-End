import axios from 'axios';
import oAxios from '@components/axios/axiosInstace';
import { axiosCrud } from '@components/axios/axiosCrud';
import swal from '@/components/swal/swal';
import { showErrorBackEnd } from '@/components/axios/showErrorBackEnd';
import { boletaPdfDownload } from '@/common/api/BoletaCommonApi';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;
const HTTP_MSG_ALTA = import.meta.env.VITE_HTTP_MSG_ALTA;
const HTTP_MSG_ALTA_ERROR = import.meta.env.VITE_HTTP_MSG_ALTA_ERROR;

export const crearBoleta = async (empresa_id, nuevoReg) => {
  try {
    const URL = `/empresa/${empresa_id}/boletas/sin-ddjj/`;

    const data = await axiosCrud.crear(URL, nuevoReg);
    if (data && data.id) {
      swal.showSuccess(HTTP_MSG_ALTA);
      return data;
    } else {
      showErrorBackEnd(HTTP_MSG_ALTA_ERROR, data);
      return {};
    }
  } catch (error) {
    console.log(
      `crearCuitRestringido() - ERROR 1 - nuevoReg: ${JSON.stringify(
        nuevoReg,
      )} - error: ${JSON.stringify(error)}`,
    );
    console.log('crearCuitRestringido - ERROR - return {}   ');
    return {};
  }
};

export const generarBoletaSinDDJJ = async (empresa_id, body) => {
  try {
    console.log(body);
    //cambiar la coma por el punto en importe
    body.importe = parseFloat(body.importe.replace(',', '.'));
    console.log(body);

    const data = await crearBoleta(empresa_id, body);

    boletaPdfDownload(empresa_id, data.id);
    return data;
    /*
    const URL = `${BACKEND_URL}/empresa/${empresa_id}/boletas/${data.id}/imprimir`;

    const response = await oAxios.request({
      url: URL,
      method: 'post',
      responseType: 'blob',
      data: body,
    });
    //const response = await axiosCrud.crear(URL, { ...body });
    console.log('generarBoletaSinDDJJ - response: ', response);

    if (response) {
      //Ojo que response.data => NO EXISTE
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'boleta.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } else {
      console.error('Error al generar boletas');
    }
    */
  } catch (error) {
    console.log('generarBoletaSinDDJJ - error: ', error);

    const HTTP_MSG =
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`;
    showErrorBackEnd(HTTP_MSG, error);
  }
};

export const tieneRectificativa = async (empresa_id, periodo) => {
  try {
    const URL = `${BACKEND_URL}/empresa/${empresa_id}/periodo/${periodo}/tiene-rectificativa`;
    const TIENE_RECTIFICATIVA = await axiosCrud.consultar(URL);
    return TIENE_RECTIFICATIVA;
  } catch (error) {
    const HTTP_MSG =
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`;
    showErrorBackEnd(HTTP_MSG, error);
  }
};

export const downloadPdfDetalle = async () => {
  const URL = `${BACKEND_URL}/empresa/123/ddjj/123/boleta-pago/concepto/uoma/imprimir-detalle`;
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

export const downloadPdfBoletaSinDDJJ = async () => {
  const URL = `${BACKEND_URL}/empresa/123/ddjj/123/boleta-pago/concepto/uoma/imprimir-boleta`;

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

export const axiosOtrosPagos = {
  generarBoletaSinDDJJ,
  tieneRectificativa,
  downloadPdfDetalle,
};
