import {
  consultar,
  crear,
  actualizar,
  eliminar,
} from "@components/axios/axiosCrud";

const URL_ENTITY = "/feriados";

export const consultarFeriados = async () => {
  try {
    const data = await consultar(URL_ENTITY);

    //const data = await response.data;
    console.log("xx-feriadosData: ");
    console.log(data);

    return data || [];
  } catch (error) {
    console.log("obtenerFeriados() - ERROR-catch - error: ");
    console.log(error);
    return [];
  }
};

export const crearFeriado = async (nuevoFeriado) => {
  try {
    const data = await crear(URL_ENTITY, nuevoFeriado);
    const id = ({ id } = data);
    showSwallSuccess(MESSAGE_HTTP_CREATED);
    return id;
  } catch (error) {
    errorBackendResponse(error);
    return {};
  }
};

export const actualizarFeriado = async (idFeriado, feriado) => {
  try {
    const bResponse = await actualizar(URL_ENTITY, idFeriado, feriado);
    console.log("actualizarFeriado - bResponse:");
    console.log(bResponse);
    if (bResponse) {
      showSwallSuccess(MESSAGE_HTTP_UPDATED);
      return true;
    }
  } catch (error) {
    errorBackendResponse(error);
  }
  return false;
};

export const eliminarFeriado = async (idFeriado) => {
  try {
    const bResponse = await eliminar(URL_ENTITY, idFeriado);

    if (bResponse) {
      showSwallSuccess(MESSAGE_HTTP_DELETED);
    }
  } catch (error) {
    errorBackendResponse(error);
  }
};
