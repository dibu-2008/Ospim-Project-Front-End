import swal from '@components/swal/swal';

const ERROR_BUSINESS = import.meta.env.VITE_ERROR_BUSINESS;
const ERROR_MESSAGE = import.meta.env.VITE_ERROR_MESSAGE;

export const showErrorBackEnd = (HTTP_MSG, rta) => {
  try {
    console.log('showErrorBackEnd - rta:', rta);
    if (rta.response && rta.response.data) {
      console.log(
        'showErrorBackEnd - VA A EJECUTAR: rta = rta.response.data; ???',
      );
      rta = rta.response.data;
    }
    if (rta && rta.tipo && rta.descripcion && rta.ticket) {
      console.log('* showErrorBackEnd - con ticket');
      if (rta.tipo === ERROR_BUSINESS) {
        console.log('* showErrorBackEnd - ERROR_BUSINESS');
        swal.showErrorBusiness(rta.descripcion);
      } else {
        console.log('* showErrorBackEnd - NOOO ERROR_BUSINESS');
        swal.showError(`${ERROR_MESSAGE} ${rta.ticket}`); // confirm
      }
    } else {
      console.log('* showErrorBackEnd - NOOO ticket');
      console.log(rta);
      swal.showWarning(HTTP_MSG);
    }
  } catch (error) {
    console.log('* showErrorBackEnd - CATCH !!! ');
    console.log('showErrorBackEnd - catch() - rta:' + JSON.stringify(rta));
    console.log(
      'showErrorBackEnd - catch() -  - error: ' + JSON.stringify(error),
    );

    swal.showError(HTTP_MSG);
  }
};
