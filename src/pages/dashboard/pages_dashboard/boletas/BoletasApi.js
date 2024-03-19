//import { errorBackendResponse } from '../../../../../errors/errorBackendResponse';
import axios from 'axios'
import { axiosCrud } from '@/components/axios/axiosCrud';
import { showErrorBackEnd } from "@/components/axios/showErrorBackEnd";
//import Swal from 'sweetalert2'
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;
//const MESSAGE_HTTP_CREATED = import.meta.env.VITE_MESSAGE_HTTP_CREATED;
//const MESSAGE_HTTP_UPDATED = import.meta.env.VITE_MESSAGE_HTTP_UPDATED;
//const MESSAGE_HTTP_DELETED = import.meta.env.VITE_MESSAGE_HTTP_DELETED;


export const getBoletasByDDJJid = async (empresa_id, ddjj_id ) => {   
    const URL = `${BACKEND_URL}/empresa/${ empresa_id }/ddjj/${ ddjj_id }/boletas`;
    return axios.get(URL)
}

export const getBoletasByEmpresa = async(empresa_id) => {
    const URL = `${BACKEND_URL}/empresa/${ empresa_id }/boletas`;
    return axios.get(URL)
} 

export const getBoletaById = async ( empresa_id, numero_boleta ) => {

  const URL = `${BACKEND_URL}/empresa/${ empresa_id }/numero-boleta/${numero_boleta}`
  
  return await axios.get(URL)
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

export const modificarBoletaById = async (empresa_id,numero_boleta,body) => {
  const URL = `${BACKEND_URL}/empresa/${empresa_id}/numero-boleta/${numero_boleta}/modificar`;

  try { 
    const reponse = await axiosCrud.crear(URL,body)
    return reponse
  } catch (error) {
    const HTTP_MSG = HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`
    showErrorBackEnd(HTTP_MSG,error);
 }
}


export const axiosBoletas = {
  getBoletasByDDJJid,
  getBoletasByEmpresa,
  getBoletaById,
  downloadPdfDetalle,
  modificarBoletaById
}