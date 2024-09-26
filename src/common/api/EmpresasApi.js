import { axiosCrud } from '@components/axios/axiosCrud';
import swal from '@components/swal/swal';
const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;

export const consultarEmpresas = async () => {
  const URL = '/empresa';
  try {
    const data = await axiosCrud.consultar(URL);
    return data || [];
  } catch (error) {
    swal.showErrorBackEnd(
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`,
      error,
    );
    return [];
  }
};

export const consultarEmpresa = async (cuit) => {
  const URL = `/empresa/?cuit=${cuit}`;
  try {
    const data = await axiosCrud.consultar(URL);
    return data || null;
  } catch (error) {
    swal.showErrorBackEnd(
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`,
      error,
    );
    return null;
  }
};