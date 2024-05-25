import { axiosCrud } from '@components/axios/axiosCrud';
import { showErrorBackEnd } from '@/components/axios/showErrorBackEnd';
import swal from '@/components/swal/swal';

const HTTP_MSG_ALTA = import.meta.env.VITE_HTTP_MSG_ALTA;
const HTTP_MSG_ALTA_ERROR = import.meta.env.VITE_HTTP_MSG_ALTA_ERROR;
const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;

export const getRamo = async () => {
  const URL = '/empresa/public/ramo';
  try {
    const data = await axiosCrud.consultar(URL);
    return data || [];
  } catch (error) {
    showErrorBackEnd(
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`,
      error,
    );
    return [];
  }
};

export const registrarEmpresa = async (registro) => {
  const URL = '/usuario/empresa/public/';

  try {
    const data = await axiosCrud.crear(URL, registro);
    if (data && data.id) {
      console.log('Empresa registrada');
      swal.showSuccess(HTTP_MSG_ALTA);
      return data;
    }
    throw data;
  } catch (error) {
    showErrorBackEnd(HTTP_MSG_ALTA_ERROR, error);
    return error.descripcion
      .match(/\[(.*?)\]/)[1]
      .replace(/^\{|\}$/g, '')
      .split(', ')
      .map((error) => error.split('=')[0]);
  }
};
