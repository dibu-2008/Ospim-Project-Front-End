import { errorBackendResponse } from "../../../../errors/errorBackendResponse";
import axios from "axios";
import Swal from "sweetalert2";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const MESSAGE_HTTP_CREATED = import.meta.env.VITE_MESSAGE_HTTP_CREATED;
const MESSAGE_HTTP_UPDATED = import.meta.env.VITE_MESSAGE_HTTP_UPDATED;
const MESSAGE_HTTP_DELETED = import.meta.env.VITE_MESSAGE_HTTP_DELETED;

export const getRamo = async (token) => {
  if (!token) return [];

  const URL = `${BACKEND_URL}/empresa/ramo`;

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
    const ramoResponse = await axios.get(URL, {
      headers: {
        Authorization: token,
      },
    });
    const ramos = await ramoResponse.data;

    return ramos || [];
  } catch (error) {
    errorBackendResponse(error, showSwalError);
  }
};

export const getEmpresa = async (token) => {
  if (!token) return [];

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
    const empresaResponse = await axios.get(URL, {
      headers: {
        Authorization: token,
      },
    });
    const empresa = await empresaResponse.data;

    return empresa || [];
  } catch (error) {
    errorBackendResponse(error, showSwalError);
  }
};

export const modificarEmpresa = async (token, empresaId, empresaInfo) => {

  const URL = `${BACKEND_URL}/empresa/${empresaId}`;

  const showSwalError = (descripcion) => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: descripcion,
      showConfirmButton: false,
      timer: 3000,
    });
  }

  const showSwallSuccess = () => {
    Swal.fire({
      icon: "success",
      title: MESSAGE_HTTP_UPDATED,
      showConfirmButton: false,
      timer: 2000,
    });
  }

  try {
    const empresaResponse = await axios.put(URL, empresaInfo, {
      headers: {
        Authorization: token,
      },
    });
    
    if (empresaResponse.status === 200) {
      showSwallSuccess();
    }

  } catch (error) {
    errorBackendResponse(error, showSwalError);
  }
}