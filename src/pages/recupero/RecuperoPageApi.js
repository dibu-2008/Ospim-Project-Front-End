import swal from '@/components/swal/swal';
import { axiosCrud } from '@components/axios/axiosCrud';

const RECUPERO_MSG = import.meta.env.VITE_RECUPERO_MSG;

export const recuperoClave = async (email) => {
  swal.showSuccess(RECUPERO_MSG);
  try {
    const URL = `/auth/usuario/recupera-clave/token`;
    let mailDto = { mail: email };

    const response = await axiosCrud.axiosCrear(URL, mailDto);
    return response;
  } catch (error) {
    const HTTP_MSG =
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`;
    swal.showErrorBackEnd(HTTP_MSG, error);
  }
};
