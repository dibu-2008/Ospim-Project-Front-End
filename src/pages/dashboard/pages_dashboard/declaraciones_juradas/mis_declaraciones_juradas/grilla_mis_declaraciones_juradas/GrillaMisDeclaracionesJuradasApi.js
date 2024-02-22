import { errorBackendResponse } from "../../../../../../errors/errorBackendResponse";
import axios from "axios";
import Swal from "sweetalert2";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const MESSAGE_HTTP_CREATED = import.meta.env.VITE_MESSAGE_HTTP_CREATED;
const MESSAGE_HTTP_UPDATED = import.meta.env.VITE_MESSAGE_HTTP_UPDATED;
const MESSAGE_HTTP_DELETED = import.meta.env.VITE_MESSAGE_HTTP_DELETED;

export const obtenerMisDeclaracionesJuradas = async (idEmpresa, token) => {
  const URL = `${BACKEND_URL}/empresa/${idEmpresa}/ddjj/totales`;

  try {
    const declaracionesJuradasResponse = await axios.get(URL, {
      headers: {
        Authorization: token,
      },
    });

    const declaracionesJuradas = await declaracionesJuradasResponse.data;

    return declaracionesJuradas || [];
  } catch (error) {
    errorBackendResponse(error);
  }
};

export const obtenerMiDeclaracionJurada = async (
  idEmpresa,
  idDeclaracionJurada,
  token
) => {
  const URL = `${BACKEND_URL}/empresa/${idEmpresa}/ddjj/${idDeclaracionJurada}`;

  try {
    const declaracionJuradaResponse = await axios.get(URL, {
      headers: {
        Authorization: token,
      },
    });

    const declaracionJurada = await declaracionJuradaResponse.data;

    return declaracionJurada || {};
  } catch (error) {
    errorBackendResponse(error);
  }
};

export const presentarDeclaracionJurada = async (
  idEmpresa,
  idDeclaracionJurada,
  estado,
  token
) => {
  const URL = `${BACKEND_URL}/empresa/${idEmpresa}/ddjj/${idDeclaracionJurada}/presentar`;

  const showSwallSuccess = () => {
    Swal.fire({
      icon: "success",
      title: MESSAGE_HTTP_UPDATED,
      showConfirmButton: false,
      timer: 2000,
    });
  };

  try {
    const presentarDeclaracionJuradaResponse = await axios.patch(URL, estado, {
      headers: {
        Authorization: token,
      },
    });

    if (presentarDeclaracionJuradaResponse.status === 200) {
      showSwallSuccess();
    }
  } catch (error) {
    errorBackendResponse(error);
  }
};

export const eliminarDeclaracionJurada = async (
  idEmpresa,
  idDeclaracionJurada,
  token
) => {
  const URL = `${BACKEND_URL}/empresa/${idEmpresa}/ddjj/${idDeclaracionJurada}`;

  const showSwallSuccess = () => {
    Swal.fire({
      icon: "success",
      title: MESSAGE_HTTP_DELETED,
      showConfirmButton: false,
      timer: 2000,
    });
  };

  try {
    const eliminarDeclaracionJuradaResponse = await axios.delete(URL, {
      headers: {
        Authorization: token,
      },
    });

    if (eliminarDeclaracionJuradaResponse.status === 200) {
      showSwallSuccess();
    }
  } catch (error) {
    errorBackendResponse(error);
  }
};

export const obtenerAportes = async (idEmpresa, token) => {
  const URL = `${BACKEND_URL}/aportes/`;

  try {
    const aportesResponse = await axios.get(URL, {
      headers: {
        Authorization: token,
      },
    });

    const aportes = await aportesResponse.data;

    return aportes || [];
  } catch (error) {
    errorBackendResponse(error);
  }
};

export const imprimirDeclaracionJurada = async (
  idEmpresa,
  idDeclaracionJurada,
  token
) => {
  const URL = `${BACKEND_URL}/empresa/${idEmpresa}/ddjj/${idDeclaracionJurada}/imprimir`;

  try {
    const imprimirDeclaracionJuradaResponse = await axios.get(URL, {
      headers: {
        Authorization: token,
      },
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(
      new Blob([imprimirDeclaracionJuradaResponse.data])
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `DeclaracionJurada${idDeclaracionJurada}.pdf`
    );
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    errorBackendResponse(error);
  }
};
