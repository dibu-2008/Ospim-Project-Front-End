import oAxios from "@components/axios/axiosInstace";

export const consultar = async (UrlApi) => {
  try {
    const response = await oAxios.get(UrlApi);
    const data = await response.data;
    console.log(data);
    return data || [];
  } catch (error) {
    console.log(
      `axiosCrud.consultar() - ERROR - UrlApi: ${UrlApi} - error: ${JSON.stringify(
        error
      )}`
    );
    return [];
  }
};

export const crear = async (UrlApi, oEntidad) => {
  try {
    const response = await oAxios.post(UrlApi, oEntidad);
    if (response.status !== 201) {
      console.log(
        `axiosCrud.crear() - ERROR 2 - UrlApi: ${UrlApi} - response.status !== 201 - response: ${JSON.stringify(
          response
        )}`
      );
      return {};
    }
    return response.data || {};
  } catch (error) {
    console.log("axiosCrud.crear() - catch() - ");
    if (error && error.response && error.response.data) {
      return error.response.data;
    } else {
      console.log(
        "axiosCrud.crear() - catch() - error: " + JSON.stringify(error)
      );
      return {};
    }
  }
};

export const actualizar = async (UrlApi, oEntidad) => {
  const URL = `${UrlApi}/${oEntidad.id}`;
  try {
    const response = await oAxios.put(URL, oEntidad);
    if (response.status !== 204 && response.status !== 200) {
      //JsonServer devuelve 200
      console.log(
        `axiosCrud.actualizar() - ERROR 2 - UrlApi: ${UrlApi} - response.status !== 204 - response: ${JSON.stringify(
          response
        )} `
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
        "axiosCrud.actualizar() - catch() - error: " + JSON.stringify(error)
      );
      return false;
    }
  }
};

export const eliminar = async (UrlApi, id) => {
  const URL = `${UrlApi}/${id}`;
  try {
    const response = await oAxios.delete(URL);
    if (response.status !== 204 && response.status !== 200) {
      //JsonServer devuelve 200
      console.log(
        `axiosCrud.eliminar() - ERROR 2 - UrlApi: ${UrlApi} - response: ${response}`
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
        "axiosCrud.eliminar() - catch() - error: " + JSON.stringify(error)
      );
      return false;
    }
  }
};
