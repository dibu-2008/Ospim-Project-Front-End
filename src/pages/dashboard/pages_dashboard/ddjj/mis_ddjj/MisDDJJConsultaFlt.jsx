import { useState } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import "./MisDDJJConsultaFlt.css";
import { MisDDJJConsultaGrilla } from "./grilla/MisDDJJConsultaGrilla";
import { axiosDDJJ } from "./grilla/MisDDJJConsultaGrillaApi";
import { esES } from "@mui/x-date-pickers/locales";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import localStorageService from "@/components/localStorage/localStorageService";
export const MisDDJJConsultaFlt = ({ setIdDDJJ, setTabState }) => {
  const [fltDesde, setFltDesde] = useState(null);
  const [fltHasta, setFltHasta] = useState(null);
  const [rows, setRows] = useState(null);

  const ID_EMPRESA = localStorageService.getEmpresaId();

  const handleChangeDesde = (date) => setFltDesde(date);

  const handleChangeHasta = (date) => setFltHasta(date);

  const buscarDDJJ = async () => {
    try {
      const ddjjResponse = await axiosDDJJ.consultar(ID_EMPRESA);

      if (fltDesde && fltDesde.$d && fltHasta && fltHasta.$d) {
        const { $d: $desde } = fltDesde;
        const { $d: $hasta } = fltHasta;

        const fechaDesde = new Date($desde);
        fechaDesde.setDate(1);
        fechaDesde.setUTCHours(0, 0, 0, 0);
        const fechaIsoDesde = fechaDesde.toISOString();

        const fechaHasta = new Date($hasta);
        fechaHasta.setDate(1);
        fechaHasta.setUTCHours(0, 0, 0, 0);
        const fechaIsoHasta = fechaHasta.toISOString();

        const declaracionesFiltradas = ddjjResponse.filter((ddjj) => {
          const fecha = new Date(ddjj.periodo);
          return (
            fecha >= new Date(fechaIsoDesde) && fecha <= new Date(fechaIsoHasta)
          );
        });

        const rowsCastedas = castearMisDDJJ(declaracionesFiltradas);
        console.log("buscarDDJJ - declaracionesFiltradas - rowsCastedas: ");
        console.log(rowsCastedas);

        setRows(rowsCastedas);
        console.log("buscarDDJJ - declaracionesFiltradas: ");
        console.log(declaracionesFiltradas);
      } else {
        console.log("buscarDDJJ - ddjjResponse: ");
        console.log(ddjjResponse);
        const rowsCastedas = castearMisDDJJ(ddjjResponse);

        console.log("buscarDDJJ - declaracionesFiltradas - rowsCastedas: ");
        console.log(rowsCastedas);
        setRows(rowsCastedas);
      }
    } catch (error) {
      console.error("Error al buscar declaraciones juradas:", error);
    }
  };

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

  return (
    <div>
      <div className="mis_declaraciones_juradas_container">
        <Stack
          spacing={4}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale={"es"}
            localeText={
              esES.components.MuiLocalizationProvider.defaultProps.localeText
            }
          >
            <DemoContainer components={["DatePicker"]}>
              <DesktopDatePicker
                label={"Periodo desde"}
                views={["month", "year"]}
                closeOnSelect={true}
                onChange={handleChangeDesde}
                value={fltDesde}
              />
            </DemoContainer>
          </LocalizationProvider>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale={"es"}
            localeText={
              esES.components.MuiLocalizationProvider.defaultProps.localeText
            }
          >
            <DemoContainer components={["DatePicker"]}>
              <DesktopDatePicker
                label={"Periodo hasta"}
                views={["month", "year"]}
                closeOnSelect={true}
                onChange={handleChangeHasta}
                value={fltHasta}
              />
            </DemoContainer>
          </LocalizationProvider>
        </Stack>

        <Stack
          spacing={4}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Button onClick={buscarDDJJ} variant="contained">
            Buscar
          </Button>
        </Stack>
      </div>
      <Stack direction="row" justifyContent="center" alignItems="center">
        <MisDDJJConsultaGrilla
          rows={rows || []}
          setRows={setRows}
          setTabState={setTabState}
          setIdDDJJ={setIdDDJJ}
        />
      </Stack>
    </div>
  );
};
