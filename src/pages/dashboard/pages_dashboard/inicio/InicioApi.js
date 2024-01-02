import { errorBackendResponse } from "../../../../errors/errorBackendResponse";
import axios from 'axios'
import Swal from 'sweetalert2'
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const ObtenerDatosDeContacto = async (token) => {

    const URL = `${BACKEND_URL}/ospim/contacto`;

    const showSwalError = (descripcion) => {

        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: descripcion,
            showConfirmButton: false,
            timer: 3000,
        })

    }

    try {

        const contactoResponse = await axios.get(URL, {
            headers: {
                'Authorization': token
            }
        });

        const contacto = await contactoResponse.data;

        return contacto || [];

    } catch (error) {

        errorBackendResponse(error, showSwalError);

    }

}


export const ObtenerPublicacionesVigentes = async (token, ruta) => {
    
        const URL = `${BACKEND_URL}${ruta}`;
    
        const showSwalError = (descripcion) => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: descripcion,
                showConfirmButton: false,
                timer: 3000,
            })
        }
    
        try {
            
            const novedadesResponse = await axios.get(URL, {
                headers: {
                    'Authorization': token
                }
            });
            const novedades = await novedadesResponse.data;
    
            return novedades || [];
    
        } catch (error) {
    
            errorBackendResponse(error, showSwalError);
    
        }  
} 
