import "./DatosEmpresa.css";
import { useEffect, useState } from "react";
import { GrillaEmpresaContacto } from "./grilla_empresa_contacto/GrillaEmpresaContacto";
import { GrillaEmpresaDomilicio } from "./grilla_empresa_domicilio/GrillaEmpresaDomilicio";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { getRamo } from "./DatosEmpresaApi";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Logica de los tabs inicio
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

export const DatosEmpresa = () => {
  
  const STATE = JSON.parse(localStorage.getItem("state"));
  const TOKEN = STATE.usuarioLogueado.usuario.token;
  const CUIT = STATE.usuarioLogueado.empresa.cuit;
  const RAZONSOCIAL = STATE.usuarioLogueado.empresa.razonSocial;
  const RAMO = STATE.usuarioLogueado.empresa.ramoId;
  
  const [rowsContacto, setRowsContacto] = useState([]);
  const [rowsDomicilio, setRowsDomicilio] = useState([]);
  const [razonSocial, setRazonSocial] = useState(RAZONSOCIAL);
  const [ramo, setRamo] = useState("");
  const [ramos, setRamos] = useState([]);
  const [tabState, setTabState] = useState(0);

  useEffect(()=>{
    const ObtenerRamos = async () => {
      const ramos = await getRamo(TOKEN);
      setRamos(ramos);
      const ramoEncontrado = ramos.find((ramo)=>ramo.id === RAMO);
      setRamo(ramoEncontrado.id);
    }
    ObtenerRamos();
    
  }, [])


  const handleChangeTabState = (event, newValue) => {
    setTabState(newValue);
  };

  const OnChangeCuit = (e) => {
    setCuit(e.target.value);
  };

  const OnChangeRazonSocial = (e) => {
    setRazonSocial(e.target.value);
  };

  const OnChangeRamos = (e) => {
    setRamo(e.target.value);
  };

  return (
    <div
      style={{
        margin: "50px auto",
        width: "70%",
      }}
    >
      <h1>Mis datos empresas</h1>

      <form
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-around",
          alignContent: "center",
          margin: "50px auto",
        }}
      >
        <TextField
          type="text"
          name="cuit"
          value={CUIT}
          /* onChange={OnChangeCuit} */
          autoComplete="off"
          label="CUIT"
        />
        <TextField
          type="text"
          name="razonSocial"
          value={razonSocial}
          onChange={OnChangeRazonSocial}
          autoComplete="off"
          label="Razón Social"
        />
        <Box
          sx={{
            textAlign: "left",
            color: "#606060",
            width: "200px",
          }}
        >
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Seleccionar ramo
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={ramo}
              label="Seleccionar ramo"
              onChange={OnChangeRamos}
            >
              {ramos.map((option, index) => (
                <MenuItem key={index} value={option.id}>
                  {option.descripcion}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Button variant="contained" sx={{}} type="submit">
          Guardar
        </Button>
      </form>
      {/* Tabs */}
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabState}
            onChange={handleChangeTabState}
            aria-label="basic tabs example"
          >
            <Tab label="Contacto" {...a11yProps(0)} />
            <Tab label="Domicilio" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={tabState} index={0}>
          <GrillaEmpresaContacto
            rows={rowsContacto}
            setRows={setRowsContacto}
            BACKEND_URL={BACKEND_URL}
            token={TOKEN}
          />
        </CustomTabPanel>
        <CustomTabPanel value={tabState} index={1}>
          <GrillaEmpresaDomilicio
            rowsDomicilio={rowsDomicilio}
            setRowsDomicilio={setRowsDomicilio}
            BACKEND_URL={BACKEND_URL}
            token={TOKEN}
          />
        </CustomTabPanel>
      </Box>
    </div>
  );
};
