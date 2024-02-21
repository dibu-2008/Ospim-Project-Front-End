import { errorBackendResponse } from "../../../../errors/errorBackendResponse";
import axios from "axios";
import Swal from "sweetalert2";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const MESSAGE_HTTP_CREATED = import.meta.env.VITE_MESSAGE_HTTP_CREATED;
const MESSAGE_HTTP_UPDATED = import.meta.env.VITE_MESSAGE_HTTP_UPDATED;
const MESSAGE_HTTP_DELETED = import.meta.env.VITE_MESSAGE_HTTP_DELETED;

export const obtenerCuitsRestringidos = async (token) => {
  const URL = `${BACKEND_URL}/cuit-restringido`;

  try {
    const cuitsRestringidosResponse = await axios.get(URL, {
      headers: {
        Authorization: token,
      },
    });
    const cuitsRestringidos = await cuitsRestringidosResponse.data;

    return cuitsRestringidos || [];
  } catch (error) {
    errorBackendResponse(error);
  }
};

export const crearCuitRestringido = async (cuitRestringido, token) => {
  const URL = `${BACKEND_URL}/cuit-restringido`;

  const showSwallSuccess = () => {
    Swal.fire({
      icon: "success",
      title: MESSAGE_HTTP_CREATED,
      showConfirmButton: false,
      timer: 2000,
    });
  };

  try {
    const cuitRestringidoResponse = await axios.post(URL, cuitRestringido, {
      headers: {
        Authorization: token,
      },
    });

    if (cuitRestringidoResponse.status === 201) {
      showSwallSuccess();
    }
  } catch (error) {
    errorBackendResponse(error);
  }
};

export const actualizarCuitRestringido = async (
  idCuitRestringido,
  cuitRestringido,
  token
) => {
  const URL = `${BACKEND_URL}/cuit-restringido/${idCuitRestringido}`;

  const showSwallSuccess = () => {
    Swal.fire({
      icon: "success",
      title: MESSAGE_HTTP_UPDATED,
      showConfirmButton: false,
      timer: 2000,
    });
  };

  try {
    const cuitRestringidoResponse = await axios.put(URL, cuitRestringido, {
      headers: {
        Authorization: token,
      },
    });

    if (cuitRestringidoResponse.status === 200) {
      showSwallSuccess();
    }
  } catch (error) {
    errorBackendResponse(error);
  }
};

export const eliminarCuitRestringido = async (idCuitRestringido, token) => {
  const URL = `${BACKEND_URL}/cuit-restringido/${idCuitRestringido}`;

  const showSwallSuccess = () => {
    Swal.fire({
      icon: "success",
      title: MESSAGE_HTTP_DELETED,
      showConfirmButton: false,
      timer: 2000,
    });
  };

  try {
    const cuitRestringidoResponse = await axios.delete(URL, {
      headers: {
        Authorization: token,
      },
    });

    if (cuitRestringidoResponse.status === 200) {
      showSwallSuccess();
    }
  } catch (error) {
    errorBackendResponse(error);
  }
};
