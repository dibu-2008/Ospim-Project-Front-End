import { useState } from 'react';
import { Stack } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { esES } from '@mui/x-date-pickers/locales';
import { Box, TextField, Button, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import dayjs from 'dayjs';
import esLocale from 'dayjs/locale/es';
import './MisAltaDeclaracionesJuradas.css';
import { GrillaPasoTres } from './grilla_paso_tres/GrillaPasoTres';

export const MisAltaDeclaracionesJuradas = () => {

    const [rows, setRows] = useState([]);
    const [rowsAltaDDJJ, setRowsAltaDDJJ] = useState([]);
    const [periodo, setPeriodo] = useState(null);
    const [otroPeriodo, setOtroPeriodo] = useState(null);
    /* const [desde, setDesde] = useState(null);
    const [hasta, setHasta] = useState(null); */
    const [selectedFileName, setSelectedFileName] = useState('');
    const [mostrarPeriodos, setMostrarPeriodos] = useState(false);
    const TOKEN = JSON.parse(localStorage.getItem('stateLogin')).usuarioLogueado.usuario.token;
    const ID_EMPRESA = JSON.parse(localStorage.getItem('stateLogin')).usuarioLogueado.empresa.id;

    //const handleChangeDesde = (date) => setDesde(date);

    //const handleChangeHasta = (date) => setHasta(date);

    const handleChangePeriodo = (date) => setPeriodo(date);
    
    const handleAccept = () => {
        if (periodo && periodo.$d) {
            const {$d:fecha} = periodo;
            const fechaFormateada = new Date(fecha);
            fechaFormateada.setDate(1); // Establecer el día del mes a 1
    
            // Ajustar la zona horaria a UTC
            fechaFormateada.setUTCHours(0, 0, 0, 0);
    
            const fechaISO = fechaFormateada.toISOString();
            console.log(fechaISO);  // 2026-02-01T00:00:00.000Z
        } else {
            console.log("No se ha seleccionado ninguna fecha.");
        }
    };
    

    const handleChangeOtroPeriodo = (date) => setOtroPeriodo(date);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFileName(file ? file.name : '');
    };

    const handleElegirOtroChange = (event) => {
        setMostrarPeriodos(event.target.value === 'elegirOtro');
    };

    return (
        <div className='mis_alta_declaraciones_juradas_container'>
            <div className="periodo_container">
                <h5 className='paso'>Paso 1 - Indique período a presentar</h5>
                <Stack
                    spacing={4}
                    direction="row"

                    alignItems="center"
                >
                    <h5 className='title_periodo'>Período</h5>
                    <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        adapterLocale={"es"}
                        localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}
                    >
                        <DemoContainer components={['DatePicker']}>
                            {/* <DatePicker
                                label="Periodo"
                                value={periodo}
                                onChange={handleChangePeriodo}
                                format="MMMM YYYY"
                                openTo="year"
                                views={["year", "month"]}
                            /> */}
                            <DesktopDatePicker
                                label={'Periodo'}
                                views={['month', 'year']}
                                closeOnSelect={false}
                                onChange={handleChangePeriodo}
                                value={periodo}
                                slotProps={{ actionBar: { actions: ['cancel', 'accept'] } }}
                                onAccept={handleAccept}
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                    {/* <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        adapterLocale={"es"}
                        localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}
                    >
                        <DemoContainer components={['DatePicker']}>
                            <DatePicker
                                label="Periodo hasta"
                                value={hasta}
                                onChange={handleChangeHasta}
                                format="DD-MM-YYYY"
                            />
                        </DemoContainer>
                    </LocalizationProvider> */}
                </Stack>
            </div>

            <div className="presentacion_container">
                <h5 className='paso'>Paso 2 - Elija un modo de presentación</h5>
                <div className='subir_archivo_container'>
                    <span className='span'>1</span>
                    <h5 className='title_subir_archivo'>
                        Subir un archivo CSV - XLSL
                    </h5>
                    <div className="file-select" id="src-file1">
                        <input
                            type="file"
                            name="src-file1"
                            aria-label="Archivo"
                            onChange={handleFileChange}
                            accept=".csv, .xlsx"
                        />
                        <div className="file-select-label" id="src-file1-label">
                            {selectedFileName || 'Nombre del archivo'}
                        </div>
                    </div>
                    <Button
                        variant="contained"
                        sx={{
                            padding: '6px 52px',
                        }}
                    >Subir</Button>
                </div>
                <div className='copiar_periodo_container'>
                    <span className='span'>2</span>
                    <h5 className='title_subir_archivo'>
                        Copiar un período anterior
                    </h5>
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="ultimoPeriodoPresentado"
                        name="radio-buttons-group"
                        sx={{ marginLeft: '67px' }}
                        onChange={handleElegirOtroChange}
                    >
                        <FormControlLabel
                            value="ultimoPeriodoPresentado"
                            control={<Radio />}
                            label="Ultimo período presentado"
                        />
                        <FormControlLabel
                            value="elegirOtro"
                            control={<Radio />}
                            label="Elegir otro"
                        />
                        <div className='elegir_otro_container'>
                            {mostrarPeriodos && (
                                <Stack
                                    spacing={4}
                                    direction="row"
                                    sx={{ marginLeft: '-11px' }}
                                >
                                    <LocalizationProvider
                                        dateAdapter={AdapterDayjs}
                                        adapterLocale={"es"}
                                        localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}
                                    >
                                        <DemoContainer components={['DatePicker']}>
                                            <DatePicker
                                                label="Otro periodo"
                                                value={otroPeriodo}
                                                onChange={handleChangeOtroPeriodo}
                                                format="MMMM YYYY"
                                                openTo="year"
                                                views={["year", "month"]}
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                    {/* <LocalizationProvider
                                        dateAdapter={AdapterDayjs}
                                        adapterLocale={"es"}
                                        localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}
                                    >
                                        <DemoContainer components={['DatePicker']}>
                                            <DatePicker
                                                label="Periodo desde"
                                                value={desde}
                                                onChange={handleChangeDesde}
                                                format="DD-MM-YYYY"
                                                slotProps={{
                                                    textField: {
                                                        size: 'small',
                                                        style: { width: '200px' },
                                                    },
                                                }}
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider> */}
                                    {/* <LocalizationProvider
                                        dateAdapter={AdapterDayjs}
                                        adapterLocale={"es"}
                                        localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}
                                    >
                                        <DemoContainer components={['DatePicker']}>
                                            <DatePicker
                                                label="Periodo hasta"
                                                value={hasta}
                                                onChange={handleChangeHasta}
                                                format="DD-MM-YYYY"
                                                slotProps={{
                                                    textField: {
                                                        size: 'small',
                                                        style: { width: '200px' },
                                                    },
                                                }}
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider> */}
                                </Stack>
                            )}
                        </div>
                    </RadioGroup>
                    <Button
                        variant="contained"
                        sx={{
                            marginLeft: '114px',
                            padding: '6px 45px',

                        }}
                    >Buscar</Button>
                </div>
                <div className='manualmente_container'>
                    <span className='span'>3</span>
                    <h5 className='title_manualmente'>
                        Cargar manualmente
                    </h5>
                    <Button
                        variant="contained"
                        sx={{
                            padding: '6px 23px',
                            marginLeft: '468px'
                        }}
                    >Seleccionar</Button>
                </div>
            </div>

            <div className="formulario_container">
                <h5 className='paso'>Paso 3 - Completar el formulario</h5>
                <GrillaPasoTres
                    rowsAltaDDJJ={rowsAltaDDJJ}
                    setRowsAltaDDJJ={setRowsAltaDDJJ}
                    token={TOKEN}
                />
                <div
                    className='botones_container'
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginTop: '20px'
                    }}
                >
                    <Button variant="contained" sx={{ padding: '6px 52px' }}>Guardar</Button>
                    <Button variant="contained" sx={{ padding: '6px 52px', marginLeft: '10px' }}>Presentar</Button>
                </div>
            </div>
        </div>
    )
}
