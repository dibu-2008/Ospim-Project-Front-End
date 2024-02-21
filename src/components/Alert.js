import Swal from "sweetalert2";

export const alertErrorShow = (descripcion) => {
  Swal.fire({
    icon: "error",
    title: "Error de validación",
    text: descripcion,
    showConfirmButton: false,
    timer: 3000,
  });
};
