import { errorBackendResponse } from "../../../../../errors/errorBackendResponse";
import axios from "axios";
import Swal from "sweetalert2";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const MESSAGE_HTTP_CREATED = import.meta.env.VITE_MESSAGE_HTTP_CREATED;
const MESSAGE_HTTP_UPDATED = import.meta.env.VITE_MESSAGE_HTTP_UPDATED;
const MESSAGE_HTTP_DELETED = import.meta.env.VITE_MESSAGE_HTTP_DELETED;

export const obtenerTipo = async (token) => {
  const URL = `${BACKEND_URL}/empresa/contacto/tipo`;

  try {
    const tipoContactoResponse = await axios.get(URL, {
      headers: {
        Authorization: token,
      },
    });
    const tipoContacto = await tipoContactoResponse.data;

    return tipoContacto || [];
  } catch (error) {
    errorBackendResponse(error);
  }
};

export const obtenerDatosEmpresa = async (token) => {
  const URL = `${BACKEND_URL}/empresa/:empresaId/contacto`;

  try {
    const empresaResponse = await axios.get(URL, {
      headers: {
        Authorization: token,
      },
    });
    const empresa = await empresaResponse.data;

    return empresa || [];
  } catch (error) {
    errorBackendResponse(error);
  }
};

export const crearContacto = async (nuevoContacto, token) => {
  const URL = `${BACKEND_URL}/empresa/:empresaId/contacto`;

  const showSwallSuccess = () => {
    Swal.fire({
      icon: "success",
      title: MESSAGE_HTTP_CREATED,
      showConfirmButton: false,
      timer: 2000,
    });
  };

  try {
    const contactoResponse = await axios.post(URL, nuevoContacto, {
      headers: {
        Authorization: token,
      },
    });

    if (contactoResponse.status === 201) {
      showSwallSuccess();
    }
  } catch (error) {
    errorBackendResponse(error);
  }
};

export const actualizarContacto = async (idContacto, contacto, token) => {
  const URL = `${BACKEND_URL}/empresa/:empresaId/contacto/${idContacto}`;

  const showSwallSuccess = () => {
    Swal.fire({
      icon: "success",
      title: MESSAGE_HTTP_UPDATED,
      showConfirmButton: false,
      timer: 2000,
    });
  };

  try {
    const contactoResponse = await axios.put(URL, contacto, {
      headers: {
        Authorization: token,
      },
    });

    console.log(contactoResponse);

    if (contactoResponse.status === 200) {
      showSwallSuccess();
    }
  } catch (error) {
    errorBackendResponse(error);
  }
};

export const eliminarContacto = async (idContacto, token) => {
  const URL = `${BACKEND_URL}/empresa/:empresaId/contacto/${idContacto}`;

  const showSwallSuccess = () => {
    Swal.fire({
      icon: "success",
      title: MESSAGE_HTTP_DELETED,
      showConfirmButton: false,
      timer: 2000,
    });
  };

  try {
    const contactoResponse = await axios.delete(URL, {
      headers: {
        Authorization: token,
      },
    });

    if (contactoResponse.status === 200) {
      showSwallSuccess();
    }
  } catch (error) {
    errorBackendResponse(error);
  }
};
