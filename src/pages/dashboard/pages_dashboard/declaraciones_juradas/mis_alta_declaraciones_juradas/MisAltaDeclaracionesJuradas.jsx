import { useEffect, useState } from 'react';
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
import { actualizarDeclaracionJurada, crearAltaDeclaracionJurada, obtenerCamaras, obtenerCategorias, obtenerPlantaEmpresas } from './MisAltaDeclaracionesJuradasApi';

export const MisAltaDeclaracionesJuradas = ({ 
    periodo, 
    periodoIso, 
    handleChangePeriodo, 
    handleAcceptPeriodoDDJJ, 
    rowsAltaDDJJ, 
    setRowsAltaDDJJ, 
    peticion, 
    idDDJJ,
}) => {

    // const [rowsAltaDDJJ, setRowsAltaDDJJ] = useState([]);
    // const [periodo, setPeriodo] = useState(null);
    // const [periodoIso, setPeriodoIso] = useState(null);
    const [otroPeriodo, setOtroPeriodo] = useState(null);
    const [otroPeriodoIso, setOtroPeriodoIso] = useState(null);
    const [camaras, setCamaras] = useState([]);
    const [todasLasCategorias, setTodasLasCategorias] = useState([]);
    const [categoriasFiltradas, setCategoriasFiltradas] = useState([]);
    const [afiliado, setAfiliado] = useState({});
    const [plantas, setPlantas] = useState([]);
    const [selectedFileName, setSelectedFileName] = useState('');
    const [mostrarPeriodos, setMostrarPeriodos] = useState(false);
    const TOKEN = JSON.parse(localStorage.getItem('stateLogin')).usuarioLogueado.usuario.token;
    const ID_EMPRESA = JSON.parse(localStorage.getItem('stateLogin')).usuarioLogueado.empresa.id;

    
    const handleChangeOtroPeriodo = (date) => setOtroPeriodo(date);

    const handleAcceptOtroPeriodo = () => {

        if (otroPeriodo && otroPeriodo.$d) {
            const { $d: fecha } = otroPeriodo;
            const fechaFormateada = new Date(fecha);
            fechaFormateada.setDate(1); // Establecer el día del mes a 1

            // Ajustar la zona horaria a UTC
            fechaFormateada.setUTCHours(0, 0, 0, 0);

            const fechaISO = fechaFormateada.toISOString(); // 2026-02-01T00:00:00.000Z
            setOtroPeriodoIso(fechaISO);
        }

    };

    useEffect(() => {
        const ObtenerCamaras = async () => {

            const camarasResponse = await obtenerCamaras(TOKEN);

            setCamaras(camarasResponse.map((item, index) => ({ id: index + 1, ...item })));
        };
        ObtenerCamaras();
    }, []);

    useEffect(() => {
        const ObtenerCategorias = async () => {

            const categoriasResponse = await obtenerCategorias(TOKEN);

            setTodasLasCategorias(categoriasResponse.map((item, index) => ({ id: index + 1, ...item })));

        };
        ObtenerCategorias();
    }, []);

    useEffect(() => {
        const ObtenerPlantaEmpresas = async () => {

            const plantaEmpresasResponse = await obtenerPlantaEmpresas(TOKEN, ID_EMPRESA);

            setPlantas(plantaEmpresasResponse.map((item) => ({ id: item, ...item })));

        }
        ObtenerPlantaEmpresas();

    }, []);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFileName(file ? file.name : '');
    };

    const handleElegirOtroChange = (event) => {
        setMostrarPeriodos(event.target.value === 'elegirOtro');
    };

    const guardarDeclaracionJurada = async () => {

        console.log('rowsAltaDDJJ', rowsAltaDDJJ);

        console.log('id de ddjj: ', idDDJJ);

        const altaDDJJFinal = {
            periodo: periodoIso,
            afiliados: rowsAltaDDJJ.map((item) => ({
                cuil: item.cuil,
                inte: afiliado.inter,
                apellido: item.apellido,
                nombre: item.nombre,
                fechaIngreso: item.fechaIngreso,
                empresaDomicilioId: item.planta,
                camara: item.camara,
                categoria: item.categoria,
                remunerativo: item.remunerativo,
                noRemunerativo: item.noRemunerativo,
                aporteUomaCs: item.cuotaSocUoma,
                aporteUomaAs: item.aporteSolUoma,
                aporteCuotaUsu: item.cuotaUsuf,
                aporteArt46: item.art46,
                aporteAntimaCs: item.amtima,
                UOMASocio: peticion === "PUT" ? item.UOMASocio : false,
                ANTIMASocio: true
            }))
        }

        if(peticion === "PUT"){

            await actualizarDeclaracionJurada(TOKEN, ID_EMPRESA, altaDDJJFinal, idDDJJ);

        }else {

            await crearAltaDeclaracionJurada(TOKEN, ID_EMPRESA, altaDDJJFinal);
        }
        
    }

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
                            <DesktopDatePicker
                                label={'Periodo'}
                                views={['month', 'year']}
                                closeOnSelect={false}
                                onChange={handleChangePeriodo}
                                value={periodo}
                                slotProps={{ actionBar: { actions: ['cancel', 'accept'] } }}
                                onAccept={handleAcceptPeriodoDDJJ}
                            />
                        </DemoContainer>
                    </LocalizationProvider>
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
                                    sx={{ marginLeft: '-11px', marginTop: '10px' }}
                                >
                                    <LocalizationProvider
                                        dateAdapter={AdapterDayjs}
                                        adapterLocale={"es"}
                                        localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}
                                    >
                                        <DesktopDatePicker
                                            label={'Otro Periodo'}
                                            views={['month', 'year']}
                                            closeOnSelect={false}
                                            onChange={handleChangeOtroPeriodo}
                                            value={otroPeriodo}
                                            slotProps={{ actionBar: { actions: ['cancel', 'accept'] } }}
                                            onAccept={handleAcceptOtroPeriodo}
                                        />
                                    </LocalizationProvider>
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
                    camaras={camaras}
                    categoriasFiltradas={categoriasFiltradas}
                    setCategoriasFiltradas={setCategoriasFiltradas}
                    setAfiliado={setAfiliado}
                    todasLasCategorias={todasLasCategorias}
                    plantas={plantas}
                />
                <div
                    className='botones_container'
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginTop: '20px'
                    }}
                >
                    <Button
                        variant="contained" // Si quito esto se ve mejor ?????
                        sx={{ padding: '6px 52px' }}
                        onClick={guardarDeclaracionJurada}
                    >Guardar</Button>
                    <Button variant="contained" sx={{ padding: '6px 52px', marginLeft: '10px' }}>Presentar</Button>
                </div>
            </div>
        </div>
    )
}
