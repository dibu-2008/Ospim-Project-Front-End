import oAxios from "@components/axios/axiosInstace";
import Swal from "sweetalert2";
import { errorBackendResponse } from "@/errors/errorBackendResponse";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const MESSAGE_HTTP_CREATED = import.meta.env.VITE_MESSAGE_HTTP_CREATED;
const MESSAGE_HTTP_UPDATED = import.meta.env.VITE_MESSAGE_HTTP_UPDATED;
const MESSAGE_HTTP_DELETED = import.meta.env.VITE_MESSAGE_HTTP_DELETED;

const showSwallSuccess = (MESSAGE_HTTP) => {
  Swal.fire({
    icon: "success",
    title: MESSAGE_HTTP,
    showConfirmButton: false,
    timer: 2000,
  });
};

export const consultar = async (UrlApi) => {
  const URL = `${BACKEND_URL}${UrlApi}`;
  try {
    const response = await oAxios.get(URL);
    const data = await response.data;
    console.log(data);
    return data || [];
  } catch (error) {
    console.log("axiosCrud.get() - ERROR-catch - error: ");
    console.log(error);
    return [];
  }
};

export const crear = async (UrlApi, oEntidad) => {
  const URL = `${BACKEND_URL}${UrlApi}`;
  try {
    const response = await oAxios.post(URL, oEntidad);
    if (response.status === 201) {
      showSwallSuccess(MESSAGE_HTTP_CREATED);
      return response.data || {};
    }
  } catch (error) {
    console.log("xxx axiousCrud - crear - errorBackendResponse() ");
    //errorBackendResponse(error);
  }
  return {};
};

export const actualizar = async (UrlApi, idEntidad, oEntidad) => {
  const URL = `${BACKEND_URL}${UrlApi}/${idEntidad}`;
  try {
    const response = await oAxios.put(URL, oEntidad);
    console.log("response.status: ");
    console.log(response.status);
    if (response.status !== 204) {
      errorBackendResponse(response);
      return false;
    }
    showSwallSuccess(MESSAGE_HTTP_UPDATED);
    return true;
  } catch (error) {
    errorBackendResponse(error);
  }
  return false;
};

export const eliminar = async (UrlApi, idEntidad) => {
  const URL = `${BACKEND_URL}${UrlApi}/${idEntidad}`;
  try {
    const response = await oAxios.delete(URL);
    if (response.status === 200) {
      showSwallSuccess(MESSAGE_HTTP_DELETED);
      return true;
    }
  } catch (error) {
    errorBackendResponse(error);
  }
  return false;
};
