const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


import axios from 'axios'
import Swal from 'sweetalert2'
import { errorBackendResponse } from '../../../errors/errorBackendResponse';

export const obtener = async (token) => {

    const URL = `${BACKEND_URL}/publicaciones`;


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


export const crear = async (publicacion, token) => {

    const URL = `${BACKEND_URL}/publicaciones`;

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
            title: 'Publicación creada',
            showConfirmButton: false,
            timer: 2000,
        })
    }

    try {
        
        const publicacionCreada = await axios.post(URL, publicacion, {
            headers: {
                'Authorization': token
            }
        });

        if(publicacionCreada.status === 201){
            showSwallSuccess();
        }

    } catch (error) {

        errorBackendResponse(error, showSwalError);

    }  
}

export const actualizar = async (publicacionId, publicacion, token) => {

    const URL = `${BACKEND_URL}/publicaciones/${publicacionId}`;

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
            title: 'Publicación actualizada',
            showConfirmButton: false,
            timer: 2000,
        })
    }


    try {
        
        const publicacionEditada = await axios.put(URL, publicacion, {
            headers: {
                'Authorization': token
            }
        });

        if(publicacionEditada.status === 200){
            showSwallSuccess();
        }

    } catch (error) {

        errorBackendResponse(error, showSwalError);

    } 
}

export const eliminar = async (publicacionId, token) => {

    const URL = `${BACKEND_URL}/publicaciones/${publicacionId}`;

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
            title: 'Publicación eliminada',
            showConfirmButton: false,
            timer: 2000,
        })
    }

    try {
        
        const publicacionEliminada = await axios.delete(URL, {
            headers: {
                'Authorization': token
            }
        });

        if(publicacionEliminada.status === 200){
            showSwallSuccess();
        }

    } catch (error) {

        errorBackendResponse(error, showSwalError);

    } 
}