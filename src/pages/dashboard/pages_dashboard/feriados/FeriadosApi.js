import { errorBackendResponse } from "../../../../errors/errorBackendResponse";
import axios from 'axios'
import Swal from 'sweetalert2'
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const MESSAGE_HTTP_CREATED = import.meta.env.VITE_MESSAGE_HTTP_CREATED;
const MESSAGE_HTTP_UPDATED = import.meta.env.VITE_MESSAGE_HTTP_UPDATED;
const MESSAGE_HTTP_DELETED = import.meta.env.VITE_MESSAGE_HTTP_DELETED;

export const obtenerFeriados = async (token) => {

    const URL = `${BACKEND_URL}/feriados`;

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

        const feriadosResponse = await axios.get(URL, {
            headers: {
                'Authorization': token
            }
        });
        const feriados = await feriadosResponse.data;

        return feriados || [];

    }
    catch (error) {

        errorBackendResponse(error, showSwalError);

    }
}

export const crearFeriado = async (nuevoFeriado, token) => {

    const URL = `${BACKEND_URL}/feriados`;

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
            title: MESSAGE_HTTP_CREATED,
            showConfirmButton: false,
            timer: 2000,
        })
    }

    try {

        const feriadoResponse = await axios.post(URL, nuevoFeriado, {
            headers: {
                'Authorization': token
            }
        });

        if (feriadoResponse.status === 201) {
            showSwallSuccess();
        }

    }
    catch (error) {

        errorBackendResponse(error, showSwalError);

    }
}

export const actualizarFeriado = async (idFeriado, feriado, token) => {

    const URL = `${BACKEND_URL}/feriados/${idFeriado}`;

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
            title: MESSAGE_HTTP_UPDATED,
            showConfirmButton: false,
            timer: 2000,
        })
    }

    try {

        const feriadoResponse = await axios.put(URL, feriado, {
            headers: {
                'Authorization': token
            }
        });

        if (feriadoResponse.status === 200) {
            showSwallSuccess();
        }

    }
    catch (error) {

        errorBackendResponse(error, showSwalError);

    }

}

export const eliminarFeriado = async (idFeriado, token) => {

    const URL = `${BACKEND_URL}/feriados/${idFeriado}`;

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
            title: MESSAGE_HTTP_DELETED,
            showConfirmButton: false,
            timer: 2000,
        })
    }

    try {

        const feriadoResponse = await axios.delete(URL, {
            headers: {
                'Authorization': token
            }
        });

        if (feriadoResponse.status === 200) {
            showSwallSuccess();
        }

    }
    catch (error) {

        errorBackendResponse(error, showSwalError);

    }

}