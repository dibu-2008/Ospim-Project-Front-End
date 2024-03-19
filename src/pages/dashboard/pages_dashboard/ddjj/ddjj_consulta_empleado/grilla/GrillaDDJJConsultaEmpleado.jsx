import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosDDJJ } from '../../mis_ddjj/grilla/GrillaMisDeclaracionesJuradasApi';
import localStorageService from '@/components/localStorage/localStorageService';

function misDDJJColumnaAporteGet(ddjjResponse) {
    //toma todas las ddjj de la consulta de "Mis DDJJ" y arma "vector de Columnas Aportes"
    //Ejemplo: ['UOMACU', 'ART46', 'UOMASC']
    let vecAportes = ddjjResponse.map((item) => item.aportes).flat();
    let colAportes = vecAportes.reduce((acc, item) => {
        if (!acc.includes(item.codigo)) {
            acc.push(item.codigo);
        }
        return acc;
    }, []);
    return colAportes;
}

function ddjjTotalesAportes(ddjj, colAportes) {
    //toma una ddjj de la consulta de "Mis DDJJ" y arma "vector de Columnas Totales por Aportes"

    let vecAportes = ddjj.aportes;

    let vecAportesConTotales = [];
    colAportes.forEach((element) => {
        vecAportesConTotales.push({ codigo: element, importe: 0 });
    });

    vecAportes.forEach((aporte) => {
        vecAportesConTotales.forEach((total) => {
            if (total.codigo == aporte.codigo) {
                total.importe = total.importe + aporte.importe;
            }
        });
    });
    return vecAportesConTotales;
}

function castearMisDDJJ(ddjjResponse) {
    let colAportes = misDDJJColumnaAporteGet(ddjjResponse);
    ddjjResponse.forEach((dj) => {
        let colAportesConTotales = ddjjTotalesAportes(dj, colAportes);

        colAportesConTotales.forEach((regTot) => {
            dj["total" + regTot.codigo] = regTot.importe;
        });
    });
    return ddjjResponse;
}

export const GrillaDDJJConsultaEmpleado = (rowsMisDDJJ, setRowsMisDDJJ) => {

    const [rowModesModel, setRowModesModel] = useState({});
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0,
    });

    const idEmpresa = localStorageService.getEmpresaId();

    let colAportes = [];

    const navigate = useNavigate();

    useEffect(() => {
        const ObtenerMisDeclaracionesJuradas = async () => {
            let ddjjResponse = await axiosDDJJ.consultar(idEmpresa);

            //Agrego las columnas deTotales de Aportes
            ddjjResponse = await castearMisDDJJ(ddjjResponse);

            // setRowsMisDDJJ(ddjjResponse.map((item) => ({ id: item.id, ...item })));
        };

        ObtenerMisDeclaracionesJuradas();
    }, []);



    return (
        <div>GrillaDDJJConsultaEmpleado</div>
    )
}
