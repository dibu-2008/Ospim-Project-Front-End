import axios from "axios";
import { errorBackendResponse } from "../../errors/errorBackendResponse";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const logon = async (usuario, clave) => {
  const URL = `${BACKEND_URL}/auth/login`;
  let jsonResponse = {
    token: null,
    tokenRefresco: null,
  };

  try {
    const logonDto = {
      usuario: usuario,
      clave: clave,
    };
    const response = await axios.post(URL, logonDto);
    const data = await response.data;

    return data || {};
  } catch (error) {
    errorBackendResponse(error);
    return jsonResponse;
  }
};

export const usuarioLogueadoHabilitadoDFA = async (token) => {
  const URL = `${BACKEND_URL}/auth/dfa/usuario-loguedo-habilitado`;

  try {
    const response = await axios.get(URL, {
      headers: {
        Authorization: token,
      },
    });
    const data = await response.data;
    return data || {};
  } catch (error) {
    errorBackendResponse(error);
  }
};

export const logonDFA = async (token, codigo) => {
  const URL = `${BACKEND_URL}/auth/login-dfa`;

  const codigoVerificacion = {
    codigo: codigo,
  };

  try {
    const response = await axios.post(URL, codigoVerificacion, {
      headers: {
        Authorization: token,
      },
    });
    const data = await response.data;

    return data || {};
  } catch (error) {
    errorBackendResponse(error);
  }
};

export const consultarUsuarioLogueado = async (token) => {
  const URL = `${BACKEND_URL}/auth/login/usuario`;
  console.log("consultarUsuarioLogueado - INIT");
  try {
    const response = await axios.get(URL, {
      headers: {
        Authorization: token,
      },
    });

    const data = await response.data;

    return data || {};
  } catch (error) {
    console.log("consultarUsuarioLogueado - ERRROR");
    errorBackendResponse(error);
  }
};
