import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import './DeclaracionesJuradas.css';
import { MisDeclaracionesJuradas } from './mis_declaraciones_juradas/MisDeclaracionesJuradas';

import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import * as locales from '@mui/material/locale';

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

export const DeclaracionesJuradas = () => {
  
  const [locale, setLocale] = useState('esES');
  const [tabState, setTabState] = useState(0);

  const theme = useTheme();

  const themeWithLocale = useMemo(
    () => createTheme(theme, locales[locale]),
    [locale, theme],
  );

  const handleChangeTabState = (event, newValue) => {
    setTabState(newValue);
  };

  return (
    <div className='declaraciones_juradas_container'>
      <h1>Administracion declaraciones juradas</h1>
      <ThemeProvider theme={themeWithLocale}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', marginTop: '50px' }}>
            <Tabs 
              value={tabState} 
              onChange={handleChangeTabState} 
            >
              <Tab 
                label="Mis Declaraciones Juradas" {...a11yProps(0)}
                sx={{
                  fontSize: '1.5rem',
                  margin: '0 auto',
                }}  
              />
              <Tab 
                label="Mis Pagos" {...a11yProps(1)}
                sx={{
                  fontSize: '1.5rem',
                  margin: '0 auto',
                }}  
              />
            </Tabs>
          </Box>
          <CustomTabPanel value={tabState} index={0}>
            <MisDeclaracionesJuradas />
          </CustomTabPanel>
          <CustomTabPanel value={tabState} index={1}>
          Mis Pagos
          </CustomTabPanel>
        </Box>
      </ThemeProvider>
    </div>
  );
}
