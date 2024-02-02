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

export const obtenerCamaras = async (token) => {

    const URL = `${BACKEND_URL}/camara`;

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

        const camarasResponse = await axios.get(URL, {
            headers: {
                'Authorization': token
            }
        });
        const camaras = await camarasResponse.data;

        return camaras || [];

    } catch (error) {

        errorBackendResponse(error, showSwalError);

    }
}

export const obtenerCategorias = async (token) => {

    const URL = `${BACKEND_URL}/categoria`;

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

        const categoriasResponse = await axios.get(URL, {
            headers: {
                'Authorization': token
            }
        });
        const categorias = await categoriasResponse.data;

        return categorias || [];

    } catch (error) {

        errorBackendResponse(error, showSwalError);

    }
}

export const obtenerPlantaEmpresas = async (token, empresaId) => {

    const URL = `${BACKEND_URL}/empresa/${empresaId}/domicilio/planta`;

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

        const plantasResponse = await axios.get(URL, {
            headers: {
                'Authorization': token
            }
        });
        const plantas = await plantasResponse.data;

        return plantas || [];

    } catch (error) {

        errorBackendResponse(error, showSwalError);
    }

}

export const crearAltaDeclaracionJurada = async (token, empresaId, ddjj) => {

    // Metodo para crear una declaracion jurada
    // const URL = `${BACKEND_URL}/empresa/${empresaId}/ddjj`;;
    const URL = `${BACKEND_URL}/v2/empresa/${empresaId}/ddjj`;

    const showSwalError = (descripcion) => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: descripcion,
            showConfirmButton: true,
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

        const altaDeclaracionJuradaResponse = await axios.post(URL, ddjj, {
            headers: {
                'Authorization': token
            }
        });

        showSwallSuccess();

        return altaDeclaracionJuradaResponse.data;

    }catch (error) {

        errorBackendResponse(error, showSwalError);

    }

}












