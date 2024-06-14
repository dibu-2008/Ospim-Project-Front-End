import swal from '@/components/swal/swal';
import { axiosCrud } from '@components/axios/axiosCrud';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;

const getRoles = async () => {
  try {
    const URL = '/roles';
    const response = await axiosCrud.consultar(URL);
    return response;
  } catch (error) {
    const HTTP_MSG =
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`;
    swal.showErrorBackEnd(HTTP_MSG, error);
  }
};

const getFuncionalidades = async () => {
  try {
    const URL = '/funcionalidades';
    //const URL = '/roles/funcionalidades';
    const response = await axiosCrud.consultar(URL); // esto me tiene que devolver funcionales_activas, funcionalidades_inactivas
    return response;
  } catch (error) {
    const HTTP_MSG =
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`;
    swal.showErrorBackEnd(HTTP_MSG, error);
  }
};

const getFuncionalidadesByRol = async () => {
  try {
    const URL = `/funcionalidades`;
    const response = await axiosCrud.consultar(URL); // esto me tiene que devolver funcionales_activas, funcionalidades_inactivas
    return response;
  } catch (error) {
    const HTTP_MSG =
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`;
    swal.showErrorBackEnd(HTTP_MSG, error);
  }
};

const putFuncionalidades = async (body) => {
  try {
    const URL = `/funcionalidades/actualizar`;
    //const URL = `/roles/${body.id}/funcionalidades`;
    const response = await axiosCrud.actualizar(URL, body); // esto me tiene que devolver funcionales_activas, funcionalidades_inactivas
    return response;
  } catch (error) {
    const HTTP_MSG =
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`;
    swal.showErrorBackEnd(HTTP_MSG, error);
  }
};

export const axiosGestionRoles = {
  getRoles,
  getFuncionalidades,
  getFuncionalidadesByRol,
  putFuncionalidades,
};
