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

const URL_ENTITY = "/empresa/restringida";

const showSwallSuccess = (MESSAGE_HTTP) => {
  Swal.fire({
    icon: "success",
    title: MESSAGE_HTTP,
    showConfirmButton: false,
    timer: 2000,
  });
};

export const consultarCuitRestringido = async () => {
  try {
    const data = await consultar(URL_ENTITY);
    return data || [];
  } catch (error) {
    console.log(
      "consultarCuitsRestringidos() - ERROR-catch - error: " +
        JSON.stringify(data)
    );
    return [];
  }
};

export const crearCuitRestringido = async (nuevoReg) => {
  try {
    const data = await crear(URL_ENTITY, nuevoReg);
    console.log("crearCuitRestringido - data: " + JSON.stringify(data));
    if (data && data.id) {
      console.log("crearCuitRestringido - data.id: " + data.id);
      showSwallSuccess(HTTP_MSG_ALTA);
      console.log("crearCuitRestringido - PRE RETURN - data: " + data);
      return data;
    } else {
      showErrorBackeEnd(HTTP_MSG_ALTA_ERROR, data);
      console.log("crearCuitRestringido - ERROR - return {}   ");
      return {};
    }
  } catch (error) {
    console.log(
      `crearCuitRestringido() - ERROR 1 - nuevoReg: ${JSON.stringify(
        nuevoReg
      )} - error: ${JSON.stringify(error)}`
    );
    return {};
  }
};

export const actualizarCuitRestringido = async (reg) => {
  try {
    const response = await actualizar(URL_ENTITY, reg);
    console.log(
      "actualizarCuitRestringido - response:" + JSON.stringify(response)
    );
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

export const eliminarCuitRestringido = async (id) => {
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
