import axios from 'axios'
//import Swal from 'sweetalert2'
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


export const getBoletasByDDJJid = async (empresa_id, ddjj_id ) => {   
    const URL = `${BACKEND_URL}/empresa/${ empresa_id }/ddjj/${ ddjj_id }/boletas`;
    return axios.get(URL)
}

export const calcularInteresBoleta = async(empresa_id, ddjj_id, boleta_codigo, intencion_de_pago) => {
    const URL = `${BACKEND_URL}/empresa/${ empresa_id }/ddjj/${ ddjj_id }/boleta/${boleta_codigo}/calcular-interes`;
    const body = { 
        "intencion_de_pago" : intencion_de_pago
    }
    return axios.post(URL, body)
}


export const calcularInteresBoletas = async(empresa_id, ddjj_id, intencion_de_pago) => {
    const URL = `${BACKEND_URL}/empresa/${ empresa_id }/ddjj/${ ddjj_id }/calcular-intereses`;
    const body = { 
        "intencion_de_pago" : intencion_de_pago
    }
    return axios.post(URL,body)
}

export const generarBoletasPost = async (empresa_id, ddjj_id,boletas)=>{
    
    const URL =`${BACKEND_URL}/empresa/${ empresa_id }/ddjj/${ ddjj_id }/guardar-boletas`;
    return await axios.post(URL,boletas)
        
}
    

