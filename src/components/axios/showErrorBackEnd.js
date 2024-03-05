import Swal from "sweetalert2";

const ERROR_BUSINESS = import.meta.env.VITE_ERROR_BUSINESS;
const ERROR_MESSAGE = import.meta.env.VITE_ERROR_MESSAGE;

const showSwalError = (descripcion) => {
  try {
    console.log("showSwalError - descripcion:" + descripcion);
    Swal.fire({
      icon: "error",
      title: "Error de Validación",
      text: descripcion,
      showConfirmButton: false,
      timer: 3000,
    });
  } catch (error) {
    console.log("showSwalError-ERROR:");
    console.log(error);
  }
};

export const showErrorBackEnd = (HTTP_MSG, rta) => {
  try {
    if (rta && rta.tipo && rta.descripcion && rta.ticket) {
      if (rta.tipo === ERROR_BUSINESS) {
        showSwalError(rta.descripcion);
      } else {
        showSwalError(`${ERROR_MESSAGE} ${rta.ticket}`);
      }
    } else {
      showSwalError(HTTP_MSG);
    }
  } catch (error) {
    console.log("showErrorBackEnd - catch() - rta:" + JSON.stringify(rta));
    console.log(
      "showErrorBackEnd - catch() -  - error: " + JSON.stringify(error)
    );

    showSwalError(HTTP_MSG);
  }
};
