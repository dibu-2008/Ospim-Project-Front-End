import { axiosCrud } from '@/components/axios/axiosCrud';
import oAxios from '@/components/axios/axiosInstace';
import { showErrorBackEnd } from "@/components/axios/showErrorBackEnd";
import { SignalWifiConnectedNoInternet4TwoTone } from '@mui/icons-material';
import axios from 'axios'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;

const calcularInteres = async (url, intencion_de_pago) => {
    const body = {"intencion_de_pago": intencion_de_pago}
    const response = await oAxios.post(url, body) 
    return response

}

export const getBoletasByDDJJid = async (empresa_id, ddjj_id ) => {   
    const URL = `${BACKEND_URL}/empresa/${ empresa_id }/ddjj/${ ddjj_id }/boletas`;
    try{
        const  data = await axiosCrud.consultar(URL)
        return data
    } catch (error){
        const HTTP_MSG = HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`
        showErrorBackEnd(HTTP_MSG,error);
    }
}

export const calcularInteresBoleta = async(empresa_id, ddjj_id, boleta_codigo, intencion_de_pago) => {
    const URL = `${BACKEND_URL}/empresa/${ empresa_id }/ddjj/${ ddjj_id }/boleta/${boleta_codigo}/calcular-interes`;
    try{
        const response = await calcularInteres(URL, intencion_de_pago)
        return response
    } catch (error) {
        const HTTP_MSG = HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`
        showErrorBackEnd(HTTP_MSG,error);        
    }
}


export const calcularInteresBoletas = async(empresa_id, ddjj_id, intencion_de_pago) => {
    const URL = `${BACKEND_URL}/empresa/${ empresa_id }/ddjj/${ ddjj_id }/calcular-intereses`;
    try{
        const response = await calcularInteres(URL,intencion_de_pago)
        return response
    } catch (error) {
        const HTTP_MSG = HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`
        showErrorBackEnd(HTTP_MSG,error);          
    }
}


const ordernarBoletas = (boletas) => {
    const newArray = boletas.detalle_boletas.map(detalle => ({
        ...detalle,
        declaracion_jurada_id: boletas.declaracion_jurada_id,
        periodo: boletas.periodo,
        tipo_ddjj: boletas.tipo_ddjj
    }));
    return newArray;
}

export const generarBoletasPost = async (empresa_id, ddjj_id,boletas)=>{
    try{
        const URL =`${BACKEND_URL}/empresa/${ empresa_id }/ddjj/${ ddjj_id }/guardar-boletas`;
        const arr_boletas = ordernarBoletas(boletas)
        
        const response = await axiosCrud.crear(URL, arr_boletas)
        //console.log(arr_boletas)
        if (response) {
            window.location.href = "/dashboard/boletas";
        } else {
            console.error("Error al generar boletas");
        }
    } catch (error) {
        const HTTP_MSG = HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`
        showErrorBackEnd(HTTP_MSG,error);          
    }    
}
    
export const axiosGenerarBoletas = {
    getBoletasByDDJJid,
    calcularInteresBoleta,
    calcularInteresBoletas,
    generarBoletasPost
}

