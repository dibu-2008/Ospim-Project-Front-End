const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import axios from 'axios'
import Swal from 'sweetalert2'
import { errorBackendResponse } from '../../../../../errors/errorBackendResponse';

export const obtenerTipoDomicilio = async (token) => {

    const URL = `${BACKEND_URL}/empresa/domicilio/tipo`;

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

        const tipoDomicilioResponse = await axios.get(URL, {
            headers: {
                'Authorization': token
            }
        });
        const tipoDomicilio = await tipoDomicilioResponse.data;

        return tipoDomicilio || [];

    } catch (error) {

        errorBackendResponse(error, showSwalError);

    }
}

export const obtenerProvincias = async (token) => {

    const URL = `${BACKEND_URL}/provincia`;

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

        const provinciasResponse = await axios.get(URL, {
            headers: {
                'Authorization': token
            }
        });
        const provincias = await provinciasResponse.data;

        return provincias || [];

    } catch (error) {

        errorBackendResponse(error, showSwalError);

    }
}

export const obtenerLocalidades = async (token, idProvincia) => {

    const URL = `${BACKEND_URL}/provincia/${idProvincia}/localidad`;

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

        const localidadesResponse = await axios.get(URL, {
            headers: {
                'Authorization': token
            }
        });
        const localidades = await localidadesResponse.data;

        return localidades || [];

    } catch (error) {

        errorBackendResponse(error, showSwalError);

    }
}

export const obtenerFilasDomicilio = async (token) => {

    const URL = `${BACKEND_URL}/empresa/:empresaId/domicilio`;

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

        const filasDomicilioResponse = await axios.get(URL, {
            headers: {
                'Authorization': token
            }
        });
        const filasDomicilio = await filasDomicilioResponse.data;

        return filasDomicilio || [];

    } catch (error) {

        errorBackendResponse(error, showSwalError);

    }
}

export const crearFilaDomicilio = async (token, filaDomicilio) => {

    const URL = `${BACKEND_URL}/empresa/:empresaId/domicilio`;

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
            title: 'Fila creada',
            showConfirmButton: false,
            timer: 2000,
        })
    }

    try {

        const response = await axios.post(URL, filaDomicilio, {
            headers: {
                'Authorization': token
            }
        });

        if (response.status === 200) {

            showSwallSuccess();

        }

    } catch (error) {

        errorBackendResponse(error, showSwalError);

    }

}

export const actualizarFilaDomicilio = async (token, idFilaDomicilio, filaDomicilio) => {

    const URL = `${BACKEND_URL}/empresa/:empresaId/domicilio/${idFilaDomicilio}`;

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
            title: 'Fila actualizada',
            showConfirmButton: false,
            timer: 2000,
        })
    }

    try {
            
            const response = await axios.put(URL, filaDomicilio, {
                headers: {
                    'Authorization': token
                }
            });
    
            if (response.status === 200) {
    
                showSwallSuccess();
    
            }
    
        } catch (error) {

        errorBackendResponse(error, showSwalError);

    }

}


export const eliminarFilaDomicilio = async (token, idFilaDomicilio) => {

    const URL = `${BACKEND_URL}/empresa/:empresaId/domicilio/${idFilaDomicilio}`;

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
            title: 'Fila eliminada',
            showConfirmButton: false,
            timer: 2000,
        })
    }

    try {

        const response = await axios.delete(URL, {
            headers: {
                'Authorization': token
            }
        });

        if (response.status === 200) {
            showSwallSuccess();
        }

    } catch (error) {

        errorBackendResponse(error, showSwalError);

    }
}