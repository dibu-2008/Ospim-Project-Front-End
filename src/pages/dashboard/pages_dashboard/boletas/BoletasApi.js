//import { errorBackendResponse } from '../../../../../errors/errorBackendResponse';
import axios from 'axios'
//import Swal from 'sweetalert2'
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
//const MESSAGE_HTTP_CREATED = import.meta.env.VITE_MESSAGE_HTTP_CREATED;
//const MESSAGE_HTTP_UPDATED = import.meta.env.VITE_MESSAGE_HTTP_UPDATED;
//const MESSAGE_HTTP_DELETED = import.meta.env.VITE_MESSAGE_HTTP_DELETED;


export const getBoletasByDDJJid = async (empresa_id, ddjj_id ) => {   
    const URL = `${BACKEND_URL}/empresa/${ empresa_id }/ddjj/${ ddjj_id }/boletas`;
    return axios.get(URL)
}

export const getBoletasByEmpresa = async(empresa_id) =>{
    const URL = `${BACKEND_URL}/empresa/${ empresa_id }/boletas`;
    return axios.get(URL)
} 
