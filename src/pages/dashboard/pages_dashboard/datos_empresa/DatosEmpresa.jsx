import localStorageService from '@components/localStorage/localStorageService';
import './DatosEmpresa.css';
import { useEffect, useState, useMemo } from 'react';
import { GrillaEmpresaContacto } from './grilla_empresa_contacto/GrillaEmpresaContacto';
import { GrillaEmpresaDomicilio } from './grilla_empresa_domicilio/GrillaEmpresaDomicilio';
import { Button, Box, TextField, Tabs, Tab } from '@mui/material';
import PropTypes from 'prop-types';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import * as locales from '@mui/material/locale';
import axiosDatosEmpre from './DatosEmpresaApi';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';

const CustomSelect = styled(Select)({
  textAlign: 'left',
  '& .MuiSelect-select': {
    textAlign: 'left',
  },
});

const CustomMenuItem = styled(MenuItem)({
  textAlign: 'left',
});
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
  //const [rowsContacto, setRowsContacto] = useState([]);
  const [rowsDomicilio, setRowsDomicilio] = useState([]);
  const [idEmpresa, setIdEmpresa] = useState('');
  const [cuit, setCuit] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [tabState, setTabState] = useState(0);
  const [actividadMolinera, setActividadMolinera] = useState(false);

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
      setActividadMolinera(
        empresa.empresa.actividad_molinera
          ? empresa.empresa.actividad_molinera
          : false,
      );
    };
    ObtenerEmpresa();
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
      actividad_molinera: actividadMolinera,
      id: idEmpresa,
    };
    await axiosDatosEmpre.actualizar(empresa);
  };

  return (
    <div className="datos_empresa_container">
      <h1>Mis Datos de Perfil</h1>

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
          sx={{
            width: '350px',
          }}
        />
        <FormControl className="formC">
          <InputLabel>Pertenece a actividad Molinera</InputLabel>
          <CustomSelect
            width="350px"
            name="actividadMolinera"
            value={actividadMolinera}
            label="Pertenece a actividad Molinera"
            onChange={(e) => setActividadMolinera(e.target.value)}
            MenuProps={{
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
              transformOrigin: {
                vertical: 'top',
                horizontal: 'left',
              },
            }}
          >
            <CustomMenuItem value={true}>Si</CustomMenuItem>
            <CustomMenuItem value={false}>No</CustomMenuItem>
          </CustomSelect>
        </FormControl>
        <Button variant="contained" sx={{}} type="submit">
          Guardar
        </Button>
      </form>
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
              //rows={rowsContacto}
              //setRows={setRowsContacto}
            />
          </ThemeProvider>
        </CustomTabPanel>
        <CustomTabPanel value={tabState} index={1}>
          <ThemeProvider theme={themeWithLocale}>
            <GrillaEmpresaDomicilio
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
