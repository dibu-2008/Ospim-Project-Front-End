import oAxios from "@components/axios/axiosInstace";
import { axiosCrud } from "@components/axios/axiosCrud";
import { showErrorBackEnd } from "@/components/axios/showErrorBackEnd";
import { presentar } from "@/pages/dashboard/pages_dashboard/ddjj/DDJJApi";
import swal from "@/components/swal/swal";

const HTTP_MSG_ALTA = import.meta.env.VITE_HTTP_MSG_ALTA;
const HTTP_MSG_MODI = import.meta.env.VITE_HTTP_MSG_MODI;
const HTTP_MSG_BAJA = import.meta.env.VITE_HTTP_MSG_BAJA;
const HTTP_MSG_ALTA_ERROR = import.meta.env.VITE_HTTP_MSG_ALTA_ERROR;
const HTTP_MSG_MODI_ERROR = import.meta.env.VITE_HTTP_MSG_MODI_ERROR;
const HTTP_MSG_BAJA_ERROR = import.meta.env.VITE_HTTP_MSG_BAJA_ERROR;
const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;

export const obtenerAfiliados = async (cuil) => {
  const URL = `/afiliados/cuil/${cuil}`;
  try {
    const data = await axiosCrud.consultar(URL);
    return data || [];
  } catch (error) {
    showErrorBackEnd(
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`,
      error
    );
    return [];
  }
};

export const obtenerCamaras = async () => {
  const URL = "/camara";
  try {
    const data = await axiosCrud.consultar(URL);
    return data || [];
  } catch (error) {
    showErrorBackEnd(
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`,
      error
    );
    return [];
  }
};

export const obtenerCategorias = async () => {
  const URL = "camara/categoria";
  try {
    const data = await axiosCrud.consultar(URL);
    return data || [];
  } catch (error) {
    showErrorBackEnd(
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`,
      error
    );
    return [];
  }
};

export const obtenerPlantaEmpresas = async (empresaId) => {
  const URL = `/empresa/${empresaId}/domicilio/planta`;
  try {
    const data = await axiosCrud.consultar(URL);
    return data || [];
  } catch (error) {
    showErrorBackEnd(
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`,
      error
    );
    return [];
  }
};

export const crearAltaDeclaracionJurada = async (empresaId, registro) => {
  const URL = `/empresa/${empresaId}/ddjj`;
  try {
    const data = await axiosCrud.crear(URL, registro);
    if (data && data.id) {
      swal.showSuccess(HTTP_MSG_ALTA);
      return data;
    }
    throw data;
  } catch (error) {
    showErrorBackEnd(HTTP_MSG_ALTA_ERROR, error);
    return {};
  }
};

export const actualizarDeclaracionJurada = async (empresaId, registro) => {
  const URL = `/empresa/${empresaId}/ddjj`;
  console.log(URL);
  console.log("DENTRO DE LA FUNCION ACTUALIZAR DDJJ ", registro);
  try {
    const response = await axiosCrud.actualizar(URL, registro);
    if (response == true) {
      swal.showSuccess(HTTP_MSG_MODI);
      return true;
    }
    throw response;
  } catch (error) {
    showErrorBackEnd(HTTP_MSG_MODI_ERROR, error);
    return false;
  }
};

export const validarAltaDeclaracionJurada = async (empresaId, registro) => {
  const URL = `/empresa/${empresaId}/ddjj/validar`;
  console.log(URL);
  try {
    const validarDDJJResponse = await oAxios.post(URL, registro);
    return validarDDJJResponse.data || [];
  } catch (error) {
    if (error.response && error.response.data) {
      const { errores, codigo, descripcion, ticket, tipo } =
        error.response.data;
      return errores || [];
    }
  }
};

export const validaCuil = async (empresaId, cuiles) => {
  const URL = `/empresa/${empresaId}/ddjj/upload/nomina/validaCuil`;
  console.log(cuiles);
  try {
    const validarCuilesResponse = await oAxios.post(URL, cuiles);
    return validarCuilesResponse.data || [];
  } catch (error) {
    if (error.response && error.response.data) {
      const { errores, codigo, descripcion, ticket, tipo } =
        error.response.data;
      return errores || [];
    }
  }
};

export const axiosDDJJ = {
  getCamaras: async function () {
    return obtenerCamaras();
  },

  getCategorias: async function () {
    return obtenerCategorias();
  },

  getAfiliado: async function (cuil) {
    return obtenerAfiliados(cuil);
  },

  getPlantas: async function (empresaId) {
    return obtenerPlantaEmpresas(empresaId);
  },

  crear: async function (empresaId, registro) {
    return crearAltaDeclaracionJurada(empresaId, registro);
  },

  actualizar: async function (empresaId, registro) {
    return actualizarDeclaracionJurada(empresaId, registro);
  },

  validar: async function (empresaId, registro) {
    return validarAltaDeclaracionJurada(empresaId, registro);
  },
  validarCuiles: async function (empresaId, cuiles) {
    return validaCuil(empresaId, cuiles);
  },

  presentar: async function (empresaId, ddjjId) {
    return presentar(empresaId, ddjjId);
  },
};
