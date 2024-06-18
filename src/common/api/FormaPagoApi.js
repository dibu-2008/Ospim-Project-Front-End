import { axiosCrud } from '@components/axios/axiosCrud';
import swal from '@/components/swal/swal';

const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;

export const consultarFormasPago = async () => {
  const URL = '/formas-pago';
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
