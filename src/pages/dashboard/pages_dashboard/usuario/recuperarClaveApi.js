import { axiosCrud } from '@components/axios/axiosCrud';
import swal from '@/components/swal/swal';

const tokenConsul = async (token) => {
  const sUrl = `/auth/usuario/recupera-clave/token/${token}`;
  const response = await axiosCrud.consultar(sUrl);
  console.log('tokenConsul - sUrl: ', sUrl);
  console.log('tokenConsul - response: ', response);
  return response;
};

const activar = async (token) => {
  const sUrl = `public/usuario/activar/${token}`;
  console.log('axiosUsuaEmpreActivacion - sUrl: ', sUrl);

  const response = await axiosCrud.crear(sUrl, null);
  console.log('*** axiosUsuaEmpreActivacion - response: ', response);

  return response;
};

export const axiosUsuaEmpreActivacion = {
  activar: (token) => {
    return activar(token);
  },
  consultar: (token) => {
    return tokenConsul(token);
  },
};
