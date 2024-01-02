const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import axios from 'axios'
import Swal from 'sweetalert2'
import { errorBackendResponse } from '../../../../errors/errorBackendResponse';

export const obtenerUsuariosInternos = async (token) => {

    const URL = `${BACKEND_URL}/usuario/interno`;

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

        const usuariosInternosResponse = await axios.get(URL, {
            headers: {
                'Authorization': token
            }
        });
        const usuariosInternos = await usuariosInternosResponse.data;

        return usuariosInternos || [];

    } catch (error) {

        errorBackendResponse(error, showSwalError);

    }
}

export const obtenerRoles = async (token) => {

    const URL = `${BACKEND_URL}/rol`;

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

        const rolesResponse = await axios.get(URL, {
            headers: {
                'Authorization': token
            }
        });
        const roles = await rolesResponse.data;

        return roles || [];

    } catch (error) {

        errorBackendResponse(error, showSwalError);

    }
}

export const crearUsuarioInterno = async (token, usuarioInterno) => {

    const URL = `${BACKEND_URL}/usuario/interno`;

    const showSwalError = (descripcion) => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: descripcion,
            showConfirmButton: false,
            timer: 3000,
        })
    }

    const showSwalSuccess = () => {
        Swal.fire({
            icon: 'success',
            title: 'Usuario interno creado',
            showConfirmButton: false,
            timer: 3000,
        })
    }

    try {

        const usuarioCreado = await axios.post(URL, usuarioInterno, {
            headers: {
                'Authorization': token
            }
        });


        if (usuarioCreado.status === 201) {
            showSwalSuccess();
        }

    } catch (error) {

        errorBackendResponse(error, showSwalError);

    }
}

export const modificarUsuarioInterno = async (token, usuarioInterno, idUsuarioInterno) => {

    const URL = `${BACKEND_URL}/usuario/interno/${idUsuarioInterno}`;

    const showSwalError = (descripcion) => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: descripcion,
            showConfirmButton: false,
            timer: 3000,
        })
    }

    const showSwalSuccess = () => {
        Swal.fire({
            icon: 'success',
            title: 'Usuario interno modificado',
            showConfirmButton: false,
            timer: 3000,
        })
    }

    try {

        const usuarioModificado = await axios.put(URL, usuarioInterno, {
            headers: {
                'Authorization': token
            }
        });


        if (usuarioModificado.status === 200) {
            showSwalSuccess();
        }

    } catch (error) {

        errorBackendResponse(error, showSwalError);

    }
}

export const habilitarUsuarioInterno = async (token, idUsuarioInterno, habilitado) => {

    const URL = `${BACKEND_URL}/usuario/${idUsuarioInterno}/habilitar`;

    const showSwalError = (descripcion) => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: descripcion,
            showConfirmButton: false,
            timer: 3000,
        })
    }

    const showSwalSuccess = () => {
        Swal.fire({
            icon: 'success',
            title: 'Usuario interno habilitado',
            showConfirmButton: false,
            timer: 3000,
        })
    }

    try {

        const usuarioHabilitado = await axios.patch(URL, habilitado, {
            headers: {
                'Authorization': token
            }
        });

        if (usuarioHabilitado.status === 200) {
            showSwalSuccess();
        }

    } catch (error) {

        errorBackendResponse(error, showSwalError);

    }

}

export const deshabilitarUsuarioInterno = async (token, idUsuarioInterno, habilitado) => {

    const URL = `${BACKEND_URL}/usuario/${idUsuarioInterno}/deshabilitar`;

    const showSwalError = (descripcion) => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: descripcion,
            showConfirmButton: false,
            timer: 3000,
        })
    }

    const showSwalSuccess = () => {
        Swal.fire({
            icon: 'success',
            title: 'Usuario interno deshabilitado',
            showConfirmButton: false,
            timer: 3000,
        })
    }

    try {

        const usuarioDeshabilitado = await axios.patch(URL, habilitado, {
            headers: {
                'Authorization': token
            }
        });

        if (usuarioDeshabilitado.status === 200) {
            showSwalSuccess();
        }

    } catch (error) {

        errorBackendResponse(error, showSwalError);

    }

}