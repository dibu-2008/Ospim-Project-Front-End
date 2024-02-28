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
      console.log("showErrorBackeEnd - IF => TRUE !! ");
      if (rta.tipo === ERROR_BUSINESS) {
        console.log(
          "showErrorBackeEnd - showSwalError => rta.descripcion: " +
            rta.descripcion
        );
        showSwalError("" + rta.descripcion);
      } else {
        console.log(
          "showErrorBackeEnd - showSwalError => rta.ticket:" + rta.ticket
        );
        showSwalError(`${ERROR_MESSAGE} ${rta.ticket}`);
      }
      console.log("emitirError - return TRUE - ");
    } else {
      console.log("emitirError - return FALSE - ");
      showSwalError(HTTP_MSG);
    }
  } catch (error) {
    console.log("showErrorBackeEnd - catch() - rta:" + JSON.stringify(rta));
    console.log(
      "showErrorBackeEnd - catch() -  - error: " + JSON.stringify(error)
    );

    showSwalError(HTTP_MSG);
  }
};
