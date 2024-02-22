import { errorBackendResponse } from "../../../../../errors/errorBackendResponse";
import axios from "axios";
import Swal from "sweetalert2";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const MESSAGE_HTTP_CREATED = import.meta.env.VITE_MESSAGE_HTTP_CREATED;
const MESSAGE_HTTP_UPDATED = import.meta.env.VITE_MESSAGE_HTTP_UPDATED;
const MESSAGE_HTTP_DELETED = import.meta.env.VITE_MESSAGE_HTTP_DELETED;

export const obtenerAfiliados = async (token, cuil) => {
  const URL = `${BACKEND_URL}/afiliado/?cuil=${cuil}`;

  try {
    const afiliadosResponse = await axios.get(URL, {
      headers: {
        Authorization: token,
      },
    });
    const afiliados = await afiliadosResponse.data;

    return afiliados || [];
  } catch (error) {
    errorBackendResponse(error);
  }
};

export const obtenerCamaras = async (token) => {
  const URL = `${BACKEND_URL}/camara`;

  try {
    const camarasResponse = await axios.get(URL, {
      headers: {
        Authorization: token,
      },
    });
    const camaras = await camarasResponse.data;

    return camaras || [];
  } catch (error) {
    errorBackendResponse(error);
  }
};

export const obtenerCategorias = async (token) => {
  const URL = `${BACKEND_URL}/categoria`;

  try {
    const categoriasResponse = await axios.get(URL, {
      headers: {
        Authorization: token,
      },
    });
    const categorias = await categoriasResponse.data;

    return categorias || [];
  } catch (error) {
    errorBackendResponse(error);
  }
};

export const obtenerPlantaEmpresas = async (token, empresaId) => {
  const URL = `${BACKEND_URL}/empresa/${empresaId}/domicilio/planta`;

  try {
    const plantasResponse = await axios.get(URL, {
      headers: {
        Authorization: token,
      },
    });
    const plantas = await plantasResponse.data;

    return plantas || [];
  } catch (error) {
    errorBackendResponse(error);
  }
};

export const crearAltaDeclaracionJurada = async (token, empresaId, ddjj) => {
  const URL = `${BACKEND_URL}/empresa/${empresaId}/ddjj`;

  const showSwallSuccess = () => {
    Swal.fire({
      icon: "success",
      title: MESSAGE_HTTP_CREATED,
      showConfirmButton: false,
      timer: 2000,
    });
  };

  try {
    const altaDeclaracionJuradaResponse = await axios.post(URL, ddjj, {
      headers: {
        Authorization: token,
      },
    });

    showSwallSuccess();

    return altaDeclaracionJuradaResponse.data;
  } catch (error) {
    errorBackendResponse(error);
  }
};

export const actualizarDeclaracionJurada = async (
  token,
  empresaId,
  ddjj,
  idDDJJ
) => {
  const URL = `${BACKEND_URL}/empresa/${empresaId}/ddjj/${idDDJJ}`;

  const showSwallSuccess = () => {
    Swal.fire({
      icon: "success",
      title: MESSAGE_HTTP_UPDATED,
      showConfirmButton: false,
      timer: 2000,
    });
  };

  try {
    const actualizarDeclaracionJuradaResponse = await axios.put(URL, ddjj, {
      headers: {
        Authorization: token,
      },
    });

    showSwallSuccess();

    if (actualizarDeclaracionJuradaResponse.status === 200) {
      showSwallSuccess();
    }
  } catch (error) {
    errorBackendResponse(error);
  }
};

export const validarAltaDeclaracionJurada = async (token, empresaId, ddjj) => {
  const URL = `${BACKEND_URL}/empresa/${empresaId}/ddjj/validar`;

  try {
    const validarDDJJResponse = await axios.post(URL, ddjj, {
      headers: {
        Authorization: token,
      },
    });

    return validarDDJJResponse.data || [];
  } catch (error) {
    if (error.response && error.response.data) {
      const { errores, codigo, descripcion, ticket, tipo } =
        error.response.data;

      return errores || [];
    }
  }
};
