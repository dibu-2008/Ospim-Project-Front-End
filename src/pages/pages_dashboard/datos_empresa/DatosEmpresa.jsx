import './DatosEmpresa.css';
import { useState } from 'react';
import { GrillaEmpresaContacto } from './grilla_empresa_contacto/GrillaEmpresaContacto';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { GrillaEmpresaDomilicio } from './grilla_empresa_domicilio/GrillaEmpresaDomilicio';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ramos = [
    { value: "Ramo A", label: "Ramo A" },
    { value: "Ramo B", label: "Ramo B" },
    { value: "Ramo C", label: "Ramo C" },
];

// Logica de los tabs incio

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

export const Datos = () => {

    const [rows, setRows] = useState([]); 
    const [rows_domicilio, setRowsDomicilio] = useState([]); 
    const [cuit, setCuit] = useState('');
    const [razonSocial, setRazonSocial] = useState('');
    const [ramo, setRamo] = useState('');

    // Estado para los tabs
    const [value, setValue] = useState(0);

    const state = JSON.parse(localStorage.getItem('state')); 

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const OnInputChangeCuit = (e) => {
        setCuit(e.target.value);
    }

    const OnInputChangeRazonSocial = (e) => {
        setRazonSocial(e.target.value);
    }

    const OnChangeRamos = (e) => {
        setRamo(e.target.value);
    }
    
    return (
        <div
            style={{
                margin: '50px auto',
                width: '70%',
            }}
        >
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
            >
                <TextField
                    type="text"
                    name="cuit"
                    value={cuit}
                    onChange={OnInputChangeCuit}
                    autoComplete="off"
                    label="CUIT"
                />
                <TextField
                    type="text"
                    name="razonSocial"
                    value={razonSocial}
                    onChange={OnInputChangeRazonSocial}
                    autoComplete="off"
                    label="Razón Social"
                />
                <Box sx={{
                    textAlign: 'left',
                    color: '#606060',
                    width: '200px',
                }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Seleccionar ramo</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={ramo}
                            label="Seleccionar ramo"
                            onChange={OnChangeRamos}
                        >
                            {
                                ramos.map((option, index) => (
                                    <MenuItem key={index} value={option.value}>{option.value}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Box>
                <Button
                    variant='contained'
                    sx={{

                    }}
                    type='submit'
                >Guardar</Button>
            </form>
            {/* Tabs */}
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Contacto" {...a11yProps(0)} />
                        <Tab label="Domicilio" {...a11yProps(1)} />

                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    <GrillaEmpresaContacto
                        rows={rows}
                        setRows={setRows}
                        BACKEND_URL={BACKEND_URL}
                        token={state.token}
                    />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <GrillaEmpresaDomilicio
                        rows_domicilio={rows_domicilio}
                        setRowsDomicilio={setRowsDomicilio}
                        BACKEND_URL={BACKEND_URL}
                        token={state.token}
                    />
                </CustomTabPanel>

            </Box>

        </div>
    )
}