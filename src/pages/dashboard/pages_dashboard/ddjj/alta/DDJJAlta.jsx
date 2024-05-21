import { useEffect, useState } from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { esES } from '@mui/x-date-pickers/locales';
import {
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Stack,
  Tooltip,
  Typography,
  dialogClasses,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tab,
  Tabs,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import 'dayjs/locale/es';
import './DDJJAlta.css';
import { DDJJAltaEmpleadosGrilla } from './empleadosGrilla/DDJJAltaEmpleadosGrilla';
import { axiosDDJJ } from './DDJJAltaApi';
import localStorageService from '@/components/localStorage/localStorageService';
import Swal from 'sweetalert2';
import XLSX from 'xlsx';
import { GridRowModes } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import swal from '@/components/swal/swal';
import PropTypes from 'prop-types';

const IMPORTACION_OK = import.meta.env.VITE_IMPORTACION_OK;

const textoIdioma =
  esES.components.MuiLocalizationProvider.defaultProps['localeText'];

const adaptadorIdioma = 'es';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Box>{children}</Box>
        </Box>
      )}
    </Box>
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

export const DDJJAlta = ({
  DDJJState,
  setDDJJState,
  periodo,
  setPeriodo,
  rowsAltaDDJJ,
  setRowsAltaDDJJ,
}) => {
  const [camaras, setCamaras] = useState([]);
  const [todasLasCategorias, setTodasLasCategorias] = useState([]);
  const [categoriasFiltradas, setCategoriasFiltradas] = useState([]);
  const [afiliado, setAfiliado] = useState({});
  const [plantas, setPlantas] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [mostrarPeriodos, setMostrarPeriodos] = useState(false);
  const [validacionResponse, setValidacionResponse] = useState([]);
  const [afiliadoImportado, setAfiliadoImportado] = useState([]);
  const [filasDoc, setFilasDoc] = useState([]);
  const [ocultarEmpleadosGrilla, setOcultarEmpleadosGrilla] = useState(false);
  const [btnSubirHabilitado, setBtnSubirHabilitado] = useState(false);
  //const [ddjjCreada, setDDJJCreada] = useState({});
  const [someRowInEditMode, setSomeRowInEditMode] = useState(false);
  const [otroPeriodo, setOtroPeriodo] = useState(null);
  const [rowModesModel, setRowModesModel] = useState({});
  const ID_EMPRESA = localStorageService.getEmpresaId();
  const [tituloSec, setTituloSec] = useState('');
  const [tab, setTab] = useState(0);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleChangePeriodo = (date) => setPeriodo(date);

  const handleChangeOtroPeriodo = (date) => setOtroPeriodo(date);

  useEffect(() => {
    // Comprueba si hay alguna fila en modo edición
    const isSomeRowInEditMode = Object.values(rowModesModel).some(
      (row) => row.mode === GridRowModes.Edit,
    );
    // Actualiza el estado con el valor de booleano
    setSomeRowInEditMode(isSomeRowInEditMode);
  }, [rowModesModel]);

  useEffect(() => {
    const ObtenerCamaras = async () => {
      const data = await axiosDDJJ.getCamaras();
      setCamaras(data.map((item, index) => ({ id: index + 1, ...item })));
    };
    ObtenerCamaras();
  }, []);

  useEffect(() => {
    const ObtenerCategorias = async () => {
      const data = await axiosDDJJ.getCategorias();
      setTodasLasCategorias(
        data.map((item, index) => ({ id: index + 1, ...item })),
      );
    };
    ObtenerCategorias();
  }, []);

  useEffect(() => {
    const ObtenerPlantaEmpresas = async () => {
      const data = await axiosDDJJ.getPlantas(ID_EMPRESA);
      console.log('PLANTAS');
      console.log(data);
      setPlantas(data.map((item) => ({ id: item, ...item })));
    };
    ObtenerPlantaEmpresas();
  }, []);

  const getTituloSec = (secuencia) => {
    if (secuencia === 0) {
      return 'Original';
    } else if (secuencia === null || secuencia === undefined) {
      return 'Pendiente';
    } else {
      return 'Rectificativa Nro: ' + secuencia;
    }
  };

  // useEffect(() para llenar las grillas
  useEffect(() => {
    const obtenerDDJJ = async (ddjj, idDDJJ, idEmpresa) => {
      if (ddjj && idDDJJ) {
        try {
          const ddjj = await axiosDDJJ.getDDJJ(idEmpresa, idDDJJ);
          console.log(ddjj.periodo);

          setTituloSec(getTituloSec(ddjj.secuencia));

          setPeriodo(dayjs(ddjj.periodo));
          setRowsAltaDDJJ(ddjj.afiliados);
        } catch (error) {
          console.error('Error al obtener la DDJJ:', error);
        }
      }
    };

    obtenerDDJJ(DDJJState, DDJJState.id, ID_EMPRESA);
  }, [DDJJState]);

  const importarAfiliado = async () => {
    console.log('afiliadoImportado');
    console.log(afiliadoImportado);
    const cuiles = afiliadoImportado.map((item) => item.cuil);
    const cuilesString = cuiles.map((item) => item.toString());

    const cuilesResponse = await axiosDDJJ.validarCuiles(
      ID_EMPRESA,
      cuilesString,
    );

    console.log('cuilesResponse');
    console.log(cuilesResponse);

    const afiliadoImportadoConInte = afiliadoImportado.map((item) => {
      const cuilResponse = cuilesResponse.find(
        (cuil) => +cuil.cuil === item.cuil,
      );
      if (cuilResponse) {
        return { ...item, inte: cuilResponse.inte };
      }
      return item;
    });

    console.log('afiliadoImportadoConInte');
    console.log(afiliadoImportadoConInte);

    // Si alguno de los cuiles el valor de cuilesValidados es igual a false
    if (cuilesResponse.some((item) => item.cuilValido === false)) {
      const mensajesFormateados2 = filasDoc
        .map((item) => {
          return `<p style="margin-top:20px;">
        Linea ${item.indice}: cuil ${item.cuil} con formato inválido.</p>`;
        })
        .join('');

      console.log(mensajesFormateados2);

      Swal.fire({
        icon: 'error',
        title: 'Error de validacion',
        html: `Cuiles con errores:<br>${mensajesFormateados2}<br>`,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
      });

      setRowsAltaDDJJ(afiliadoImportadoConInte);
    } else {
      swal.showSuccess(IMPORTACION_OK);

      setRowsAltaDDJJ(afiliadoImportadoConInte);
    }
    // setRowsAltaDDJJAux(afiliadoImportadoConInte);
    setOcultarEmpleadosGrilla(true);
  };

  const formatearFecha = (fechaExcel) => {
    // xlsx
    if (typeof fechaExcel === 'number') {
      const horas = Math.floor((fechaExcel % 1) * 24);
      const minutos = Math.floor(((fechaExcel % 1) * 24 - horas) * 60);
      const fechaFinal = new Date(
        Date.UTC(0, 0, fechaExcel, horas - 17, minutos),
      );

      const fechaDaysJs = dayjs(fechaFinal)
        .set('hour', 3)
        .set('minute', 0)
        .set('second', 0)
        .set('millisecond', 0)
        .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

      return fechaDaysJs;
    }

    // cvs
    if (typeof fechaExcel === 'string') {
      const partes = fechaExcel?.split('/');
      const anio = partes[2]?.length === 2 ? '20' + partes[2] : partes[2];
      const mes = partes[1].padStart(2, '0');
      const dia = partes[0];

      const fechaDaysJs = dayjs(`${anio}-${mes}-${dia}`)
        .set('hour', 3)
        .set('minute', 0)
        .set('second', 0)
        .set('millisecond', 0)
        .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

      return fechaDaysJs;
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    setSelectedFileName(file ? file.name : '');

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        if (rows[0].length === 11) {
          const arraySinEncabezado = rows.slice(1);

          rows.forEach((item, index) => {
            const fila = {
              indice: index + 1,
              cuil: item[0],
            };

            setFilasDoc([...filasDoc, fila]);
          });

          const arrayTransformado = arraySinEncabezado.map((item, index) => {
            return {
              id: index + 1,
              cuil: item[0],
              apellido: item[1],
              nombre: item[2],
              camara: item[3],
              categoria: item[4],
              fechaIngreso: formatearFecha(item[5]),
              empresaDomicilioId: plantas.find(
                (plantas) => plantas.planta === item[6],
              )?.id,
              remunerativo: item[7],
              noRemunerativo: item[8],
              uomaSocio: item[9] === 'Si',
              amtimaSocio: item[10] === 'Si',
              esImportado: true,
            };
          });

          // Antes de llenar las grillas debo de validar los cuiles

          setAfiliadoImportado(arrayTransformado);
          setBtnSubirHabilitado(true);
          console.log(DDJJState);
          if (DDJJState.id) {
            confirm(
              'Recorda que si subis un archivo, se perderan los datos de la ddjj actual',
            );
          }
        } else {
        }
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const handleElegirOtroChange = (event) => {
    setMostrarPeriodos(event.target.value === 'elegirOtro');
  };

  const guardarDeclaracionJurada = async () => {
    let DDJJ = {
      periodo: periodo,
      afiliados: rowsAltaDDJJ.map((item) => {
        const registroNew = {
          errores: item.errores,
          cuil: !item.cuil ? null : item.cuil,
          inte: item.inte,
          apellido: !item.apellido ? null : item.apellido,
          nombre: !item.nombre ? null : item.nombre,
          fechaIngreso: !item.fechaIngreso ? null : item.fechaIngreso,
          empresaDomicilioId: !item.empresaDomicilioId
            ? null
            : item.empresaDomicilioId,
          camara: !item.camara ? null : item.camara,
          categoria: !item.categoria ? null : item.categoria,
          remunerativo: !item.remunerativo
            ? null
            : parseFloat(item.remunerativo.replace(',','.')),
          noRemunerativo: !item.noRemunerativo
            ? null
            : parseFloat(item.noRemunerativo.replace(',','.')),
          uomaSocio: item.uomaSocio === '' ? null : item.uomaSocio,
          amtimaSocio: item.amtimaSocio === '' ? null : item.amtimaSocio,
        };

        console.log('REGISTRO NEW');
        console.log(registroNew);
        if (item.id) registroNew.id = item.id;
        return registroNew;
      }),
    };

    if (DDJJState.id) {
      DDJJ.id = DDJJState.id;
    }

    console.log('DDJJJJJJJJJJJJJJJJJJ FINALLLL');
    console.log(DDJJ);

    // Borrar la propiedad errores de cada afiliado
    // por que no se envia al backend
    DDJJ.afiliados.forEach((afiliado) => {
      delete afiliado.errores;
    });

    console.log('borro afiliado.errores - DDJJ:');
    console.log(DDJJ);

    const validacionResponse = await axiosDDJJ.validar(ID_EMPRESA, DDJJ);
    console.log('validacionResponse: ');
    console.log(validacionResponse);

    // array de cuiles del array validacionResponse.errores
    let cuilesConErrores = [];
    if (validacionResponse.errores) {
      cuilesConErrores = validacionResponse.errores.map((error) => error.cuil);
    }
    console.log('cuilesConErrores: ');
    console.log(cuilesConErrores);

    // Agregar la propiedad errores="No"
    DDJJ.afiliados.forEach((afiliado) => {
      console.log('afiliado.cuil: ');
      console.log(afiliado.cuil);
      afiliado.errores = false;
      if (cuilesConErrores.includes(afiliado.cuil)) {
        console.log('afiliado.errores:false');
        afiliado.errores = true;
      }
    });

    // Buscar todos estos cuiles en el rowsAltaDDJJ, y marcarlos con errores="Si"
    rowsAltaDDJJ.forEach((afiliado) => {
      if (cuilesConErrores.includes(afiliado.cuil)) {
        afiliado.errores = true;
      } else {
        afiliado.errores = false;
      }
    });

    // Borro la propiedad errores de ddjj
    DDJJ.afiliados.forEach((afiliado) => {
      delete afiliado.errores;
    });

    setValidacionResponse(validacionResponse); // Sirve para pintar en rojo los campos con errores

    if (validacionResponse.errores && validacionResponse.errores.length > 0) {
      const mensajesUnicos = new Set();

      validacionResponse.errores.forEach((error) => {
        if (!mensajesUnicos.has(error.descripcion)) {
          mensajesUnicos.add(error.descripcion);
        }
      });

      const mensajesFormateados = Array.from(mensajesUnicos)
        .map((mensaje, index) => {
          return `<p>${index + 1} - ${mensaje}</p>`;
        })
        .join('');

      Swal.fire({
        icon: 'error',
        title: 'Valiacion de Declaracion Jurada',
        html: `${mensajesFormateados}<br>
                      <label for="guardarErrores">¿Deseas guardar la declaración jurada y corregir mas tardes los errores?</label>`,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
      }).then(async (result) => {
        if (result.isConfirmed) {
          console.log('Aceptar...');
          let bOK = false;

          DDJJ.afiliados.forEach((afiliado) => {
            delete afiliado.errores;
          });

          console.log('Estoy dentro de los errores');

          if (DDJJState.id) {
            bOK = await axiosDDJJ.actualizar(ID_EMPRESA, DDJJ);
          } else {
            const data = await axiosDDJJ.crear(ID_EMPRESA, DDJJ);
            if (data) {
              //setDDJJCreada(data);
              setDDJJState(data);
              setTituloSec(getTituloSec(data.secuencia));
            }
          }
        } else {
          console.log('Cancelar...se queda a corregir datos');
          // NO limpiar la grilla.
          // El usuario decidio corregir los errores antes de GRABAR.
          // pero no hay que PERDER los datos.-
        }
      });
    } else {
      console.log('no tiene errores...grabo directamente.');
      let bOK = false;

      DDJJ.afiliados.forEach((afiliado) => {
        delete afiliado.errores;
      });

      console.log('Estoy fuera de los errores');

      if (DDJJState.id) {
        console.log('Dentro de ACTUALIZAR');
        bOK = await axiosDDJJ.actualizar(ID_EMPRESA, DDJJ);
      } else {
        console.log('Dentro de CREAR');
        const data = await axiosDDJJ.crear(ID_EMPRESA, DDJJ);
        if (data) {
          //setDDJJCreada(data);
          setDDJJState(data);
          setTituloSec(getTituloSec(data.secuencia));
        }
      }
    }
  };

  const presentarDeclaracionJurada = async () => {
    if (DDJJState.id) {
      // Esto deberia de ser un post para poder cambiar ambos datos

      const data = await axiosDDJJ.presentar(ID_EMPRESA, DDJJState.id);
      DDJJState.estado = data.estado;
      DDJJState.secuencia = data.secuencia;
      if (data) {
        const newDDJJState = {
          ...DDJJState,
          estado: data.estado || null,
          secuencia: data.secuencia,
        };
        console.log('newDDJJState - pre SET: ');
        console.log(newDDJJState);
        setDDJJState(newDDJJState);
        setTituloSec(getTituloSec(newDDJJState.secuencia));
      }
    }
  };

  const buscarPeriodoAnterior = async () => {
    if (!mostrarPeriodos) {
      console.log('Ultimo Período Presentado');
      const ultimoPeriodoPresentadoRes =
        await axiosDDJJ.getPeriodoAnterior(otroPeriodo);
      console.log('ultimoPeriodoPresentadoRes');
      console.log(ultimoPeriodoPresentadoRes);
      if (ultimoPeriodoPresentadoRes.length === 0) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se encontró un período anterior',
        });
        return;
      } else {
        setTituloSec(getTituloSec(ultimoPeriodoPresentadoRes[0].secuencia));
        setRowsAltaDDJJ(ultimoPeriodoPresentadoRes[0].afiliados);
        /* setDDJJState((prevState) => ({
          ...prevState,
          afiliados: ultimoPeriodoPresentadoRes[0].afiliados,
        })); */
        setOcultarEmpleadosGrilla(!ocultarEmpleadosGrilla);
      }
    } else {
      console.log('Elegir otro');
      const otroPeriodoRes = await axiosDDJJ.getPeriodoAnterior(otroPeriodo);
      if (otroPeriodoRes.length === 0) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se encontró la DDJJ para el período seleccionado.',
        });
        return;
      } else {
        setRowsAltaDDJJ(otroPeriodoRes[0].afiliados);
        setDDJJState((prevState) => ({
          ...prevState,
          afiliados: otroPeriodoRes[0].afiliados,
        }));
        setOcultarEmpleadosGrilla(!ocultarEmpleadosGrilla);
      }
    }
  };

  return (
    <div className="mis_alta_declaraciones_juradas_container">
      <div className="periodo_container">
        <Accordion defaultExpanded>
          <AccordionSummary
            className="paso"
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            Paso 1 - Indique período a presentar
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={4} direction="row" alignItems="center">
              <Typography className="title_periodo">Período</Typography>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale={adaptadorIdioma}
                localeText={textoIdioma}
              >
                <DemoContainer components={['DatePicker']}>
                  <DesktopDatePicker
                    label={'Periodo'}
                    views={['month', 'year']}
                    closeOnSelect={true}
                    onChange={handleChangePeriodo}
                    value={periodo}
                  />
                </DemoContainer>
              </LocalizationProvider>
              <Typography> DDJJ: {tituloSec}</Typography>
            </Stack>
          </AccordionDetails>
        </Accordion>
      </div>

      <div className="presentacion_container">
        <Accordion>
          <AccordionSummary
            className="paso"
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            Paso 2 - Elija un modo de presentación
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tab}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Importar CSV - XLSX" {...a11yProps(0)} />
                <Tab label="Copiar un período anterior" {...a11yProps(1)} />
                {/*  <Tab label="Item Three" {...a11yProps(2)} /> */}
              </Tabs>
            </Box>
            <CustomTabPanel value={tab} index={0}>
              <Box className="subir_archivo_container">
                <Box className="file-select" id="src-file1">
                  <input
                    type="file"
                    name="src-file1"
                    aria-label="Archivo"
                    onChange={handleFileChange}
                    accept=".csv, .xlsx"
                    title=""
                  />
                  <Box className="file-select-label" id="src-file1-label">
                    {selectedFileName || 'Nombre del archivo'}
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  sx={{
                    padding: '6px 52px',
                    width: '150px',
                  }}
                  onClick={importarAfiliado}
                  disabled={!btnSubirHabilitado}
                >
                  Importar
                </Button>
              </Box>
            </CustomTabPanel>
            <CustomTabPanel value={tab} index={1}>
              <Box className="copiar_periodo_container">
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="ultimoPeriodoPresentado"
                  name="radio-buttons-group"
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
                  <Box className="elegir_otro_container">
                    {mostrarPeriodos && (
                      <Stack
                        spacing={4}
                        direction="row"
                        sx={{ marginLeft: '-11px', marginTop: '10px' }}
                      >
                        <LocalizationProvider
                          dateAdapter={AdapterDayjs}
                          adapterLocale={adaptadorIdioma}
                          localeText={textoIdioma}
                        >
                          <DemoContainer components={['DatePicker']}>
                            <DesktopDatePicker
                              label={'Otro período'}
                              views={['month', 'year']}
                              closeOnSelect={true}
                              onChange={handleChangeOtroPeriodo}
                              value={otroPeriodo}
                            />
                          </DemoContainer>
                        </LocalizationProvider>
                      </Stack>
                    )}
                  </Box>
                </RadioGroup>
                <Button
                  variant="contained"
                  sx={{
                    marginLeft: '114px',
                    padding: '6px 45px',
                  }}
                  onClick={buscarPeriodoAnterior}
                >
                  Buscar
                </Button>
              </Box>
            </CustomTabPanel>
            {/* <CustomTabPanel value={tab} index={2}>
              <Box className="manualmente_container">
                <Button
                  variant="contained"
                  sx={{
                    padding: '6px 23px',
                    width: '150px',
                    marginLeft: '467px',
                  }}
                  onClick={() =>
                    setOcultarEmpleadosGrilla(!ocultarEmpleadosGrilla)
                  }
                >
                  Carga
                </Button>
              </Box>
            </CustomTabPanel> */}
          </AccordionDetails>
        </Accordion>
      </div>

      <div className="presentacion_container">
        <Accordion>
          <AccordionSummary
            className="paso"
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            Paso 3 - Grilla de afiliado
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                margin: '10px 0px -20px 0px',

                width: '100%',
                '& .actions': {
                  color: 'text.secondary',
                },
                '& .textPrimary': {
                  color: 'text.primary',
                },
              }}
            >
              <DDJJAltaEmpleadosGrilla
                rowsAltaDDJJ={rowsAltaDDJJ}
                setRowsAltaDDJJ={setRowsAltaDDJJ}
                camaras={camaras}
                categoriasFiltradas={categoriasFiltradas}
                setCategoriasFiltradas={setCategoriasFiltradas}
                afiliado={afiliado}
                setAfiliado={setAfiliado}
                todasLasCategorias={todasLasCategorias}
                plantas={plantas}
                validacionResponse={validacionResponse}
                setSomeRowInEditMode={setSomeRowInEditMode}
                rowModesModel={rowModesModel}
                setRowModesModel={setRowModesModel}
              />
            </Box>
            <div
              className="botones_container"
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '30px',
              }}
            >
              <Tooltip
                title={
                  someRowInEditMode
                    ? 'Hay filas en edición, por favor finalice la edición antes de guardar.'
                    : ''
                }
                sx={{ marginLeft: '10px', cursor: 'pointer' }}
              >
                <span>
                  <Button
                    variant="contained"
                    sx={{ padding: '6px 52px', marginLeft: '10px' }}
                    onClick={guardarDeclaracionJurada}
                    disabled={someRowInEditMode || rowsAltaDDJJ?.length === 0}
                  >
                    Guardar
                  </Button>
                </span>
              </Tooltip>

              {DDJJState.estado === 'PR' ? (
                <Button
                  variant="contained"
                  sx={{ padding: '6px 52px', marginLeft: '10px' }}
                  onClick={presentarDeclaracionJurada}
                  disabled={true}
                >
                  Presentar
                </Button>
              ) : DDJJState.estado === 'PE' ? (
                <Button
                  variant="contained"
                  sx={{ padding: '6px 52px', marginLeft: '10px' }}
                  onClick={presentarDeclaracionJurada}
                  disabled={false}
                >
                  Presentar
                </Button>
              ) : (
                <Button
                  variant="contained"
                  sx={{ padding: '6px 52px', marginLeft: '10px' }}
                  onClick={presentarDeclaracionJurada}
                  disabled={DDJJState.id ? false : true}
                >
                  Presentar
                </Button>
              )}
            </div>
          </AccordionDetails>
        </Accordion>
      </div>

      {/* {(ocultarEmpleadosGrilla ||
        (rowsAltaDDJJ && rowsAltaDDJJ.length > 0)) && (
        <div className="formulario_container">
          <h5 className="paso">Paso 3 - Completar el formulario</h5>
          <Box
            sx={{
              height: '600px',
              width: '100%',
              '& .actions': {
                color: 'text.secondary',
              },
              '& .textPrimary': {
                color: 'text.primary',
              },
            }}
          >
            <DDJJAltaEmpleadosGrilla
              rowsAltaDDJJ={rowsAltaDDJJ}
              setRowsAltaDDJJ={setRowsAltaDDJJ}
              camaras={camaras}
              categoriasFiltradas={categoriasFiltradas}
              setCategoriasFiltradas={setCategoriasFiltradas}
              afiliado={afiliado}
              setAfiliado={setAfiliado}
              todasLasCategorias={todasLasCategorias}
              plantas={plantas}
              validacionResponse={validacionResponse}
              setSomeRowInEditMode={setSomeRowInEditMode}
              rowModesModel={rowModesModel}
              setRowModesModel={setRowModesModel}
            />
          </Box>

          <div
            className="botones_container"
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '20px',
            }}
          >
            <Tooltip
              title={
                someRowInEditMode
                  ? 'Hay filas en edición, por favor finalice la edición antes de guardar.'
                  : ''
              }
              sx={{ marginLeft: '10px', cursor: 'pointer' }}
            >
              <span>
                <Button
                  variant="contained"
                  sx={{ padding: '6px 52px', marginLeft: '10px' }}
                  onClick={guardarDeclaracionJurada}
                  disabled={someRowInEditMode || rowsAltaDDJJ?.length === 0}
                >
                  Guardar
                </Button>
              </span>
            </Tooltip>

            {DDJJState.estado === 'PR' ? (
              <Button
                variant="contained"
                sx={{ padding: '6px 52px', marginLeft: '10px' }}
                onClick={presentarDeclaracionJurada}
                disabled={true}
              >
                Presentar
              </Button>
            ) : DDJJState.estado === 'PE' ? (
              <Button
                variant="contained"
                sx={{ padding: '6px 52px', marginLeft: '10px' }}
                onClick={presentarDeclaracionJurada}
                disabled={false}
              >
                Presentar
              </Button>
            ) : (
              <Button
                variant="contained"
                sx={{ padding: '6px 52px', marginLeft: '10px' }}
                onClick={presentarDeclaracionJurada}
                disabled={DDJJState.id ? false : true}
              >
                Presentar
              </Button>
            )}
          </div>
        </div>
      )} */}
    </div>
  );
};
