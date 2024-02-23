import { errorBackendResponse } from "../../../../errors/errorBackendResponse";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const TOKEN = JSON.parse(localStorage.getItem("stateLogin")).usuarioLogueado
  .usuario.token;
const oHeader = {
  headers: {
    Authorization: TOKEN,
  },
};

export const ObtenerDatosDeContacto = async () => {
  const contacto = {
    email: "mesadeayuda@ospim.com.ar",
    telefono: "011-4502-2075",
    whasap: "15-4569-4545",
  };
  return contacto;

  const URL = `${BACKEND_URL}/ospim/contacto`;
  console.log("ObtenerDatosDeContacto - URL: ");
  console.log(URL);

  try {
    const response = await axios.get(URL, oHeader);
    const data = await response.data;
    console.log("ObtenerDatosDeContacto - contacto: ");
    console.log(data);
    console.log("ObtenerDatosDeContacto - token: ");
    console.log(TOKEN);

    return data || [];
  } catch (error) {
    console.log("ObtenerDatosDeContacto - ERROR 11 ");
    console.log("ObtenerDatosDeContacto - ERROR - error: ");
    console.log(error);
    errorBackendResponse(error);
  }
};

export const ObtenerPublicacionesVigentes = async () => {
  const URL = `${BACKEND_URL}/publicaciones/vigentes`;

  try {
    const response = await axios.get(URL, oHeader);
    const data = await response.data;
    console.log("ObtenerPublicacionesVigentes - novedades:");
    console.log(data);

    return data || [];
  } catch (error) {
    console.log("ObtenerPublicacionesVigentes - ERROR");
    errorBackendResponse(error);
  }
};
