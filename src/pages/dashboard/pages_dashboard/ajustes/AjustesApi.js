import { axiosCrud } from '@components/axios/axiosCrud'
import { showErrorBackEnd } from "@/components/axios/showErrorBackEnd";
import formatter from '@/common/formatter';
import swal from "@/components/swal/swal";
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

    actualizar: async function (id, oEntidad) {
      return editAjuste(id, oEntidad);
    },

    eliminar: async function (UrlApi, id) {
        return eliminar(UrlApi, id);
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
        swal.showSuccess(HTTP_MSG_ALTA);
        return response
    }catch (error){
        showErrorBackEnd(HTTP_MSG_ALTA_ERROR, error);
    }
}

export const editAjuste = async (id, body) => {
    const URL = `${BACKEND_URL}/sigeco/ajustes/${ id }`;
    try {
        const response = await axiosCrud.actualizar(URL, body)
        swal.showSuccess(HTTP_MSG_MODI);
        return response
    }catch (error){
        showErrorBackEnd(HTTP_MSG_MODI_ERROR, error);
    }
}

export const eliminar = async (id) => {
    const URL = `${BACKEND_URL}/sigeco/ajustes`;
    try {
      const response = await axiosCrud.eliminar(URL, id);
      if (response == true) {
        swal.showSuccess(HTTP_MSG_BAJA?HTTP_MSG_BAJA:"El registro se elimino sastisfactoriamente" );
        return true;
      }
      throw response;
    } catch (error) {
      showErrorBackEnd(HTTP_MSG_BAJA_ERROR, error);
      return false;
    }
  };