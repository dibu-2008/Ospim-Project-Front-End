import { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import "./DDJJ.css";
import { MisDeclaracionesJuradas } from "./mis_ddjj/ConsultaMisDDJJ";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import * as locales from "@mui/material/locale";
import { MisAltaDeclaracionesJuradas } from "./alta/DDJJAlta";
import dayjs from "dayjs";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <span>{children}</span>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export const DeclaracionesJuradas = () => {
  const [rowsAltaDDJJ, setRowsAltaDDJJ] = useState([]);
  const [rowsAltaDDJJAux, setRowsAltaDDJJAux] = useState([]);
  const [rows_mis_ddjj, setRowsMisDdjj] = useState([]);
  const [periodo, setPeriodo] = useState(null);
  const [periodoIso, setPeriodoIso] = useState(null);
  const [locale, setLocale] = useState("esES");
  const [tabState, setTabState] = useState(0);
  const [peticion, setPeticion] = useState("");
  const [idDDJJ, setIdDDJJ] = useState(null);

  const theme = useTheme();

  const themeWithLocale = useMemo(
    () => createTheme(theme, locales[locale]),
    [locale, theme]
  );

  const handleChangeTabState = (event, newValue) => {
    setTabState(newValue);
  };

  const handleChangePeriodo = (date) => {
    setPeriodo(date);
  };

  const handleAcceptPeriodoDDJJ = () => {
    if (periodo && periodo.$d) {
      const { $d: fecha } = periodo;
      const fechaFormateada = new Date(fecha);
      fechaFormateada.setDate(1); // Establecer el día del mes a 1

      // Ajustar la zona horaria a UTC
      fechaFormateada.setUTCHours(0, 0, 0, 0);

      const fechaISO = fechaFormateada.toISOString(); // 2026-02-01T00:00:00.000Z
      setPeriodoIso(fechaISO);
    }
  };

  useEffect(() => {
    handleAcceptPeriodoDDJJ();
  }, [periodo]);

  return (
    <div className="declaraciones_juradas_container">
      <h1>Administracion declaraciones juradas</h1>
      <ThemeProvider theme={themeWithLocale}>
        <Box sx={{ width: "100%" }}>
          <Box
            sx={{ borderBottom: 1, borderColor: "divider", marginTop: "50px" }}
          >
            <Tabs value={tabState} onChange={handleChangeTabState}>
              <Tab
                label="Alta Declaracion Jurada"
                {...a11yProps(0)}
                sx={{ fontSize: "1.2rem" }}
              />
              <Tab
                label="Mis Declaraciones Juradas"
                {...a11yProps(1)}
                sx={{ fontSize: "1.2rem" }}
              />
              <Tab
                label="Mis Pagos"
                {...a11yProps(2)}
                sx={{ fontSize: "1.2rem" }}
              />
            </Tabs>
          </Box>
          <CustomTabPanel value={tabState} index={0}>
            <MisAltaDeclaracionesJuradas
              periodo={periodo}
              periodoIso={periodoIso}
              handleChangePeriodo={handleChangePeriodo}
              handleAcceptPeriodoDDJJ={handleAcceptPeriodoDDJJ}
              rowsAltaDDJJ={rowsAltaDDJJ}
              setRowsAltaDDJJ={setRowsAltaDDJJ}
              rowsAltaDDJJAux={rowsAltaDDJJAux}
              setRowsAltaDDJJAux={setRowsAltaDDJJAux}
              peticion={peticion}
              idDDJJ={idDDJJ}
            />
          </CustomTabPanel>
          <CustomTabPanel value={tabState} index={1}>
            <MisDeclaracionesJuradas
              rows_mis_ddjj={rows_mis_ddjj}
              setRowsMisDdjj={setRowsMisDdjj}
              setTabState={setTabState}
              setPeriodo={setPeriodo}
              handleAcceptPeriodoDDJJ={handleAcceptPeriodoDDJJ}
              rowsAltaDDJJ={rowsAltaDDJJ}
              setRowsAltaDDJJ={setRowsAltaDDJJ}
              setPeticion={setPeticion}
              setIdDDJJ={setIdDDJJ}
            />
          </CustomTabPanel>
          <CustomTabPanel value={tabState} index={2}>
            Mis Pagos
          </CustomTabPanel>
        </Box>
      </ThemeProvider>
    </div>
  );
};
