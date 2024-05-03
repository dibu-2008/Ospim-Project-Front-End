import oAxios from '@components/axios/axiosInstace';

export const axiosCrud = {
  consultar: async function (UrlApi) {
    return axiosConsultar(UrlApi);
  },

  crear: async function (UrlApi, oEntidad) {
    return axiosCrear(UrlApi, oEntidad);
  },

  actualizar: async function (UrlApi, oEntidad) {
    return axiosActualizar(UrlApi, oEntidad);
  },

  eliminar: async function (UrlApi, id) {
    return axiosEliminar(UrlApi, id);
  },
};

export const axiosConsultar = async (UrlApi) => {
  try {
    const response = await oAxios.get(UrlApi);
    if (response.status != 200 && response.status != 204) {
      throw response;
    }
    const data = response.data || {};
    return data;
  } catch (error) {
    console.log(`axiosCrud.consultar() - ERROR - UrlApi: ${UrlApi} `);
    throw error;
  }
};

export const axiosCrear = async (UrlApi, oEntidad) => {
  try {
    const response = await oAxios.post(UrlApi, oEntidad);
    console.log(response.status)
    console.log(response.status !== 200)
    if (response.status !== 201 && response.status !== 200) {
      console.log(
        `axiosCrud.crear() - ERROR 2 - UrlApi: ${UrlApi} - response.status !== 201 - response: ${JSON.stringify(
          response,
        )}`,
      );
      return {};
    }
    return response.data || {};
  } catch (error) {
    console.log('axiosCrud.crear() - catch() - ');
    if (error && error.response && error.response.data) {
      return error.response.data;
    } else {
      console.log(
        'axiosCrud.crear() - catch() - error: ' + JSON.stringify(error),
      );
      return {};
    }
  }
};

export const axiosActualizar = async (UrlApi, oEntidad) => {
  const pkId = oEntidad.id;
  const URL = `${UrlApi}/${pkId}`;
  console.log(URL)
  try {
    delete oEntidad.id;
    const response = await oAxios.put(URL, oEntidad);
    oEntidad.id = pkId;
    if (
      response.status !== 204 &&
      response.status !== 200 &&
      response.status !== 201
    ) {
      //JsonServer devuelve 200
      console.log(
        `axiosCrud.actualizar() - ERROR 2 - UrlApi: ${UrlApi} - response.status !== 204 - response: ${JSON.stringify(
          response,
        )} `,
      );
      return false;
    }
    return true;
  } catch (error) {
    console.log(`axiosCrud.actualizar() - UrlApi: ${UrlApi} - catch() - `);
    if (error && error.response && error.response.data) {
      return error.response.data;
    } else {
      console.log(
        'axiosCrud.actualizar() - catch() - error: ' + JSON.stringify(error),
      );
      return false;
    }
  }
};

export const axiosEliminar = async (UrlApi, id) => {
  const URL = `${UrlApi}/${id}`;
  try {
    const response = await oAxios.delete(URL);
    console.log(response);
    if (response.status !== 204 && response.status !== 200) {
      //JsonServer devuelve 200
      console.log(
        `axiosCrud.eliminar() - ERROR 2 - UrlApi: ${UrlApi} - response: ${response}`,
      );
      return false;
    }
    return true;
  } catch (error) {
    console.log(`axiosCrud.eliminar() - UrlApi: ${UrlApi} - catch() - `);
    if (error && error.response && error.response.data) {
      return error.response.data;
    } else {
      console.log(
        'axiosCrud.eliminar() - catch() - error: ' + JSON.stringify(error),
      );
    }
    return false;
  }
};
