import {
  consultar,
  crear,
  actualizar,
  eliminar,
} from "@components/axios/axiosCrud";
import { showErrorBackeEnd } from "@components/axios/showErrorBackeEnd";
import Swal from "sweetalert2";

const HTTP_MSG_ALTA = import.meta.env.VITE_HTTP_MSG_ALTA;
const HTTP_MSG_MODI = import.meta.env.VITE_HTTP_MSG_MODI;
const HTTP_MSG_BAJA = import.meta.env.VITE_HTTP_MSG_BAJA;
const HTTP_MSG_ALTA_ERROR = import.meta.env.VITE_HTTP_MSG_ALTA_ERROR;
const HTTP_MSG_MODI_ERROR = import.meta.env.VITE_HTTP_MSG_MODI_ERROR;
const HTTP_MSG_BAJA_ERROR = import.meta.env.VITE_HTTP_MSG_BAJA_ERROR;

const URL_ENTITY = "/feriados";

const showSwallSuccess = (MESSAGE_HTTP) => {
  Swal.fire({
    icon: "success",
    title: MESSAGE_HTTP,
    showConfirmButton: false,
    timer: 2000,
  });
};

export const consultarFeriados = async () => {
  try {
    const data = await consultar(URL_ENTITY);
    return data || [];
  } catch (error) {
    console.log(
      "obtenerFeriados() - ERROR-catch - error: " + JSON.stringify(data)
    );
    return [];
  }
};

export const crearFeriado = async (nuevoReg) => {
  try {
    console.log("crearFeriado - nuevoReg: " + JSON.stringify(nuevoReg));
    const data = await crear(URL_ENTITY, nuevoReg);
    if (data && data.id) {
      showSwallSuccess(HTTP_MSG_ALTA);
      return data;
    } else {
      showErrorBackeEnd(HTTP_MSG_ALTA_ERROR, data);
      return {};
    }
  } catch (error) {
    console.log("error:");
    console.log(error);
    console.log(
      `crearFeriado() - ERROR 1 - nuevoReg: ${JSON.stringify(
        nuevoReg
      )} - error: ${JSON.stringify(error)}`
    );
    return {};
  }
};

export const actualizarFeriado = async (idFeriado, feriado) => {
  try {
    const response = await actualizar(URL_ENTITY, idFeriado, feriado);
    if (response == true) {
      showSwallSuccess(HTTP_MSG_MODI);
      return true;
    } else {
      showErrorBackeEnd(HTTP_MSG_MODI_ERROR, response);
      return false;
    }
  } catch (error) {
    console.log(
      `actualizarFeriado() - ERROR 1 - error: ${JSON.stringify(error)}`
    );
    return false;
  }
};

export const eliminarFeriado = async (idFeriado) => {
  try {
    const response = await eliminar(URL_ENTITY, idFeriado);

    if (response == true) {
      showSwallSuccess(HTTP_MSG_BAJA);
      return true;
    } else {
      showErrorBackeEnd(HTTP_MSG_BAJA_ERROR, response);
      return false;
    }
  } catch (error) {
    console.log(
      `eliminarFeriado() - ERROR 1 - error: ${JSON.stringify(error)}`
    );
    return false;
  }
};
