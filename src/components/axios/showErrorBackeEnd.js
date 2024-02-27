const ERROR_BUSINESS = import.meta.env.VITE_ERROR_BUSINESS;
const ERROR_MESSAGE = import.meta.env.VITE_ERROR_MESSAGE;

const showSwalError = (descripcion) => {
  Swal.fire({
    icon: "error",
    title: "Error de Validación",
    text: descripcion,
    showConfirmButton: false,
    timer: 3000,
  });
};

export const showErrorBackeEnd = (HTTP_MSG, rta) => {
  try {
    console.log("typeof: " + typeof rta);
    if (rta && rta.tipo && rta.descripcion && rta.ticket) {
      console.log("emitirError - IF => TRUE !! ");
      if (rta.tipo === ERROR_BUSINESS) {
        console.log("emitirError - showSwalError => " + rta.descripcion);
        showSwalError("" + rta.descripcion);
      } else {
        console.log("emitirError - showSwalError => " + rta.ticket);
        showSwalError(`${ERROR_MESSAGE} ${rta.ticket}`);
      }
      console.log("emitirError - return TRUE - ");
    } else {
      console.log("emitirError - return FALSE - ");
      showSwalError(HTTP_MSG);
    }
  } catch (error) {
    console.log(
      "emitirError - ERROR - rta:" +
        JSON.stringify(rta) +
        " - error: " +
        JSON.stringify(error)
    );
    showSwalError(HTTP_MSG);
  }
};
