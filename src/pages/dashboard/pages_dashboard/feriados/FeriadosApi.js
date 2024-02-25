import { errorBackendResponse } from "../../../../errors/errorBackendResponse";
import axios from "axios";
import Swal from "sweetalert2";
import { getHttpHeader } from "@/http_header/getHttpHeader";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const MESSAGE_HTTP_CREATED = import.meta.env.VITE_MESSAGE_HTTP_CREATED;
const MESSAGE_HTTP_UPDATED = import.meta.env.VITE_MESSAGE_HTTP_UPDATED;
const MESSAGE_HTTP_DELETED = import.meta.env.VITE_MESSAGE_HTTP_DELETED;

export const obtenerFeriados = async () => {
  const URL = `${BACKEND_URL}/feriados`;

  try {
    const feriadosResponse = await axios.get(URL, getHttpHeader());
    const feriados = await feriadosResponse.data;

    return feriados || [];
  } catch (error) {
    errorBackendResponse(error);
  }
};

export const crearFeriado = async (nuevoFeriado) => {
  const URL = `${BACKEND_URL}/feriados`;

  const showSwallSuccess = () => {
    Swal.fire({
      icon: "success",
      title: MESSAGE_HTTP_CREATED,
      showConfirmButton: false,
      timer: 2000,
    });
  };

  try {
    const feriadoResponse = await axios.post(
      URL,
      nuevoFeriado,
      getHttpHeader()
    );

    if (feriadoResponse.status === 201) {
      showSwallSuccess();
    }
  } catch (error) {
    errorBackendResponse(error);
  }
};

export const actualizarFeriado = async (idFeriado, feriado) => {
  const URL = `${BACKEND_URL}/feriados/${idFeriado}`;

  const showSwallSuccess = () => {
    Swal.fire({
      icon: "success",
      title: MESSAGE_HTTP_UPDATED,
      showConfirmButton: false,
      timer: 2000,
    });
  };

  try {
    const feriadoResponse = await axios.put(URL, feriado, getHttpHeader());

    if (feriadoResponse.status === 200) {
      showSwallSuccess();
    }
  } catch (error) {
    errorBackendResponse(error);
  }
};

export const eliminarFeriado = async (idFeriado) => {
  const URL = `${BACKEND_URL}/feriados/${idFeriado}`;

  const showSwallSuccess = () => {
    Swal.fire({
      icon: "success",
      title: MESSAGE_HTTP_DELETED,
      showConfirmButton: false,
      timer: 2000,
    });
  };

  try {
    const feriadoResponse = await axios.delete(URL, getHttpHeader());

    if (feriadoResponse.status === 200) {
      showSwallSuccess();
    }
  } catch (error) {
    errorBackendResponse(error);
  }
};
