import { errorBackendResponse } from "../../../../errors/errorBackendResponse";
import axios from "axios";
import Swal from "sweetalert2";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const MESSAGE_HTTP_CREATED = import.meta.env.VITE_MESSAGE_HTTP_CREATED;
const MESSAGE_HTTP_UPDATED = import.meta.env.VITE_MESSAGE_HTTP_UPDATED;
const MESSAGE_HTTP_DELETED = import.meta.env.VITE_MESSAGE_HTTP_DELETED;

export const obtenerUsuariosInternos = async (token) => {
  const URL = `${BACKEND_URL}/usuario/interno`;

  try {
    const usuariosInternosResponse = await axios.get(URL, {
      headers: {
        Authorization: token,
      },
    });
    const usuariosInternos = await usuariosInternosResponse.data;

    return usuariosInternos || [];
  } catch (error) {
    errorBackendResponse(error);
  }
};

export const obtenerRoles = async (token) => {
  const URL = `${BACKEND_URL}/rol`;

  try {
    const rolesResponse = await axios.get(URL, {
      headers: {
        Authorization: token,
      },
    });
    const roles = await rolesResponse.data;

    return roles || [];
  } catch (error) {
    errorBackendResponse(error);
  }
};

export const crearUsuarioInterno = async (token, usuarioInterno) => {
  const URL = `${BACKEND_URL}/usuario/interno`;

  const showSwalSuccess = () => {
    Swal.fire({
      icon: "success",
      title: MESSAGE_HTTP_CREATED,
      showConfirmButton: false,
      timer: 3000,
    });
  };

  try {
    const usuarioCreado = await axios.post(URL, usuarioInterno, {
      headers: {
        Authorization: token,
      },
    });

    if (usuarioCreado.status === 201) {
      showSwalSuccess();
    }
  } catch (error) {
    errorBackendResponse(error);
  }
};

export const actualizarUsuarioInterno = async (
  token,
  usuarioInterno,
  idUsuarioInterno
) => {
  const URL = `${BACKEND_URL}/usuario/interno/${idUsuarioInterno}`;

  const showSwalSuccess = () => {
    Swal.fire({
      icon: "success",
      title: MESSAGE_HTTP_UPDATED,
      showConfirmButton: false,
      timer: 3000,
    });
  };

  try {
    const usuarioModificado = await axios.put(URL, usuarioInterno, {
      headers: {
        Authorization: token,
      },
    });

    if (usuarioModificado.status === 200) {
      showSwalSuccess();
    }
  } catch (error) {
    errorBackendResponse(error);
  }
};

export const habilitarUsuarioInterno = async (
  token,
  idUsuarioInterno,
  habilitado
) => {
  const URL = `${BACKEND_URL}/usuario/${idUsuarioInterno}/habilitar`;

  const showSwalSuccess = () => {
    Swal.fire({
      icon: "success",
      title: MESSAGE_HTTP_UPDATED,
      showConfirmButton: false,
      timer: 3000,
    });
  };

  try {
    const usuarioHabilitado = await axios.patch(URL, habilitado, {
      headers: {
        Authorization: token,
      },
    });

    if (usuarioHabilitado.status === 200) {
      showSwalSuccess();
    }
  } catch (error) {
    errorBackendResponse(error);
  }
};

export const deshabilitarUsuarioInterno = async (
  token,
  idUsuarioInterno,
  habilitado
) => {
  const URL = `${BACKEND_URL}/usuario/${idUsuarioInterno}/deshabilitar`;

  const showSwalSuccess = () => {
    Swal.fire({
      icon: "success",
      title: MESSAGE_HTTP_UPDATED,
      showConfirmButton: false,
      timer: 3000,
    });
  };

  try {
    const usuarioDeshabilitado = await axios.patch(URL, habilitado, {
      headers: {
        Authorization: token,
      },
    });

    if (usuarioDeshabilitado.status === 200) {
      showSwalSuccess();
    }
  } catch (error) {
    errorBackendResponse(error);
  }
};
