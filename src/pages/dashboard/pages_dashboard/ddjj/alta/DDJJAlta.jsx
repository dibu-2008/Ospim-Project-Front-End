import { useEffect, useState } from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { esES } from '@mui/x-date-pickers/locales';
import formatter from '@/common/formatter';
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
  tituloPrimerTab,
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
  const [someRowInEditMode, setSomeRowInEditMode] = useState(false);
  const [otroPeriodo, setOtroPeriodo] = useState(null);
  const [rowModesModel, setRowModesModel] = useState({});
  const ID_EMPRESA = localStorageService.getEmpresaId();
  const [tituloSec, setTituloSec] = useState('');
  const [tab, setTab] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [actualizacionHabilitada, setActualizacionHabilitada] = useState(true);

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
    handleExpand();
    validarDDJJ();
  }, [rowsAltaDDJJ]);

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
          setTituloSec(getTituloSec(ddjj.secuencia));
          setPeriodo(dayjs(ddjj.periodo));
          if (ddjj.estado) {
            setActualizacionHabilitada(ddjj.estado == 'PE');
          }

          const afiliadosConFilas = ddjj.afiliados.map((item, index) => ({
            ...item,
            fila: index + 1,
          }));

          // Luego, usa `setRowsAltaDDJJ` para actualizar los rows
          setRowsAltaDDJJ(afiliadosConFilas);

          //setRowsAltaDDJJ(ddjj.afiliados);
        } catch (error) {
          console.error('Error al obtener la DDJJ:', error);
        }
      }
    };
    obtenerDDJJ(DDJJState, DDJJState.id, ID_EMPRESA);
  }, [DDJJState]);

  const getCuilesValidados = async () => {
    const cuiles = afiliadoImportado.map((item) => item.cuil);
    cuiles.map((item) => console.log(item));
    const cuilesString = cuiles.map((item) => item?.toString());
    const cuilesResponse = await axiosDDJJ.validarCuiles(
      ID_EMPRESA,
      cuilesString,
    );

    console.log(cuilesResponse);

    return cuilesResponse;
  };

  const importarAfiliado = async () => {
    const cuilesResponse = await getCuilesValidados()
    const afiliadoImportadoConInte = afiliadoImportado.map((item, index) => {
      const cuilResponse = cuilesResponse.find(
        (cuil) => +cuil.cuil === item.cuil,
      );
      if (cuilResponse) {
        return { ...item, inte: cuilResponse.inte, fila: index + 1 };
      }
      return item;
    });

    // Si alguno de los cuiles el valor de cuilesValidados es igual a false
    if (cuilesResponse.some((item) => item.cuilValido === false)) {
        const mensajesFormateados2 = cuilesResponse
        .map((cuil) => {
          if (!cuil.cuilValido){
            return `<p style="margin-top:20px;">
            CUIL ${cuil.cuil} con formato inválido.</p>`;
          }
        })
        .join('');

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

  const setDDJJ = () => {
    const DDJJ = {
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
            : parseFloat(String(item.remunerativo).replace(',', '.')),
          noRemunerativo: !item.noRemunerativo
            ? null
            : parseFloat(String(item.noRemunerativo).replace(',', '.')),
          uomaSocio: item.uomaSocio === '' ? null : item.uomaSocio,
          amtimaSocio: item.amtimaSocio === '' ? null : item.amtimaSocio,
        };
        if (item.id) registroNew.id = item.id;
        return registroNew;
      }),
    };
    return DDJJ;
  };

  const deleteErroresAfiliados = (DDJJ) => {
     // Borrar la propiedad errores de cada afiliado
    // por que no se envia al backend
    DDJJ.afiliados.forEach((afiliado) => {
      delete afiliado.errores;
    });
    return DDJJ;
  };

  const setCuilesConErrores = () => {
    let cuilesConErrores = [];
    if (validacionResponse.errores) {
      cuilesConErrores = validacionResponse.errores.map((error) => error.cuil);
    }
    return cuilesConErrores;
  };

  const setErroresAfiliados = async (DDJJ, cuilesConErrores) => {
    DDJJ.afiliados.forEach((afiliado) => {
      afiliado.errores = false;
      if (cuilesConErrores.includes(afiliado.cuil.toString())) {
        afiliado.errores = true;
      }
    });
    // Buscar todos estos cuiles en el rowsAltaDDJJ, y marcarlos con errores="Si"
    rowsAltaDDJJ.forEach((afiliado) => {
      if (cuilesConErrores.includes(afiliado.cuil.toString())) {
        afiliado.errores = true;
      } else {
        afiliado.errores = false;
      }
    });
    return DDJJ
  };

  const validarDDJJ = async () => {
    let DDJJ = setDDJJ();
    if (DDJJState.id) DDJJ.id = DDJJState.id;
    DDJJ = deleteErroresAfiliados(DDJJ);
    const validacionResponse = await axiosDDJJ.validar(ID_EMPRESA, DDJJ);
    const cuilesConERR = await getCuilesValidados();
    cuilesConERR.forEach((element) => {
      if (!element.cuilValido) {
        if(validacionResponse && validacionResponse.errores)
        validacionResponse.errores.push({
          cuil: element.cuil.toString(),
          codigo: 'cuil',
          descripcion: 'CUIL INVALIDO',
          indice: null,
        });
      }
    });

    let cuilesConErrores = setCuilesConErrores();
    DDJJ = await setErroresAfiliados(DDJJ, cuilesConErrores);
    console.log(DDJJ)
    setValidacionResponse(validacionResponse); // Sirve para pintar en rojo los campos con errores

    if (validacionResponse.errores && validacionResponse.errores.length > 0) {
      const mensajesUnicos = new Set();
      console.log(validacionResponse)
      validacionResponse.errores.forEach((error) => {
        if (!mensajesUnicos.has(error.descripcion)) {
          mensajesUnicos.add(error.descripcion);
        }
      });
    }
    return DDJJ
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
          const elementos = [];
          arraySinEncabezado.forEach((item, index) => {
            if (item.length === 11) {
              const fila = {
                //indice: index + 1,
                indice: index,
                cuil: item[0],
              };
              elementos.push(fila);
            }
          });
          setFilasDoc(elementos);

          const arrayTransformado = arraySinEncabezado
            .map((item, index) => {
              if (item.length === 11 && item[0] !== undefined) {
                return {
                  //id: index + 1,
                  id: index,
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
              }
            })
            .filter((item) => item !== undefined);

          setAfiliadoImportado(arrayTransformado);
          setBtnSubirHabilitado(true);
          if (DDJJState.id) {
            confirm(
              'Recorda que si subis un archivo, se perderan los datos de la ddjj actual',
            );
          }
        }
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const handleElegirOtroChange = (event) => {
    setMostrarPeriodos(event.target.value === 'elegirOtro');
  };

  const guardarDeclaracionJurada = async () => {
    const DDJJ = await validarDDJJ()
    console.log(DDJJ)
    if (validacionResponse.errores && validacionResponse.errores.length > 0) {
      const mensajesUnicos = new Set();
      console.log(validacionResponse.errores)
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
          let bOK = false;

          DDJJ.afiliados.forEach((afiliado) => {
            delete afiliado.errores;
          });

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
          return false;
        } else {
          // NO limpiar la grilla.
          // El usuario decidio corregir los errores antes de GRABAR.
          // pero no hay que PERDER los datos.-
        }
      });
    } else {
      let bOK = false;

      DDJJ.afiliados.forEach((afiliado) => {
        delete afiliado.errores;
      });

      if (DDJJState.id) {
        bOK = await axiosDDJJ.actualizar(ID_EMPRESA, DDJJ);
      } else {
        const data = await axiosDDJJ.crear(ID_EMPRESA, DDJJ);
        if (data) {
          setDDJJState(data);
          setTituloSec(getTituloSec(data.secuencia));
        }
      }
      return true;
    }
  };

  const presentarDeclaracionJurada = async () => {
    const seguir = await guardarDeclaracionJurada();
    if (seguir) {
      if (DDJJState.id) {
        Swal.fire({
          title: 'Presentación de DDJJ en OSPIM',
          html:
            'Confirma la Presentación de la Declaración Jurada para el Período <b>' +
            formatter.periodo(periodo) +
            '</b>?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#1A76D2',
          cancelButtonColor: '#6c757d',
          confirmButtonText: 'Si, Presentar !',
        }).then(async (result) => {
          if (result.isConfirmed) {
            const data = await axiosDDJJ.presentar(ID_EMPRESA, DDJJState.id);
            DDJJState.estado = data.estado;
            DDJJState.secuencia = data.secuencia;
            if (data) {
              const newDDJJState = {
                ...DDJJState,
                estado: data.estado || null,
                secuencia: data.secuencia,
              };
              setDDJJState(newDDJJState);
              setTituloSec(getTituloSec(newDDJJState.secuencia));
            }
          }
        });
      }
    } else {
      swal.showError(
        'La declaracion jurada no se pudo presentar. Existen campos invalidos',
      );
    }
  };

  const buscarPeriodoAnterior = async () => {
    let periodoDayjs = null;
    if (!mostrarPeriodos) {
      // Ultimo periodo presentado
      const ddjjPeriodoAnterior = await axiosDDJJ.getPeriodoAnterior(
        ID_EMPRESA,
        periodoDayjs,
      );

      if (!ddjjPeriodoAnterior) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se encontró un período anterior',
        });
        return;
      }
      //setTituloSec(getTituloSec(ddjjPeriodoAnterior.secuencia));
      setRowsAltaDDJJ(ddjjPeriodoAnterior.afiliados);
      setOcultarEmpleadosGrilla(!ocultarEmpleadosGrilla);
    } else {
      periodoDayjs = dayjs(otroPeriodo.$d).format('YYYY-MM-DD');
      const ddjjOtroPeriodo = await axiosDDJJ.getPeriodoAnterior(
        ID_EMPRESA,
        periodoDayjs,
      );
      if (ddjjOtroPeriodo.length === 0) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se encontró la DDJJ para el período seleccionado.',
        });
        return;
      } else {
        setRowsAltaDDJJ(ddjjOtroPeriodo.afiliados);
        setDDJJState((prevState) => ({
          ...prevState,
          afiliados: ddjjOtroPeriodo.afiliados,
        }));
        setOcultarEmpleadosGrilla(!ocultarEmpleadosGrilla);
      }
    }
  };

  const handleExpand = () => {
    if (rowsAltaDDJJ?.length !== 0 && !expanded) {
      setExpanded(true);
    }
  };
  const handleChangeE = (event, isExpanded) => {
    setExpanded(isExpanded);
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
                    disabled={!actualizacionHabilitada}
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
                <Tab
                  label="Carga Manual"
                  onClick={(e) => handleChangeE(e, true)}
                />
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
                    disabled={!actualizacionHabilitada}
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
                  disabled={!actualizacionHabilitada}
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
                  disabled={!actualizacionHabilitada}
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
                    disabled={!actualizacionHabilitada}
                  />
                  <Box className="elegir_otro_container">
                    {mostrarPeriodos && actualizacionHabilitada && (
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
                              disabled={!actualizacionHabilitada}
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
                  disabled={!actualizacionHabilitada}
                >
                  Buscar
                </Button>
              </Box>
            </CustomTabPanel>
          </AccordionDetails>
        </Accordion>
      </div>

      <div className="presentacion_container">
        <Accordion expanded={expanded} onChange={handleChangeE}>
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
                actualizacionHabilitada={actualizacionHabilitada}
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
                    disabled={
                      someRowInEditMode ||
                      rowsAltaDDJJ?.length === 0 ||
                      !actualizacionHabilitada
                    }
                  >
                    Guardar
                  </Button>
                </span>
              </Tooltip>

              <Button
                variant="contained"
                sx={{ padding: '6px 52px', marginLeft: '10px' }}
                onClick={presentarDeclaracionJurada}
                disabled={!actualizacionHabilitada || !DDJJState.id}
              >
                Presentar
              </Button>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
};
