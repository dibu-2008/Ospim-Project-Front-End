const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

import axios from "axios";
import Swal from "sweetalert2";
import { errorBackendResponse } from "../../errors/errorBackendResponse";

export const logon = async (usuario, clave) => {
  const URL = `${BACKEND_URL}/auth/login`;

  const showSwalError = (descripcion) => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: descripcion,
      showConfirmButton: false,
      timer: 3000,
    });
  };

  try {
    const logonDto = {
      usuario: usuario,
      clave: clave,
    };
    const logonResponse = await axios.post(URL, logonDto);
    const logon = await logonResponse.data;

    return logon || {};
  } catch (error) {
    errorBackendResponse(error, showSwalError);
  }
};

export const usuarioLogueadoHabilitadoDFA = async (token) => {
  const URL = `${BACKEND_URL}/auth/dfa/usuario-loguedo-habilitado`;

  const showSwalError = (descripcion) => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: descripcion,
      showConfirmButton: false,
      timer: 3000,
    });
  };

  try {
    const usuarioResponse = await axios.get(URL, {
      headers: {
        Authorization: token,
      },
    });
    const usuario = await usuarioResponse.data;
    return usuario || {};
  } catch (error) {
    errorBackendResponse(error, showSwalError);
  }
};

export const logonDFA = async (token, codigo) => {
  const URL = `${BACKEND_URL}/auth/login-dfa`;

  const showSwalError = (descripcion) => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: descripcion,
      showConfirmButton: false,
      timer: 3000,
    });
  };

  const codigoVerificacion = {
    codigo: codigo,
  };

  try {
    const loginDfaResponse = await axios.post(URL, codigoVerificacion, {
      headers: {
        Authorization: token,
      },
    });
    const loginDfa = await loginDfaResponse.data;

    return loginDfa || {};
  } catch (error) {
    errorBackendResponse(error, showSwalError);
  }
};

export const consultarUsuarioLogueado = async (token) => {
  const URL = `${BACKEND_URL}/auth/login/usuario`;

  const showSwalError = (descripcion) => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: descripcion,
      showConfirmButton: false,
      timer: 3000,
    });
  };

  try {
    const usuarioLogeadoResponse = await axios.get(URL, {
      headers: {
        Authorization: token,
      },
    });

    const usuarioLogeado = await usuarioLogeadoResponse.data;

    return usuarioLogeado || {};
  } catch (error) {
    errorBackendResponse(error, showSwalError);
  }
};
