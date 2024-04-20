import localStorageService from '@components/localStorage/localStorageService';
import './DatosEmpresa.css';
import { useEffect, useState, useMemo } from 'react';
import { GrillaEmpresaContacto } from './grilla_empresa_contacto/GrillaEmpresaContacto';
import { GrillaEmpresaDomilicio } from './grilla_empresa_domicilio/GrillaEmpresaDomilicio';
import {
  Button,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  Box,
  TextField,
  Tabs,
  Tab,
} from '@mui/material';
import PropTypes from 'prop-types';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import * as locales from '@mui/material/locale';
import axiosDatosEmpre from './DatosEmpresaApi';

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
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export const DatosEmpresa = () => {
  const ID_EMPRESA = localStorageService.getEmpresaId();
  console.log('DatosEmpresa - INIT - ID_EMPRESA: ' + ID_EMPRESA);
  const [locale, setLocale] = useState('esES');
  const [rowsContacto, setRowsContacto] = useState([]);
  const [rowsDomicilio, setRowsDomicilio] = useState([]);
  const [idEmpresa, setIdEmpresa] = useState('');
  const [cuit, setCuit] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [ramo, setRamo] = useState('');
  const [ramos, setRamos] = useState([]);
  const [tabState, setTabState] = useState(0);

  const theme = useTheme();

  const themeWithLocale = useMemo(
    () => createTheme(theme, locales[locale]),
    [locale, theme],
  );

  useEffect(() => {
    const ObtenerEmpresa = async () => {
      const empresa = await axiosDatosEmpre.consultarEmpresa();
      console.log('** ObtenerEmpresa - empresa: ' + JSON.stringify(empresa));
      setCuit(empresa.empresa.cuit);
      setRazonSocial(empresa.empresa.razonSocial);
      setIdEmpresa(empresa.empresa.id);
      setRamo(empresa.empresa.ramoId);
    };
    ObtenerEmpresa();
  }, []);

  useEffect(() => {
    const ObtenerRamos = async () => {
      const ramos = await axiosDatosEmpre.consultarRamo();
      console.log(ramos);
      setRamos(ramos);
    };
    ObtenerRamos();
  }, []);

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

  const onSubmitModificarEmpresa = async (e) => {
    e.preventDefault();
    const empresa = {
      razonSocial: razonSocial,
      ramoId: ramo,
      id: idEmpresa,
    };
    await axiosDatosEmpre.actualizar(empresa);
  };

  return (
    <div className="datos_empresa_container">
      <h1>Mis datos empresas</h1>

      <form
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-around',
          alignContent: 'center',
          margin: '50px auto',
        }}
        onSubmit={onSubmitModificarEmpresa}
      >
        <TextField
          type="text"
          name="cuit"
          value={cuit}
          /// onChange={OnChangeCuit}
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
            textAlign: 'left',
            color: '#606060',
            width: '200px',
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
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
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
          <ThemeProvider theme={themeWithLocale}>
            <GrillaEmpresaContacto
              idEmpresa={ID_EMPRESA}
              rows={rowsContacto}
              setRows={setRowsContacto}
            />
          </ThemeProvider>
        </CustomTabPanel>
        <CustomTabPanel value={tabState} index={1}>
          <ThemeProvider theme={themeWithLocale}>
            <GrillaEmpresaDomilicio
              idEmpresa={ID_EMPRESA}
              rows={rowsDomicilio}
              setRows={setRowsDomicilio}
            />
          </ThemeProvider>
        </CustomTabPanel>
      </Box>
    </div>
  );
};
