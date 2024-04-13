import { axiosCrud } from '@components/axios/axiosCrud'
import { showErrorBackEnd } from "@/components/axios/showErrorBackEnd";
import formatter from '@/common/formatter';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const HTTP_MSG_ALTA = import.meta.env.VITE_HTTP_MSG_ALTA;
const HTTP_MSG_MODI = import.meta.env.VITE_HTTP_MSG_MODI;
const HTTP_MSG_BAJA = import.meta.env.VITE_HTTP_MSG_BAJA;
const HTTP_MSG_ALTA_ERROR = import.meta.env.VITE_HTTP_MSG_ALTA_ERROR;
const HTTP_MSG_MODI_ERROR = import.meta.env.VITE_HTTP_MSG_MODI_ERROR;
const HTTP_MSG_BAJA_ERROR = import.meta.env.VITE_HTTP_MSG_BAJA_ERROR;
const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;

export const axiosAjustes = {
    consultar: async function () {
      return getAjustes();
    },

    crear: async function (oEntidad) {
      return crearAjuste(oEntidad);
    },

    actualizar: async function (oEntidad) {
      return editAjuste(oEntidad);
    },

  };

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

export const crearAjuste = async ( body ) => {

    body.periodo_original = formatter.toFechaValida(body.periodo_original)
    body.vigencia = formatter.toFechaValida(body.vigencia)

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