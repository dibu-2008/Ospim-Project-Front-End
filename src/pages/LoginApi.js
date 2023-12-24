const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

import axios from "axios";
import Swal from "sweetalert2";
import { errorBackendResponse } from "../errors/errorBackendResponse";

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
      usuario: user,
      clave: passwordLoginInternalUser,
    };
    const logonResponse = await axios.post(URL, logonDto);
    const logon = await logonResponse.data;

    return logon || {};
  } catch (error) {
    errorBackendResponse(error, showSwalError);
  }
};

export const consultarUsuarioLogeado = async (token) => {
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
    const usuarioLogeadoResponse = await axios.post(URL, {
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
