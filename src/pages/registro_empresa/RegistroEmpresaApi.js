const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import axios from "axios";
import Swal from "sweetalert2";
import { errorBackendResponse } from "../../errors/errorBackendResponse";

export const getRamo = async () => {
  const URL = `${BACKEND_URL}/empresa/public/ramo`;

  const showSwalError = (descripcion) => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: descripcion,
      showConfirmButton: false,
      timer: 3000,
    });
  };

  try {
    const ramoResponse = await axios.get(URL);
    const ramos = await ramoResponse.data;

    return ramos || [];
  } catch (error) {
    errorBackendResponse(error, showSwalError);
  }
};

export const registrarEmpresa = async (usuarioEmpresa) => {
  const URL = `${BACKEND_URL}/usuario/empresa/public`;

  const showSwalError = (descripcion) => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: descripcion,
      showConfirmButton: false,
      timer: 3000,
    });
  };

  const showSwalSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "registro dado de alta con exito",
      showConfirmButton: false,
      timer: 3000,
    });
  };

  try {
    const empresaRegistrada = await axios.post(URL, usuarioEmpresa);

    if (empresaRegistrada.status === 201) {
      console.log("Empresa registrada");
      showSwalSuccess();
    }
  } catch (error) {
    errorBackendResponse(error, showSwalError);
  }
};
