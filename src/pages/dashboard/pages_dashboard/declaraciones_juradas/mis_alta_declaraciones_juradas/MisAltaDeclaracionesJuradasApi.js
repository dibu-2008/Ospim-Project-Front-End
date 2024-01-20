import { errorBackendResponse } from '../../../../../errors/errorBackendResponse';
import axios from 'axios'
import Swal from 'sweetalert2'
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const MESSAGE_HTTP_CREATED = import.meta.env.VITE_MESSAGE_HTTP_CREATED;
const MESSAGE_HTTP_UPDATED = import.meta.env.VITE_MESSAGE_HTTP_UPDATED;
const MESSAGE_HTTP_DELETED = import.meta.env.VITE_MESSAGE_HTTP_DELETED;

export const obtenerAfiliados = async (token, cuil) => {

    const URL = `${BACKEND_URL}/afiliado/?cuil=${cuil}`;

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

        const afiliadosResponse = await axios.get(URL, {
            headers: {
                'Authorization': token
            }
        });
        const afiliados = await afiliadosResponse.data;

        return afiliados || [];

    } catch (error) {

        errorBackendResponse(error, showSwalError);

    }
}