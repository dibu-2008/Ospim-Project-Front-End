import { axiosCrud } from '@components/axios/axiosCrud'
import { showErrorBackEnd } from "@/components/axios/showErrorBackEnd";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;


export const getAjustes = async () =>{
    const URL = `${BACKEND_URL}/sigeco/ajustes`;
    try{
        const response = await axiosCrud.consultar(URL);
        return response;
    } catch (error) {
        const HTTP_MSG = HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`
        showErrorBackEnd(HTTP_MSG,error);
    }
}

export const setAjuste = async ( body ) => {
    const URL = `${BACKEND_URL}/sigeco/ajustes`;
    try {
        const response = await axiosCrud.crear(URL, body)
        return response
    }catch (error){
        const HTTP_MSG = HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`
        showErrorBackEnd(HTTP_MSG,error);
    }
}

export const editAjuste = async (id, body) => {
    const URL = `${BACKEND_URL}/sigeco/ajustes/${ id }`;
    try {
        const response = await axiosCrud.actualizar(URL, body)
        return response
    }catch (error){
        const HTTP_MSG = HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`
        showErrorBackEnd(HTTP_MSG,error);
    }
}