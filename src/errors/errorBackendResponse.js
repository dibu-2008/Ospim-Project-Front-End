const ERROR_BUSINESS = import.meta.env.VITE_ERROR_BUSINESS;
const ERROR_MESSAGE = import.meta.env.VITE_ERROR_MESSAGE;
const ERROR_BODY = import.meta.env.VITE_ERROR_BODY;

export const errorBackendResponse = (error, showSwalError) => {
  try {
    if (error.response && error.response.data) {
      const { codigo, descripcion, ticket, tipo } = error.response.data;

      if (tipo === ERROR_BUSINESS) {
        showSwalError(descripcion);
        console.error(descripcion);
      } else {
        showSwalError(`${ERROR_MESSAGE} ${ticket}`);
        console.error("Ticket: " + ticket + " - Descripcion: " + descripcion);
      }
    } else {
      showSwalError(`${ERROR_MESSAGE}`);
      console.error(`${ERROR_BODY} : ${error}`);
    }
  } catch (error) {
    showSwalError(`${ERROR_MESSAGE}`);
    console.error(`${ERROR_BODY} : ${error}`);
  }
};
