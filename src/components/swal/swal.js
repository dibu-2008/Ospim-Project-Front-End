import Swal from 'sweetalert2';

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
      showConfirmButton: false,
      timer: 3000,
    });
  } catch (error) {
    console.log('showSwalError-ERROR:');
    console.log(error);
  }
};

const showSwalErrorBusiness = (descripcion) => {
  try {
    console.log('showSwalError - descripcion:' + descripcion);
    Swal.fire({
      icon: 'error',
      title: 'Error de Validación',
      text: descripcion,
      showConfirmButton: true,
      confirmButtonText: 'Aceptar',
      //timer: 3000,
    });
  } catch (error) {
    console.log('showSwalError-ERROR:');
    console.log(error);
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
};

export default swal;
