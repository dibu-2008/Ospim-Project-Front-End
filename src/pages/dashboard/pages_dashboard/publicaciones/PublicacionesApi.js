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

const URL_ENTITY = "/publicaciones";

const showSwallSuccess = (MESSAGE_HTTP) => {
  Swal.fire({
    icon: "success",
    title: MESSAGE_HTTP,
    showConfirmButton: false,
    timer: 2000,
  });
};

export const consultarPublicaciones = async () => {
  try {
    const data = await consultar(URL_ENTITY);
    return data || [];
  } catch (error) {
    return [];
  }
};

export const crearPublicacion = async (nuevoReg) => {
  try {
    const data = await crear(URL_ENTITY, nuevoReg);
    if (data && data.id) {
      showSwallSuccess(HTTP_MSG_ALTA);
      return data;
    } else {
      showErrorBackeEnd(HTTP_MSG_ALTA_ERROR, data);
      return {};
    }
  } catch (error) {
    console.log(
      `crearCuitRestringido() - ERROR 1 - nuevoReg: ${JSON.stringify(
        nuevoReg
      )} - error: ${JSON.stringify(error)}`
    );
    console.log("crearCuitRestringido - ERROR - return {}   ");
    return {};
  }
};

export const actualizarPublicacion = async (reg) => {
  try {
    const response = await actualizar(URL_ENTITY, reg);
    if (response == true) {
      showSwallSuccess(HTTP_MSG_MODI);
      return true;
    } else {
      showErrorBackeEnd(HTTP_MSG_MODI_ERROR, response);
      return false;
    }
  } catch (error) {
    console.log(
      `actualizarCuitRestringido() - ERROR 1 - error: ${JSON.stringify(error)}`
    );
    return false;
  }
};

export const eliminarPublicacion = async (id) => {
  try {
    const response = await eliminar(URL_ENTITY, id);

    if (response == true) {
      showSwallSuccess(HTTP_MSG_BAJA);
      return true;
    } else {
      showErrorBackeEnd(HTTP_MSG_BAJA_ERROR, response);
      return false;
    }
  } catch (error) {
    console.log(
      `eliminarCuitRestringido() - ERROR 1 - error: ${JSON.stringify(error)}`
    );
    return false;
  }
};
