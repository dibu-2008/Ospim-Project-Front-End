import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import './DDJJTabs.css';

import { MisDDJJFiltro } from './mis_ddjj/MisDDJJFiltro';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import * as locales from '@mui/material/locale';
import { DDJJForm } from '@/pages/dashboard/pages_dashboard/ddjjPrueba/DDJJForm';

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

export const DDJJTabsPrueba = () => {
  const [idDDJJ, setIdDDJJ] = useState(null);
  const [tabSelected, setTabSelected] = useState(0);

  const [DDJJState, setDDJJState] = useState({});
  const [periodo, setPeriodo] = useState(null);
  const [rowsAltaDDJJ, setRowsAltaDDJJ] = useState([]);
  const [rowsAltaDDJJAux, setRowsAltaDDJJAux] = useState([]);
  const [rows_mis_ddjj, setRowsMisDdjj] = useState([]);
  const [locale, setLocale] = useState('esES');
  const [peticion, setPeticion] = useState('');
  const location = useLocation();
  const [tituloPrimerTab, setTituloPrimerTab] = useState(
    'Alta Declaración Jurada',
  );

  const theme = useTheme();

  const themeWithLocale = useMemo(
    () => createTheme(theme, locales[locale]),
    [locale, theme],
  );

  const handlerDDJJEditar = (idDDJJNew) => {
    console.log('DDJJTabsPrueba - handlerDDJJEditar - idDDJJNew:', idDDJJNew);
    setIdDDJJ(idDDJJNew);
    setTabSelected(0);
    setTituloPrimerTab('Modificar Declaracion Jurada');
  };

  useEffect(() => {
    if (location.pathname.includes('alta')) {
      setTabSelected(0);
    } else if (location.pathname.includes('consulta')) {
      setTabSelected(1);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (tabSelected === 1) {
      //window.location.reload();
      setTituloPrimerTab('Alta Declaración Jurada');
      setDDJJState({});
      setPeriodo(null);
      setRowsAltaDDJJ([]);
      setRowsAltaDDJJAux([]);
      setRowsMisDdjj([]);
      setPeticion('');
      setIdDDJJ(null);
    }
  }, [tabSelected]);

  const handleChangeTabState = (event, value) => setTabSelected(value);

  return (
    <div className="declaraciones_juradas_container">
      <h1>Administración de Declaraciones Juradas</h1>
      <ThemeProvider theme={themeWithLocale}>
        <Box sx={{ width: '100%' }}>
          <Box
            sx={{ borderBottom: 1, borderColor: 'divider', marginTop: '50px' }}
          >
            <Tabs value={tabSelected} onChange={handleChangeTabState}>
              <Tab
                label={tituloPrimerTab}
                {...a11yProps(0)}
                sx={{ fontSize: '1.2rem' }}
              />
              <Tab
                label="Mis Declaraciones Juradas"
                {...a11yProps(1)}
                sx={{ fontSize: '1.2rem' }}
              />
            </Tabs>
          </Box>
          <CustomTabPanel value={tabSelected} index={0}>
            <DDJJForm id={idDDJJ}></DDJJForm>
          </CustomTabPanel>
          <CustomTabPanel value={tabSelected} index={1}>
            <MisDDJJFiltro
              handlerDDJJEditar={handlerDDJJEditar}
              setDDJJState={setDDJJState}
              setPeriodo={setPeriodo}
              rows_mis_ddjj={rows_mis_ddjj}
              setRowsMisDdjj={setRowsMisDdjj}
              setTabState={setTabSelected}
              rowsAltaDDJJ={rowsAltaDDJJ}
              setRowsAltaDDJJ={setRowsAltaDDJJ}
              setPeticion={setPeticion}
              setTituloPrimerTab={setTituloPrimerTab}
            />
          </CustomTabPanel>
        </Box>
      </ThemeProvider>
    </div>
  );
};
