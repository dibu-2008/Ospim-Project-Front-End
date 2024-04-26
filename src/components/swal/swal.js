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
  showWarning: async function (descripcion) {
    return showSwalWarning(descripcion);
  },
};

export default swal;
