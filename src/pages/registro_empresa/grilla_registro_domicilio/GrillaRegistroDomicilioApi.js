const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import axios from "axios";
import Swal from "sweetalert2";
import { errorBackendResponse } from "../../../errors/errorBackendResponse";

export const obtenerTipoDomicilio = async () => {
  const URL = `${BACKEND_URL}/empresa/public/domicilio/tipo`;

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
    const tipoDomicilioResponse = await axios.get(URL);
    const tipoDomicilio = await tipoDomicilioResponse.data;

    return tipoDomicilio || [];
  } catch (error) {
    errorBackendResponse(error, showSwalError);
  }
};

export const obtenerProvincias = async () => {
  const URL = `${BACKEND_URL}/public/provincia`;

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
    const provinciasResponse = await axios.get(URL);
    const provincias = await provinciasResponse.data;

    return provincias || [];
  } catch (error) {
    errorBackendResponse(error, showSwalError);
  }
};

export const obtenerLocalidades = async (idProvincia) => {
  if (idProvincia == null) {
    return [];
  }

  const URL = `${BACKEND_URL}/public/provincia/${idProvincia}/localidad`;

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
    const localidadesResponse = await axios.get(URL);
    const localidades = await localidadesResponse.data;

    return localidades || [];
  } catch (error) {
    errorBackendResponse(error, showSwalError);
  }
};
