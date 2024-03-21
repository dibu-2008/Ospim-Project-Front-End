import oAxios from "@components/axios/axiosInstace";
import { axiosCrud } from "@components/axios/axiosCrud";
import { showErrorBackEnd } from "@/components/axios/showErrorBackEnd";
import swal from "@/components/swal/swal";

const HTTP_MSG_ALTA = import.meta.env.VITE_HTTP_MSG_ALTA;
const HTTP_MSG_MODI = import.meta.env.VITE_HTTP_MSG_MODI;
const HTTP_MSG_BAJA = import.meta.env.VITE_HTTP_MSG_BAJA;
const HTTP_MSG_ALTA_ERROR = import.meta.env.VITE_HTTP_MSG_ALTA_ERROR;
const HTTP_MSG_MODI_ERROR = import.meta.env.VITE_HTTP_MSG_MODI_ERROR;
const HTTP_MSG_BAJA_ERROR = import.meta.env.VITE_HTTP_MSG_BAJA_ERROR;
const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;

export const obtenerDDJJ = async () => {
    const URL = `/ddjjConsulta`;
    try {
        const data = await axiosCrud.consultar(URL);
        return data || [];
    } catch (error) {
        console.log(
            "obtenerMisDeclaracionesJuradas() - catch-error - URL: " +
            URL +
            " - status: " +
            error.status
        );

        showErrorBackEnd(
            HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`,
            error
        );
        return [];
    }
};

export const obtenerDDJJPorRango = async (fechaDesde, fechaHasta) => {

    const URL = `/ddjjConsulta/${fechaDesde}/${fechaHasta}`;
    try {
        const data = await axiosCrud.consultar(URL);
        return data || [];
    } catch (error) {
        console.log(
            "obtenerDDJJPorRange() - catch-error - URL: " +
            URL +
            " - status: " +
            error.status
        );

        showErrorBackEnd(
            HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`,
            error
        );
        return [];
    }
}

export const obtenerPorCuit = async (cuit) => {
    const URL = `/ddjjConsulta/${cuit}`;
    try {
        const data = await axiosCrud.consultar(URL);
        return data || [];
    } catch (error) {
        console.log(
            "obtenerPorCuit() - catch-error - URL: " +
            URL +
            " - status: " +
            error.status
        );

        showErrorBackEnd(
            HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`,
            error
        );
        return [];
    }
}

export const axiosDDJJEmpleado = {
    consultar: async function () {
        return obtenerDDJJ();
    },
    consultarPorRango: async function (fechaDesde, fechaHasta) {
        return obtenerDDJJPorRango(fechaDesde, fechaHasta);
    },
    consultarPorCuit: async function (cuit) {
        return obtenerPorCuit(cuit);
    }
};