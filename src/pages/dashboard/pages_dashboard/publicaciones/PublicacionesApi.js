import axios from "axios";
import Swal from "sweetalert2";
import { errorBackendResponse } from "../../../../errors/errorBackendResponse";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const MESSAGE_HTTP_CREATED = import.meta.env.VITE_MESSAGE_HTTP_CREATED;
const MESSAGE_HTTP_UPDATED = import.meta.env.VITE_MESSAGE_HTTP_UPDATED;
const MESSAGE_HTTP_DELETED = import.meta.env.VITE_MESSAGE_HTTP_DELETED;

const TOKEN = JSON.parse(localStorage.getItem("stateLogin")).usuarioLogueado
  .usuario.token;

const oHeaders = {
  headers: {
    Authorization: TOKEN,
  },
};

export const obtenerPublicaciones = async () => {
  const URL = `${BACKEND_URL}/publicaciones`;

  try {
    const novedadesResponse = await axios.get(URL, oHeaders);
    const novedades = await novedadesResponse.data;

    return novedades || [];
  } catch (error) {
    errorBackendResponse(error);
  }
};

export const crearPublicacion = async (publicacion) => {
  const URL = `${BACKEND_URL}/publicaciones`;
  const idDto = { id: null };

  const showSwallSuccess = () => {
    Swal.fire({
      icon: "success",
      title: MESSAGE_HTTP_CREATED,
      showConfirmButton: false,
      timer: 2000,
    });
  };

  try {
    const publicacionCreada = await axios.post(URL, publicacion, oHeaders);

    if (publicacionCreada.status === 201) {
      showSwallSuccess();
      return publicacionCreada.data || {};
    }
  } catch (error) {
    errorBackendResponse(error);
    return idDto;
  }
};

export const actualizarPublicacion = async (publicacionId, publicacion) => {
  const URL = `${BACKEND_URL}/publicaciones/${publicacionId}`;

  const showSwallSuccess = () => {
    Swal.fire({
      icon: "success",
      title: MESSAGE_HTTP_UPDATED,
      showConfirmButton: false,
      timer: 2000,
    });
  };

  try {
    const publicacionEditada = await axios.put(URL, publicacion, oHeaders);

    if (publicacionEditada.status === 200) {
      showSwallSuccess();
    }
  } catch (error) {
    errorBackendResponse(error);
  }
};

export const eliminarPublicacion = async (publicacionId) => {
  const URL = `${BACKEND_URL}/publicaciones/${publicacionId}`;

  const showSwallSuccess = () => {
    Swal.fire({
      icon: "success",
      title: MESSAGE_HTTP_DELETED,
      showConfirmButton: false,
      timer: 2000,
    });
  };

  try {
    const publicacionEliminada = await axios.delete(URL, oHeaders);

    console.log(publicacionEliminada);

    if (publicacionEliminada.status === 200) {
      showSwallSuccess();
    }
  } catch (error) {
    errorBackendResponse(error);
  }
};
