import axios from 'axios'
import { showErrorBackEnd } from "@/components/axios/showErrorBackEnd";
import { axiosCrud } from "@components/axios/axiosCrud";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;

export const generarBoletaSinDDJJ = async (empresa_id, body) => {
    console.log(body)
    //const URL = `${BACKEND_URL}/empresa/${empresa_id}/guardar-boleta-sin-ddjj`
    //return axios.post(URL, { ...body })
}

export const tieneRectificativa = async(empresa_id, periodo) => {
    try{
        const URL =  `${BACKEND_URL}/empresa/${empresa_id}/periodo/${periodo}/tiene-rectificativa` 
        const TIENE_RECTIFICATIVA = await  axiosCrud.consultar(URL)
        return TIENE_RECTIFICATIVA
    } catch (error) {
        const HTTP_MSG = HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`
        showErrorBackEnd(HTTP_MSG,error);
    }
}


export const downloadPdfDetalle = async () => {
    const URL = `${BACKEND_URL}/empresa/123/ddjj/123/boleta-pago/concepto/uoma/imprimir-detalle`;
    
    try {
      const response = await axios({
        url: URL,
        method: 'GET',
        responseType: 'blob'
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
}

export const downloadPdfBoleta = async () => {
  const URL = `${BACKEND_URL}/empresa/123/ddjj/123/boleta-pago/concepto/uoma/imprimir-boleta`;
  
  try {
    const response = await axios({
      url: URL,
      method: 'GET',
      responseType: 'blob'
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
}


export const downloadPdfBoletaBlanca = async (empresa_id) => {  
  const URL = `${BACKEND_URL}/empresa/${empresa_id}/generar-sin-ddjj`
  try{
    const response = axiosCrud.consultar(URL)
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'boleta.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();

    if (response) {
      window.location.href = "/dashboard/boletas";
    } else {
        console.error("Error al generar boletas");
    }
  }
  catch (error){
    const HTTP_MSG = HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`
    showErrorBackEnd(HTTP_MSG,error);
  }
}

export const axiosOtrosPagos = {
    generarBoletaSinDDJJ,
    tieneRectificativa,
    downloadPdfDetalle,
    downloadPdfBoleta
}