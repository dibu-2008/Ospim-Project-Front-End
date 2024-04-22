import { showErrorBackEnd } from '@/components/axios/showErrorBackEnd';
import { axiosCrud } from '@components/axios/axiosCrud';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;

const getRoles = async () => {
  /**  "rol": [
    {
      "id": 1,
      "descripcion": "ROOT"
    },
    {
      "id": 7,
      "descripcion": "ADMINISTRATIVO"
    },
    {
      "descripcion": "CONTADURIA",
      "id": 8
    },
    {
      "descripcion": "PRUEBA III",
      "id": 9
    }
  ], */
  try {
    const URL = '/roles';
    const response = await axiosCrud.consultar(URL);
    return response;
  } catch (error) {
    const HTTP_MSG =
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`;
    showErrorBackEnd(HTTP_MSG, error);
  }
};

const getFuncionalidades = async () => {
  try {
    const URL = '/funcionalidades';
    const response = await axiosCrud.consultar(URL); // esto me tiene que devolver funcionales_activas, funcionalidades_inactivas
    return response;
  } catch (error) {
    const HTTP_MSG =
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`;
    showErrorBackEnd(HTTP_MSG, error);
  }
};

const getFuncionalidadesByRol = async () => {
    try {
      const URL = `/funcionalidades/by-rol`;
      const response = await axiosCrud.consultar(URL); // esto me tiene que devolver funcionales_activas, funcionalidades_inactivas
      return response;
    } catch (error) {
      const HTTP_MSG =
        HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`;
      showErrorBackEnd(HTTP_MSG, error);
    }
  };

export const axiosGestionRoles = {
  getRoles,
  getFuncionalidades,
  getFuncionalidadesByRol

};
