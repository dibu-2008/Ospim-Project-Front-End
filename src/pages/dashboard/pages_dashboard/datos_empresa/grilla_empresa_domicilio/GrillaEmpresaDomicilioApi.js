import { errorBackendResponse } from "../../../../../errors/errorBackendResponse";
import axios from "axios";
import Swal from "sweetalert2";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const MESSAGE_HTTP_CREATED = import.meta.env.VITE_MESSAGE_HTTP_CREATED;
const MESSAGE_HTTP_UPDATED = import.meta.env.VITE_MESSAGE_HTTP_UPDATED;
const MESSAGE_HTTP_DELETED = import.meta.env.VITE_MESSAGE_HTTP_DELETED;

export const obtenerTipoDomicilio = async (token) => {
  const URL = `${BACKEND_URL}/empresa/domicilio/tipo`;

  try {
    const tipoDomicilioResponse = await axios.get(URL, {
      headers: {
        Authorization: token,
      },
    });
    const tipoDomicilio = await tipoDomicilioResponse.data;

    return tipoDomicilio || [];
  } catch (error) {
    errorBackendResponse(error);
  }
};

export const obtenerProvincias = async (token) => {
  const URL = `${BACKEND_URL}/provincia`;

  try {
    const provinciasResponse = await axios.get(URL, {
      headers: {
        Authorization: token,
      },
    });
    const provincias = await provinciasResponse.data;

    return provincias || [];
  } catch (error) {
    errorBackendResponse(error);
  }
};

export const obtenerLocalidades = async (token, idProvincia) => {
  const URL = `${BACKEND_URL}/provincia/${idProvincia}/localidad`;

  try {
    const localidadesResponse = await axios.get(URL, {
      headers: {
        Authorization: token,
      },
    });
    const localidades = await localidadesResponse.data;

    return localidades || [];
  } catch (error) {
    errorBackendResponse(error);
  }
};

export const obtenerDomicilios = async (token, empresaId) => {
  const URL = `${BACKEND_URL}/empresa/${empresaId}/domicilio`;

  try {
    const filasDomicilioResponse = await axios.get(URL, {
      headers: {
        Authorization: token,
      },
    });
    const filasDomicilio = await filasDomicilioResponse.data;

    return filasDomicilio || [];
  } catch (error) {
    errorBackendResponse(error);
  }
};

export const crearDomicilio = async (nuevoDomicilio, empresaId, token) => {
  const URL = `${BACKEND_URL}/empresa/${empresaId}/domicilio`;

  const showSwallSuccess = () => {
    Swal.fire({
      icon: "success",
      title: MESSAGE_HTTP_CREATED,
      showConfirmButton: false,
      timer: 2000,
    });
  };

  try {
    const response = await axios.post(URL, nuevoDomicilio, {
      headers: {
        Authorization: token,
      },
    });

    if (response.status === 201) {
      showSwallSuccess();
    }
  } catch (error) {
    errorBackendResponse(error);
  }
};

export const actualizarDomicilio = async (
  idDomicilio,
  domicilio,
  token,
  empresaId
) => {
  const URL = `${BACKEND_URL}/empresa/${empresaId}/domicilio/${idDomicilio}`;

  const showSwallSuccess = () => {
    Swal.fire({
      icon: "success",
      title: MESSAGE_HTTP_UPDATED,
      showConfirmButton: false,
      timer: 2000,
    });
  };

  try {
    const response = await axios.put(URL, domicilio, {
      headers: {
        Authorization: token,
      },
    });

    if (response.status === 200) {
      showSwallSuccess();
    }
  } catch (error) {
    errorBackendResponse(error);
  }
};

export const eliminarDomicilio = async (idDomicilio, token, empresaId) => {
  const URL = `${BACKEND_URL}/empresa/${empresaId}/domicilio/${idDomicilio}`;

  const showSwallSuccess = () => {
    Swal.fire({
      icon: "success",
      title: MESSAGE_HTTP_DELETED,
      showConfirmButton: false,
      timer: 2000,
    });
  };

  try {
    const response = await axios.delete(URL, {
      headers: {
        Authorization: token,
      },
    });

    if (response.status === 200) {
      showSwallSuccess();
    }
  } catch (error) {
    errorBackendResponse(error);
  }
};
