import swal from "@components/swal/swal";

const ERROR_BUSINESS = import.meta.env.VITE_ERROR_BUSINESS;
const ERROR_MESSAGE = import.meta.env.VITE_ERROR_MESSAGE;

export const showErrorBackEnd = (HTTP_MSG, rta) => {
  try {
    if (rta && rta.tipo && rta.descripcion && rta.ticket) {
      if (rta.tipo === ERROR_BUSINESS) {
        swal.showError(rta.descripcion);
      } else {
        swal.showError(`${ERROR_MESSAGE} ${rta.ticket}`);
      }
    } else {
      swal.showError(HTTP_MSG);
    }
  } catch (error) {
    console.log("showErrorBackEnd - catch() - rta:" + JSON.stringify(rta));
    console.log(
      "showErrorBackEnd - catch() -  - error: " + JSON.stringify(error)
    );

    swal.showError(HTTP_MSG);
  }
};
