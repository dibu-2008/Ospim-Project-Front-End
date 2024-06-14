import Swal from 'sweetalert2';
import { erroresFormat } from '../axios/erroresFormat';

const showSwallSuccess = (MESSAGE_HTTP) => {
  Swal.fire({
    icon: 'success',
    title: MESSAGE_HTTP,
    showConfirmButton: false,
    timer: 2000,
  });
};

const showSwalError = (descripcion) => {
  try {
    console.log('showSwalError - descripcion:' + descripcion);
    Swal.fire({
      icon: 'error',
      title: 'Error de Validación',
      text: descripcion,
      showConfirmButton: true,
      confirmButtonText: 'Aceptar',
    });
  } catch (error) {
    console.log('showSwalError-ERROR:');
    console.log(error);
  }
};

const showSwalWarning = (descripcion) => {
  try {
    console.log('showSwalWarning - descripcion:' + descripcion);
    Swal.fire({
      icon: 'warning',
      title: 'Advertencia',
      text: descripcion,
      showConfirmButton: true,
      confirmButtonText: 'Aceptar',
    });
  } catch (error) {
    console.log('showSwalWarning-ERROR:');
    console.log(error);
  }
};

const showSwalErrorBusiness = (descripcion) => {
  try {
    Swal.fire({
      icon: 'error',
      title: 'Error de Validación',
      html: erroresFormat(descripcion),
      showConfirmButton: true,
      confirmButtonText: 'Aceptar',
      //timer: 3000,
    });
  } catch (error) {
    console.log('showSwalError-ERROR:');
    console.log(error);
  }
};

const showErrorBackEnd = (HTTP_MSG, rta) => {
  const ERROR_BUSINESS = import.meta.env.VITE_ERROR_BUSINESS;
  const ERROR_MESSAGE = import.meta.env.VITE_ERROR_MESSAGE;

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
        showSwalErrorBusiness(rta.descripcion);
      } else {
        console.log('* showErrorBackEnd - NOOO ERROR_BUSINESS');
        showSwalError(`${ERROR_MESSAGE} ${rta.ticket}`); // confirm
      }
    } else {
      console.log('* showErrorBackEnd - NOOO ticket');
      console.log(rta);
      showSwalError(HTTP_MSG);
    }
  } catch (error) {
    console.log('* showErrorBackEnd - CATCH !!! ');
    console.log('showErrorBackEnd - catch() - rta:' + JSON.stringify(rta));
    console.log(
      'showErrorBackEnd - catch() -  - error: ' + JSON.stringify(error),
    );

    showSwalError(HTTP_MSG);
  }
};

const swal = {
  showError: async function (descripcion) {
    return showSwalError(descripcion);
  },

  showErrorBusiness: async function (descripcion) {
    return showSwalErrorBusiness(descripcion);
  },

  showSuccess: async function (descripcion) {
    return showSwallSuccess(descripcion);
  },
  showWarning: async function (descripcion) {
    return showSwalWarning(descripcion);
  },
  showErrorBackEnd: async function (HTTP_MSG, rta) {
    return showErrorBackEnd(HTTP_MSG, rta);
  },
};

export default swal;
