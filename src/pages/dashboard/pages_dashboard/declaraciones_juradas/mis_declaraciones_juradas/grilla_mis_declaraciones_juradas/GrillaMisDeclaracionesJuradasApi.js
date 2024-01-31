import { errorBackendResponse } from '../../../../../../errors/errorBackendResponse';
import axios from 'axios'
import Swal from 'sweetalert2'
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const MESSAGE_HTTP_CREATED = import.meta.env.VITE_MESSAGE_HTTP_CREATED;
const MESSAGE_HTTP_UPDATED = import.meta.env.VITE_MESSAGE_HTTP_UPDATED;
const MESSAGE_HTTP_DELETED = import.meta.env.VITE_MESSAGE_HTTP_DELETED;

export const obtenerMisDeclaracionesJuradas = async (idEmpresa, token) => {

    const URL = `${BACKEND_URL}/v2/empresa/${idEmpresa}/ddjj`;

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

        const declaracionesJuradasResponse = await axios.get(URL, {
            headers: {
                'Authorization': token
            }
        });

        const declaracionesJuradas = await declaracionesJuradasResponse.data;

        return declaracionesJuradas || [];

    } catch (error) {

        errorBackendResponse(error, showSwalError);

    }
}

export const presentarDeclaracionJurada = async (idEmpresa, idDeclaracionJurada, estado, token) => {

    const URL = `${BACKEND_URL}/empresa/${idEmpresa}/ddjj/${idDeclaracionJurada}/presentar`;

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

        const presentarDeclaracionJuradaResponse = await axios.patch(URL, estado, {
            headers: {
                'Authorization': token
            }
        });

        if (presentarDeclaracionJuradaResponse.status === 200) {
            showSwallSuccess();
        }

    } catch (error) {

        errorBackendResponse(error, showSwalError);

    }
}

export const eliminarDeclaracionJurada = async (idEmpresa, idDeclaracionJurada, token) => {

    const URL = `${BACKEND_URL}/empresa/${idEmpresa}/ddjj/${idDeclaracionJurada}`;

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

        const eliminarDeclaracionJuradaResponse = await axios.delete(URL, {
            headers: {
                'Authorization': token
            }
        });

        if (eliminarDeclaracionJuradaResponse.status === 200) {
            showSwallSuccess();
        }

    } catch (error) {

        errorBackendResponse(error, showSwalError);

    }

}