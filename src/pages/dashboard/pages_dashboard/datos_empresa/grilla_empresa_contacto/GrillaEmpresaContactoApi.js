const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import axios from "axios";
import Swal from "sweetalert2";
import { errorBackendResponse } from "../../../../../errors/errorBackendResponse";


export const obtenerTipo = async (token) => {

    const URL = `${BACKEND_URL}/empresa/contacto/tipo`;

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

        const tipoContactoResponse = await axios.get(URL, {
            headers: {
                'Authorization': token
            }
        });
        const tipoContacto = await tipoContactoResponse.data;

        return tipoContacto || [];

    } catch (error) {

        errorBackendResponse(error, showSwalError);

    }
}

export const obtenerDatosEmpresa = async (token) => {

    const URL = `${BACKEND_URL}/empresa/:empresaId/contacto`;

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

        const empresaResponse = await axios.get(URL, {
            headers: {
                'Authorization': token
            }
        });
        const empresa = await empresaResponse.data;

        return empresa || [];

    } catch (error) {

        errorBackendResponse(error, showSwalError);

    }
}

export const crearFilaContacto = async (token, filaContacto) => {

    const URL = `${BACKEND_URL}/empresa/:empresaId/contacto`;

    const showSwalError = (descripcion) => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: descripcion,
            showConfirmButton: false,
            timer: 2000,
        })
    }

    const showSwallSuccess = () => {
        Swal.fire({
            icon: 'success',
            title: 'Contacto creado',
            showConfirmButton: false,
            timer: 2000,
        })
    }

    try {

        const contactoResponse = await axios.post(URL, filaContacto, {
            headers: {
                'Authorization': token
            }
        });
        
        if(contactoResponse.status === 201) {
            showSwallSuccess();
        }

    } catch (error) {

        errorBackendResponse(error, showSwalError);

    }

}

export const modificarFilaContacto = async (token, filaId, filaContacto) => {

    const URL = `${BACKEND_URL}/empresa/:empresaId/contacto/${filaId}`;

    const showSwalError = (descripcion) => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: descripcion,
            showConfirmButton: false,
            timer: 2000,
        })
    }

    const showSwallSuccess = () => {
        Swal.fire({
            icon: 'success',
            title: 'Contacto modificado',
            showConfirmButton: false,
            timer: 2000,
        })
    }

    try {

        const contactoResponse = await axios.put(URL, filaContacto, {
            headers: {
                'Authorization': token
            }
        });

        console.log(contactoResponse);
        
        if(contactoResponse.status === 200) {
            showSwallSuccess();
        }

    } catch (error) {

        errorBackendResponse(error, showSwalError);

    }

}

export const eliminarFilaContacto = async (token, filaId) => {

    const URL = `${BACKEND_URL}/empresa/:empresaId/contacto/${filaId}`;

    const showSwalError = (descripcion) => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: descripcion,
            showConfirmButton: false,
            timer: 3000,
        })
    }

    const showSwallSuccess = () => {
        Swal.fire({
            icon: 'success',
            title: 'Contacto eliminado',
            showConfirmButton: false,
            timer: 2000,
        })
    }

    try {

        const contactoResponse = await axios.delete(URL, {
            headers: {
                'Authorization': token
            }
        });
        
        if(contactoResponse.status === 200) {
            showSwallSuccess();
        }

    } catch (error) {

        errorBackendResponse(error, showSwalError);

    }
}