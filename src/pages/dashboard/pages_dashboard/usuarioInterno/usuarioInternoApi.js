import oAxios from '@components/axios/axiosInstace';
import swal from '@/components/swal/swal';

import { axiosEntity } from '@/components/axios/EntityCrud';

const HTTP_MSG_ALTA = import.meta.env.VITE_HTTP_MSG_ALTA;
const HTTP_MSG_MODI = import.meta.env.VITE_HTTP_MSG_MODI;
const HTTP_MSG_BAJA = import.meta.env.VITE_HTTP_MSG_BAJA;
const HTTP_MSG_ALTA_ERROR = import.meta.env.VITE_HTTP_MSG_ALTA_ERROR;
const HTTP_MSG_MODI_ERROR = import.meta.env.VITE_HTTP_MSG_MODI_ERROR;
const HTTP_MSG_BAJA_ERROR = import.meta.env.VITE_HTTP_MSG_BAJA_ERROR;
const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;

const URL_ENTITY = '/usuario/interno';

const adapterForFront = (elements) => {
  elements.forEach((element) => {
    element.notificaciones = element.notificaciones == true ? 'Si' : 'No';
  });
  return elements;
};

const adapterForBack = (element) => {
  element.notificaciones = element.notificaciones == 'Si' ? true : false;
  const { isNew, ...newElement } = element;
  return newElement;
};

export const consultar = async () => {
  const data = await axiosEntity.consultar(URL_ENTITY);
  return adapterForFront(data);
};

export const crear = async (registro) => {
  const registro_fb = adapterForBack(registro);
  return await axiosEntity.crear(URL_ENTITY, registro_fb);
};

export const actualizar = async (registro) => {
  const registro_fb = adapterForBack(registro);
  console.log(registro_fb);
  return await axiosEntity.actualizar(URL_ENTITY, registro_fb);
};

export const habilitar = async (id, habilitar) => {
  let URL;
  if (habilitar) {
    URL = `/usuario/${id}/habilitar`;
  } else {
    URL = `/usuario/${id}/deshabilitar`;
  }

  try {
    const response = await oAxios.patch(URL, { habilitado: habilitar });
    if (response.status === 200 || response.status === 204) {
      swal.showSuccess(HTTP_MSG_MODI);
    } else {
      swal.showError(HTTP_MSG_MODI_ERROR);
    }
  } catch (error) {
    swal.showErrorBackEnd(HTTP_MSG_MODI_ERROR, error);
  }
};

export const axiosUsuariosInternos = {
  consultar: async function (UrlApi) {
    return consultar(UrlApi);
  },

  crear: async function (oEntidad) {
    return crear(oEntidad);
  },

  actualizar: async function (oEntidad) {
    return actualizar(oEntidad);
  },

  habilitar: async function (id, habi) {
    return habilitar(id, habi);
  },
};