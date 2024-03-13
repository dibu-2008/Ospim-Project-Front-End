import { useState } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import "./ConsultaMisDDJJ.css";
import { GrillaMisDeclaracionesJuradas } from "./grilla/GrillaMisDeclaracionesJuradas";
import { axiosDDJJ } from "./grilla/GrillaMisDeclaracionesJuradasApi";
import { esES } from "@mui/x-date-pickers/locales";
import dayjs from "dayjs";
import esLocale from "dayjs/locale/es";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { CSVLink, CSVDownload } from "react-csv";
import localStorageService from "@/components/localStorage/localStorageService";
export const MisDeclaracionesJuradas = ({
  setDDJJState,
  rows_mis_ddjj,
  setRowsMisDdjj,
  setTabState,
  setPeriodo,
  handleAcceptPeriodoDDJJ,
  rowsAltaDDJJ,
  setRowsAltaDDJJ,
  setPeticion,
  setIdDDJJ,
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
  const handleSubmit = (e) => {
    setData([...data, [fullName, age, occupation]]);
    setFullName("");
    setAge(0);
    setOccupation("");
  };
  const ID_EMPRESA = localStorageService.getEmpresaId();

  const handleChangeDesde = (date) => setDesde(date);

  const handleChangeHasta = (date) => setHasta(date);

  const buscarDeclaracionesJuradas = async () => {
    try {
      const ddjjResponse = await axiosDDJJ.consultar(ID_EMPRESA);

      if (desde && desde.$d && hasta && hasta.$d) {
        const { $d: $desde } = desde;
        const { $d: $hasta } = hasta;

        const fechaDesde = new Date($desde);
        fechaDesde.setDate(1); // Seteamos el día del mes a 1
        fechaDesde.setUTCHours(0, 0, 0, 0); // Ajustamos la zona horaria a UTC
        const fechaIsoDesde = fechaDesde.toISOString(); // Convertimos la fecha a ISO

        const fechaHasta = new Date($hasta);
        fechaHasta.setDate(1); // Seteamos el día del mes a 1
        fechaHasta.setUTCHours(0, 0, 0, 0); // Ajustamos la zona horaria a UTC
        const fechaIsoHasta = fechaHasta.toISOString(); // Convertimos la fecha a ISO

        const declaracionesFiltradas = ddjjResponse.filter((ddjj) => {
          const fecha = new Date(ddjj.periodo);
          return (
            fecha >= new Date(fechaIsoDesde) && fecha <= new Date(fechaIsoHasta)
          );
        });
        setRowsMisDdjj(declaracionesFiltradas);
      }
    } catch (error) {
      console.error("Error al buscar declaraciones juradas:", error);
    }
  };

  const exportarDeclaracionesJuradas = () => {
    console.log("Exportar declaraciones juradas");
    //console.log(rows_mis_ddjj);
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
                closeOnSelect={false}
                onChange={handleChangeDesde}
                value={desde}
                slotProps={{ actionBar: { actions: ["cancel", "accept"] } }}
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
                closeOnSelect={false}
                onChange={handleChangeHasta}
                value={hasta}
                slotProps={{ actionBar: { actions: ["cancel", "accept"] } }}
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
          <Button variant="contained" onClick={exportarDeclaracionesJuradas}>
            Exportar
          </Button>
          <CSVLink data={data}>Exportar CSV</CSVLink>
          {/* <CSVLink data={csvData} filename={"misddjj.csv"}>Download me</CSVLink>; */}

          {/* <CSVDownload data={rows_mis_ddjj} target="_blank" />; */}
        </Stack>
      </div>
      <Stack direction="row" justifyContent="center" alignItems="center">
        <GrillaMisDeclaracionesJuradas
          setDDJJState={setDDJJState}
          rows_mis_ddjj={rows_mis_ddjj}
          setRowsMisDdjj={setRowsMisDdjj}
          idEmpresa={ID_EMPRESA}
          setTabState={setTabState}
          setPeriodo={setPeriodo}
          handleAcceptPeriodoDDJJ={handleAcceptPeriodoDDJJ}
          rowsAltaDDJJ={rowsAltaDDJJ}
          setRowsAltaDDJJ={setRowsAltaDDJJ}
          setPeticion={setPeticion}
          setIdDDJJ={setIdDDJJ}
        />
      </Stack>
    </div>
  );
};
