import { useState } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import "./MisDDJJConsulta.css";
import { MisDDJJConsultaGrilla, castearMisDDJJ } from "./grilla/MisDDJJConsultaGrilla";
import { axiosDDJJ } from "./grilla/MisDDJJConsultaGrillaApi";
import { esES } from "@mui/x-date-pickers/locales";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { CSVLink, CSVDownload } from "react-csv";
import localStorageService from "@/components/localStorage/localStorageService";
export const MisDDJJConsulta = ({
  setDDJJState,
  setPeriodo,
  rows_mis_ddjj,
  setRowsMisDdjj,
  setTabState,
  setRowsAltaDDJJ,
  setPeticion,
}) => {
  const [desde, setDesde] = useState(null);
  const [hasta, setHasta] = useState(null);
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState(0);
  const [occupation, setOccupation] = useState("");
  const [data, setData] = useState([
    ["Full Name", "Age", "Occupation"],
    ["Irakli Tchigladze", 32, "writer"],
    ["George Abuladze", 33, "politician"],
    ["Nick Tsereteli", 19, "public worker"],
  ]);

  const ID_EMPRESA = localStorageService.getEmpresaId();

  const handleChangeDesde = (date) => setDesde(date);

  const handleChangeHasta = (date) => setHasta(date);

  const buscarDeclaracionesJuradas = async () => {
    try {
      const ddjjResponse = await axiosDDJJ.consultar(ID_EMPRESA);
      setRowsMisDdjj(ddjjResponse);
      console.log("ddjjResponse", ddjjResponse);
      if (desde && desde.$d && hasta && hasta.$d) {
        const { $d: $desde } = desde;
        const { $d: $hasta } = hasta;

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
        console.log("declaracionesFiltradas", declaracionesFiltradas)

        const declaracionesFiltradasCasteadas = castearMisDDJJ(declaracionesFiltradas);
        console.log("declaracionesFiltradasCasteadas", declaracionesFiltradasCasteadas)

        setRowsMisDdjj(declaracionesFiltradas);
      } else {

        const declaracionesFiltradasCasteadas = castearMisDDJJ(ddjjResponse);
        console.log("declaracionesFiltradasCasteadas", declaracionesFiltradasCasteadas)
        
        setRowsMisDdjj(ddjjResponse);

      }
    } catch (error) {
      console.error("Error al buscar declaraciones juradas:", error);
    }
  };

  const exportarDeclaracionesJuradas = () => {
    console.log("Exportar declaraciones juradas");
  };

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
                value={desde}
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
                value={hasta}
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
          <Button onClick={buscarDeclaracionesJuradas} variant="contained">
            Buscar
          </Button>

          <CSVLink data={data}>
            <Button variant="contained" onClick={exportarDeclaracionesJuradas}>
              Exportar CSV
            </Button>
          </CSVLink>
        </Stack>
      </div>
      <Stack direction="row" justifyContent="center" alignItems="center">
        <MisDDJJConsultaGrilla
          setDDJJState={setDDJJState}
          setPeriodo={setPeriodo}
          rows_mis_ddjj={rows_mis_ddjj}
          setRowsMisDdjj={setRowsMisDdjj}
          setTabState={setTabState}
          setRowsAltaDDJJ={setRowsAltaDDJJ}
          setPeticion={setPeticion}
        />
      </Stack>
    </div>
  );
};
