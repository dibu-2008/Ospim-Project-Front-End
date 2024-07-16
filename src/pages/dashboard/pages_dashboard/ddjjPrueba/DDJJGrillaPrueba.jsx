import { useState, useEffect, useContext } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import PropTypes from 'prop-types';
import CurrencyInput from 'react-currency-input-field';
import { formatValue } from 'react-currency-input-field';
import { UserContext } from '@/context/userContext';
import formatter from '@/common/formatter';
import swal from '@/components/swal/swal';
import { axiosDDJJ } from '../ddjj/alta/DDJJAltaApi';
import localStorageService from '@/components/localStorage/localStorageService';
import { StripedDataGrid, dataGridStyle } from '@/common/dataGridStyle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Close';
import CreateIcon from '@mui/icons-material/Create';
import Switch from '@mui/material/Switch';
import { DDJJArchivoImport } from '@pages/dashboard/pages_dashboard/ddjjPrueba/DDJJArchivoImport';
import { DDJJCuilForm } from '@pages/dashboard/pages_dashboard/ddjjPrueba/DDJJCuilForm';
import { useGridValidaciones } from './useGridValidaciones';
import { useGridCrud } from './useGridCrud';
import {
  Stack,
  Typography,
  Tab,
  Tabs,
  Button,
  TextField,
  Select,
  Radio,
  RadioGroup,
  MenuItem,
  FormControlLabel,
  Box,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  GridRowModes,
  GridToolbar,
  GridToolbarContainer,
  GridActionsCellItem,
  useGridApiRef,
} from '@mui/x-data-grid';

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//        MOCK: carga de 3000 registros.-
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

let rowsNew = [];
const regNew = {
  id: 1,
  gErrores: false,

  regId: null,
  cuil: '23279737229',
  apellido: 'VÁZQUEZ',
  nombre: 'LOT',
  fechaIngreso: '2021-01-01',
  empresaDomicilioId: 41,
  camara: 'FAIM',
  categoria: 'B',
  remunerativo: 100580500,
  noRemunerativo: 100,
  uomaSocio: false,
  amtimaSocio: false,
  aportes: [
    {
      codigo: 'ART46',
      importe: 482.66,
    },
    {
      codigo: 'UOMACU',
      importe: 1005805,
    },
  ],
};
const regNew2 = { ...regNew };
regNew2.cuil = '20233725006';
regNew2.regId = 1;
rowsNew.push(regNew2);

for (let i = 2; i < 30; i++) {
  const regNewN = { ...regNew };

  regNewN.regId = i;

  regNewN.id = i;
  regNewN.gErrores = false;
  if (i % 2 == 0) {
    regNewN.gErrores = true;
  }

  regNewN.apellido =
    regNewN.apellido + ' ' + regNewN.regId + '-' + regNewN.gErrores;
  //console.log('regNewN.errores:', regNewN.errores);
  rowsNew.push(regNewN);
}

console.log('INIT - rowsNew:', rowsNew);

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
function EditToolbar(props) {
  const {
    setRows,
    rows,
    setRowModesModel,
    showQuickFilter,
    themeWithLocale,
    filtrarGrilla,
    gridApiRef,
    setSortModel,
  } = props;

  const getNewReg = () => {
    let vecId = gridApiRef.current.getAllRowIds();
    console.log('getNewReg - vecId.length:', vecId.length);
    console.log('getNewReg - vecId:', vecId);

    console.log('getNewReg - getRowModels:', gridApiRef.current.getRowModels());

    let maxId = 1;

    if (vecId.length > 0) maxId = Math.max(...vecId, 0);
    console.log('getNewReg - maxId:', maxId);

    const newId = maxId + 1;
    const newReg = {
      id: newId,
      gErrores: false,

      regId: null,
      cuil: '',
      apellido: '',
      nombre: '',
      camara: '',
      fechaIngreso: '',
      empresaDomicilioId: '',
      categoria: '',
      remunerativo: '',
      noRemunerativo: '',
      uomaSocio: '',
      amtimaSocio: '',
    };
    return newReg;
  };

  const toolbarHandleClickAlta = () => {
    console.log('toolbarHandleClickAlta - rows:', rows);

    setSortModel([]);
    const newReg = getNewReg();
    console.log('toolbarHandleClickAlta - newReg:', newReg);
    gridApiRef.current.updateRows([newReg]);

    setRowModesModel((oldModel) => ({
      ...oldModel,
      [newReg.id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));

    setSortModel([
      {
        field: 'id',
        sort: 'desc',
      },
    ]);
    gridApiRef.current.setPage(0);
  };

  return (
    <GridToolbarContainer
      theme={themeWithLocale}
      style={{ display: 'flex', justifyContent: 'space-between' }}
    >
      <Button
        color="primary"
        startIcon={<AddIcon />}
        onClick={toolbarHandleClickAlta}
      >
        Nuevo Registro
      </Button>
      <FormControlLabel
        control={<Switch color="primary" />}
        label="Cuiles con Errores"
        labelPlacement="start"
        onChange={filtrarGrilla}
      ></FormControlLabel>
      <GridToolbar showQuickFilter={showQuickFilter} />
    </GridToolbarContainer>
  );
}
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

export const DDJJGrillaPrueba = (idDDJJ) => {
  const ID_EMPRESA = localStorageService.getEmpresaId();
  const [ddjjCabe, setDdjjCabe] = useState({
    id: null,
    periodo: null,
    empresaId: ID_EMPRESA,
  });
  console.log('DDJJGrillaPrueba - idDDJJ:', idDDJJ);
  /*
  if (idDDJJ && ) {
    const ddjjCabeNew = { ...ddjjCabe, id: idDDJJ };
    setDdjjCabe(ddjjCabeNew);
  }
*/
  const gridApiRef = useGridApiRef();
  const [rows, setRows] = useState([]); //Con esto lleno la grilla
  //rowsNew => es el vector que viene de Archivo o de Backend antes de cargar la grilla.-
  const [rowsValidaciones, setRowsValidaciones] = useState([]); //Usado para "Pintar" errores en la grilla.-
  useGridValidaciones.getRowsValidaciones = rowsValidaciones;
  useGridValidaciones.setRowsValidaciones = setRowsValidaciones;
  const [rowModesModel, setRowModesModel] = useState({});
  useGridCrud.getRowModesModel = rowModesModel;
  useGridCrud.setRowModesModel = setRowModesModel;

  const [filterModel, setFilterModel] = useState({ items: [] });
  const [sortModel, setSortModel] = useState([
    {
      field: 'id',
      sort: 'asc',
    },
  ]);

  const {
    paginationModel,
    setPaginationModel,
    pageSizeOptions,
    themeWithLocale,
  } = useContext(UserContext);

  const [actualizacionHabilitada, setActualizacionHabilitada] = useState(true);

  const [formCuilReg, setFormCuilReg] = useState({});
  const [formCuilShow, setFormCuilShow] = useState(false);
  const [camaras, setCamaras] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [plantas, setPlantas] = useState([]);

  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  const tituloSec = 'PRUEBA tituloSec';
  const [mostrarPeriodos, setMostrarPeriodos] = useState(false);
  const [tab, setTab] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [someRowInEditMode, setSomeRowInEditMode] = useState(false);
  const [rowsAltaDDJJ, setRowsAltaDDJJ] = useState([]);
  const [DDJJState, setDDJJState] = useState({});
  const handleChange = (event, newValue) => {
    setTab(newValue);
  };
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

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

  const handleElegirOtroChange = (event) => {
    setMostrarPeriodos(event.target.value === 'elegirOtro');
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
  const handleChangeE = (event, isExpanded) => {
    setExpanded(isExpanded);
  };
  const guardarDeclaracionJurada = async () => {
    const DDJJ = await validarDDJJ();
    console.log(DDJJ);
    if (validacionResponse.errores && validacionResponse.errores.length > 0) {
      const mensajesUnicos = new Set();
      console.log(validacionResponse.errores);
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
                      <label for="guardarErrores">Puede guardar la DDJJ y corregir los errores en otro momento antes de presentar</label>`,
        showConfirmButton: true,
        confirmButtonText: 'OK',
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
        const confirm = {
          titulo: 'Presentación de DDJJ',
          texto:
            'Confirma la Presentación de la Declaración Jurada para el Período <b>' +
            formatter.periodo(periodo) +
            '</b>?',
          esHtml: true,
          textoBtnOK: 'Si, Presentar !',
        };
        Swal.fire(swal.getSettingConfirm(confirm)).then(async (result) => {
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
  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

  // Eventos

  const handleFormCuilOpen = (row) => () => {
    //EX handleDataModal
    console.log('handleFormCuilOpen - INIT');
    setFormCuilReg({
      cuil: row.cuil,
      apellido: row.apellido,
      nombre: row.nombre,
    });
    let auxx = true;
    if (formCuilShow) {
      auxx = false;
    } else {
      auxx = true;
    }

    console.log('handleFormCuilOpen - formCuilShow:', formCuilShow);
    console.log('-------------------------------------');
    console.log('handleFormCuilOpen - auxx:', auxx);
    setFormCuilShow(auxx);
    console.log('-------------------------------------');
    console.log('handleFormCuilOpen - FIN ');
  };
  const obtenerAfiliados = async (id, cuilNew) => {
    console.log('obtenerAfiliados - cuilNew:', cuilNew);
    console.log('obtenerAfiliados - id:', id);

    let afiliados = null;

    const rta = await getAfiliadoEnNomina(cuilNew);
    console.log('obtenerAfiliados - rta:', rta);
    if (rta.error != 'OK') {
      swal.showWarning(rta.error);
      setAfiliadoGrilla(id, cuilNew, '', '');
      return;
    }

    console.log('obtenerAfiliados - (2)');
    const afiliadoDB = rta.afiliados?.find(
      (afiliado) => afiliado.cuil === cuilNew,
    );

    console.log('obtenerAfiliados - (3)');
    if (!afiliadoDB) {
      swal.showWarning(
        'CUIL inexistente en la nómina de Afiliados. El mismo sera dado de alta cuando registre la DDJJ.',
      );
      setAfiliadoGrilla(id, cuilNew, '', '');
    } else {
      setAfiliadoGrilla(id, cuilNew, afiliadoDB.apellido, afiliadoDB.nombre);
      //setAfiliado(afiliadoDB); //TODO: En codigo Original=> viene del padre !!!
    }
    console.log('obtenerAfiliados - FIN');
  };
  const getAfiliadoEnNomina = async (cuil) => {
    const rta = {};
    if (cuil === '') {
      rta.error = 'Debe ingresar un CUIL y presionar la lupa';
      return rta;
    }

    if (cuil.length != 11) {
      rta.error = 'El CUIL ingresado es incorrecto, debe tener 11 dígitos.';
      return rta;
    }

    const validoCuil = await axiosDDJJ.validarCuil(cuil);
    if (!validoCuil || !validoCuil.resultado) {
      rta.error = 'El CUIL ingresado no es válido.';
      return rta;
    }

    //const afiliados = await axiosDDJJ.getAfiliado(cuil);
    rta.error = 'OK';
    rta.afiliados = await axiosDDJJ.getAfiliado(cuil);
    //console.log('validarAfiliado - OK !!!!');

    return rta;
  };
  const setAfiliadoGrilla = (id, cuil, apellido, nombre) => {
    console.log('setAfiliadoGrilla - id:', id);
    gridApiRef.current.setEditCellValue({
      id: id,
      field: 'cuil',
      value: cuil,
    });

    // Apellido
    gridApiRef.current.setEditCellValue({
      id: id,
      field: 'apellido',
      value: apellido,
    });

    // Nombre
    gridApiRef.current.setEditCellValue({
      id: id,
      field: 'nombre',
      value: nombre,
    });
    const textFieldNombre = document.getElementById('nombre' + id);
  };
  const filtrarGrilla = () => {
    console.log(
      'filtrarGrilla - gridApiRef.current.getRowModels(): ',
      gridApiRef.current.getRowModels(),
    );
    console.log('filtrarGrilla - filterModel:', filterModel);

    const newFilterModel = { ...filterModel };
    if (filterModel.items.length == 0) {
      console.log('filtrarGrilla - filterModel.items.length == 0');
      newFilterModel.items = [
        {
          field: 'gErrores',
          operator: 'is',
          value: 'true',
        },
        /*{field: 'apellido',operator: 'contains',value: 'P',},*/
      ];
    } else {
      console.log('filtrarGrilla - filterModel.items.length != 0');
      newFilterModel.items = [];
    }
    setFilterModel(newFilterModel);
    console.log('2 filtrarGrilla - newFilterModel:', newFilterModel);
    console.log('filtrarGrilla - FINAL');
  };
  const getCellClassName = (params) => {
    let cellClassName = '';

    rowsValidaciones?.errores?.forEach((error) => {
      if (
        params.row.cuil?.toString() === error.cuil &&
        params.field === error.codigo
      ) {
        cellClassName = 'hot';
      }
    });

    // Action no implementar estilos hot o cold
    if (params.field === 'actions') {
      cellClassName = '';
    }

    return cellClassName;
  };

  const getCategoriasCamara = (codigoCamara) => {
    const filtroCategorias = categorias.filter(
      (categoria) => categoria.camara === codigoCamara,
    );
    const soloCategorias = filtroCategorias.map((item) => item.categoria);
    return soloCategorias;
  };

  const handlerGrillaActualizarImportArchivo = async (vecDatos) => {
    //recibe vecDatos de Archivo para actualizar Grilla.-
    console.log(
      '** handlerGrillaActualizarImportArchivo - vecDatos: ',
      vecDatos,
    );
    const rowsNew = await useGridValidaciones.validarDDJJ(ddjjCabe, vecDatos);
    console.log(
      '** handlerGrillaActualizarImportArchivo - validarDDJJ() - rowsNew: ',
      rowsNew,
    );
    setRows(rowsNew);
  };

  //DataLoad del Componente
  useEffect(() => {
    const ObtenerCamaras = async () => {
      const data = await axiosDDJJ.getCamaras();
      setCamaras(data.map((item, index) => ({ id: index + 1, ...item })));
    };
    const ObtenerCategorias = async () => {
      const data = await axiosDDJJ.getCategorias();
      setCategorias(data.map((item, index) => ({ id: index + 1, ...item })));
    };
    const ObtenerPlantaEmpresas = async () => {
      const data = await axiosDDJJ.getPlantas(ID_EMPRESA);
      setPlantas(data.map((item) => ({ id: item, ...item })));
    };

    ObtenerCamaras();
    ObtenerCategorias();
    ObtenerPlantaEmpresas();
    //MOCK:...
    //validarDDJJ();
    console.log('** ddjjCabe:', ddjjCabe);
    useGridValidaciones.validarDDJJ(ddjjCabe, rowsNew);
    console.log('** 1) useEffect - validarDDJJ() - rowsNew: ', rowsNew);
    setRows(rowsNew);
  }, []);

  /*
  useEffect(() => {
    console.log('** 2) useEffect[rows] - validarDDJJ() - rowsNew: ', rowsNew);
    validarDDJJ();
  }, [rows]);
*/
  //TEST
  useEffect(() => {
    //MOCK:...
    console.log('** formCuilShow: ', formCuilShow);
  }, [formCuilShow]);

  const columns = [
    {
      field: 'id',
      type: 'number',
      headerName: 'Fila',
      width: 150,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
      renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Acciones',
      width: 100,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
      getActions: ({ row }) => {
        const isInEditMode = rowModesModel[row.id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={() => {
                useGridCrud.handleSaveClick(row.id);
              }}
              disabled={!actualizacionHabilitada}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={() => {
                useGridCrud.handleCancelClick(gridApiRef, row);
              }}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={() => {
              useGridCrud.handleEditClick(row.id);
            }}
            color="inherit"
            disabled={!actualizacionHabilitada}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => {
              useGridCrud.handleDeleteClick(gridApiRef, row);
            }}
            color="inherit"
            disabled={!actualizacionHabilitada}
          />,
        ];
      },
    },
    {
      field: 'cuil',
      type: 'string',
      headerName: 'CUIL',
      width: 284.4,
      editable: true,
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'header--cell',
      renderEditCell: (params) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              id={params.row.id ? 'cuil' + params.row.id.toString() : ''}
              fullWidth
              value={params.value || ''}
              onChange={(event) => {
                const newValue = event.target.value;

                params.api.setEditCellValue({
                  id: params.id,
                  field: 'cuil',
                  value: newValue,
                });
              }}
              onBlur={(event) => {
                obtenerAfiliados(params.id, params.value);
              }}
              onFocus={(event) => {
                const cuilActual = params.api.getCellValue(params.id, 'cuil');
                console.log('onFocus - cuilActual:', cuilActual);
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'transparent',
                  },
                  '&:hover fieldset': {
                    borderColor: 'transparent',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'transparent',
                  },
                },
              }}
            />

            <CreateIcon
              sx={{
                fontSize: '1.8rem',
                color: '#1A76D2',
                cursor: 'pointer',
              }}
              onClick={handleFormCuilOpen(params.row)}
            />
          </div>
        );
      },
    },
    {
      field: 'apellido',
      type: 'string',
      headerName: 'Apellido',
      width: 140,
      editable: true,
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'header--cell',
      valueParser: (value, row, column, apiRef) => {
        return value?.toUpperCase();
      },
      renderEditCell: (params) => {
        return (
          <TextField
            id={params.row.id ? 'apellido' + params.row.id.toString() : ''}
            fullWidth
            value={params.value || ''}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  backgroundColor:
                    params.row?.cuil === '' ? 'white' : 'transparent',
                  borderColor: 'transparent',
                },
                '&:hover fieldset': {
                  borderColor: 'transparent',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'transparent',
                },
              },
            }}
            onChange={(event) => {
              const newValue = event.target.value;
              params.api.setEditCellValue({
                id: params.id,
                field: 'apellido',
                value: newValue,
              });
            }}
            onBlur={async (event) => {
              const newValue = event.target.value;
              const cuilActual = params.api.getCellValue(params.id, 'cuil');
              console.log('onBlur - cuilActual:', cuilActual);
              const rtaValidacion = await getAfiliadoEnNomina(cuilActual);
              console.log('onBlur - strValidacion:', rtaValidacion);
              if (rtaValidacion.error == 'OK') {
                if (rtaValidacion.afiliados.length > 0) {
                  console.log(
                    'onBlur - rtaValidacion.afiliados[0].apellido:',
                    rtaValidacion.afiliados[0].apellido,
                  );
                  if (rtaValidacion.afiliados[0].apellido != newValue) {
                    params.api.setEditCellValue({
                      id: params.id,
                      field: 'apellido',
                      value: rtaValidacion.afiliados[0].apellido,
                    });
                    swal.showWarning(
                      'Para editar los datos del CUIL, debe utilizar el icono de Edición de la columna CUIL ',
                    );
                  }
                }
              }
            }}
          />
        );
      },
    },
    {
      field: 'nombre',
      type: 'string',
      headerName: 'Nombre',
      width: 140,
      editable: true,
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'header--cell',
      valueParser: (value, row, column, apiRef) => {
        return value?.toUpperCase();
      },
      renderEditCell: (params) => {
        return (
          <TextField
            id={params.row.id ? 'nombre' + params.row.id.toString() : ''}
            fullWidth
            value={params.value || ''}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  backgroundColor:
                    params.row?.cuil === '' ? 'white' : 'transparent',
                  borderColor: 'transparent',
                },
                '&:hover fieldset': {
                  borderColor: 'transparent',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'transparent',
                },
              },
            }}
            onChange={(event) => {
              const newValue = event.target.value;
              params.api.setEditCellValue({
                id: params.id,
                field: 'nombre',
                value: newValue,
              });
            }}
            onBlur={async (event) => {
              const newValue = event.target.value;
              const cuilActual = params.api.getCellValue(params.id, 'cuil');
              console.log('onBlur - cuilActual:', cuilActual);
              const rtaValidacion = await getAfiliadoEnNomina(cuilActual);
              console.log('onBlur - strValidacion:', rtaValidacion);
              if (rtaValidacion.error == 'OK') {
                if (rtaValidacion.afiliados.length > 0) {
                  console.log(
                    'onBlur - rtaValidacion.afiliados[0].nombre:',
                    rtaValidacion.afiliados[0].nombre,
                  );
                  if (rtaValidacion.afiliados[0].nombre != newValue) {
                    params.api.setEditCellValue({
                      id: params.id,
                      field: 'nombre',
                      value: rtaValidacion.afiliados[0].nombre,
                    });
                    swal.showWarning(
                      'Para editar los datos del CUIL, debe utilizar el icono de Edición de la columna CUIL ',
                    );
                  }
                }
              }
            }}
          />
        );
      },
    },
    {
      field: 'camara',
      headerName: 'Cámara',
      width: 100,
      editable: true,
      headerAlign: 'left',
      align: 'left',
      type: 'singleSelect',
      valueFormatter: ({ value }) => value || '',
      valueOptions: camaras.map(({ codigo, descripcion }) => {
        return { value: codigo, label: descripcion };
      }),
      headerClassName: 'header--cell',
      renderEditCell: (params) => {
        return (
          <Select
            fullWidth
            value={params.value !== null ? params.value : ''}
            onChange={(event) => {
              params.api.setEditCellValue({
                id: params.id,
                field: 'categoria',
                value: '',
              });
              params.api.setEditCellValue({
                id: params.id,
                field: 'camara',
                value: event.target.value,
              });
            }}
          >
            {camaras.map((camara) => {
              return (
                <MenuItem
                  key={camara.codigo}
                  value={camara.codigo}
                  onClick={() => {
                    const vec = getCategoriasCamara(camara.codigo);
                    params.api.setEditCellValue({
                      id: params.id,
                      field: 'categoria',
                      value: vec[0],
                    });
                  }}
                >
                  {camara.descripcion}
                </MenuItem>
              );
            })}
          </Select>
        );
      },
    },
    {
      field: 'categoria',
      type: 'singleSelect',
      headerName: 'Categoría',
      width: 80,
      editable: true,
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'header--cell',
      valueFormatter: ({ value }) => value || '',
      renderEditCell: (params) => {
        console.log(params.row.camara);
        const categoriasCamara = getCategoriasCamara(params.row.camara);
        return (
          <Select
            fullWidth
            value={categoriasCamara.length > 0 ? params.value : ''}
            onChange={(event) => {
              params.api.setEditCellValue({
                id: params.id,
                field: 'categoria',
                value: event.target.value,
              });
            }}
          >
            {categoriasCamara.map((categoria) => {
              return (
                <MenuItem key={categoria} value={categoria}>
                  {categoria}
                </MenuItem>
              );
            })}
          </Select>
        );
      },
    },
    {
      field: 'fechaIngreso',
      type: 'date',
      headerName: 'Ingreso',
      width: 150,
      editable: true,
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'header--cell',

      valueGetter: ({ value }) => {
        return formatter.dateObject(value);
      },
      valueFormatter: ({ value }) => {
        return formatter.dateString(value);
      },
    },
    {
      field: 'empresaDomicilioId',
      type: 'singleSelect',
      headerName: 'Planta',
      width: 100,
      editable: true,
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'header--cell',
      valueOptions: plantas,
      valueFormatter: ({ value }) => {
        if (value === '') return '';
        if (value === null) return '';
        return plantas.find((planta) => planta.id === value)?.planta || '';
      },
      renderEditCell: (params) => {
        return (
          <Select
            fullWidth
            value={params.value || ''}
            onChange={(event) => {
              params.api.setEditCellValue({
                id: params.id,
                field: 'empresaDomicilioId',
                value: event.target.value,
              });
            }}
          >
            {plantas.map((planta) => {
              return (
                <MenuItem key={planta.id} value={planta.id}>
                  {planta.planta}
                </MenuItem>
              );
            })}
          </Select>
        );
      },
    },
    {
      field: 'remunerativo',
      type: 'string',
      headerName: 'Remunerativo',
      width: 150,
      editable: true,
      headerAlign: 'left',
      align: 'right',
      headerClassName: 'header--cell',
      valueFormatter: ({ value }) => {
        const formattedValue = formatValue({
          value: value?.toString(),
          groupSeparator: '.',
          decimalSeparator: ',',
          decimalScale: 2,
        });
        return formattedValue;
      },
      renderEditCell: (params) => {
        //console.log('renderEditCell-params: ', params);
        return (
          <CurrencyInput
            id={params.row.id ? 'remunerativo' + params.row.id.toString() : ''}
            className="input-currency"
            decimalScale={2}
            decimalSeparator=","
            groupSeparator="."
            value={params.value || ''}
            onValueChange={(value, name, values) => {
              params.api.setEditCellValue({
                id: params.id,
                field: 'remunerativo',
                value: values.value,
              });
            }}
          />
        );
      },
    },
    {
      field: 'noRemunerativo',
      type: 'string',
      renderHeader: () => (
        <div style={{ textAlign: 'left', color: '#fff', fontSize: '0.8rem' }}>
          <span role="img" aria-label="enjoy">
            No
            <br />
            Remunerativo
          </span>
        </div>
      ),
      width: 150,
      editable: true,
      headerAlign: 'left',
      align: 'right',
      headerClassName: 'header--cell',
      valueFormatter: ({ value }) => {
        if (value === '') return '';
        if (value === null) return '';
        const formattedValue = formatValue({
          value: value?.toString(),
          groupSeparator: '.',
          decimalSeparator: ',',
          decimalScale: 2,
        });
        return formattedValue;
      },
      renderEditCell: (params) => {
        return (
          <CurrencyInput
            id={
              params.row.id ? 'noRemunerativo' + params.row.id.toString() : ''
            }
            className="input-currency"
            //prefix="$"
            decimalScale={2}
            decimalSeparator=","
            groupSeparator="."
            value={params.value || ''}
            onValueChange={(value, name, values) => {
              params.api.setEditCellValue({
                id: params.id,
                field: 'noRemunerativo',
                value: values.value,
              });
            }}
          />
        );
      },
    },
    {
      field: 'uomaSocio',
      type: 'singleSelect',
      renderHeader: () => (
        <div style={{ textAlign: 'center', color: '#fff', fontSize: '0.8rem' }}>
          <span role="img" aria-label="enjoy">
            Adherido
            <br />
            sindicato
          </span>
        </div>
      ),
      width: 100,
      editable: true,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
      valueOptions: [
        { value: true, label: 'Si' },
        { value: false, label: 'No' },
      ],
      valueFormatter: ({ value }) => {
        if (value === '') return '';
        if (value === null) return '';
        return value ? 'Si' : 'No';
      },
      renderEditCell: (params) => {
        return (
          <Select
            fullWidth
            value={params.value !== null ? params.value : ''}
            onChange={(event) => {
              params.api.setEditCellValue({
                id: params.id,
                field: 'uomaSocio',
                value: event.target.value,
              });
            }}
          >
            <MenuItem value={true}>Si</MenuItem>
            <MenuItem value={false}>No</MenuItem>
          </Select>
        );
      },
    },
    {
      field: 'amtimaSocio',
      type: 'singleSelect',
      renderHeader: () => (
        <div style={{ textAlign: 'center', color: '#fff', fontSize: '0.8rem' }}>
          <span role="img" aria-label="enjoy">
            Paga
            <br />
            mutual
          </span>
        </div>
      ),
      width: 100,
      editable: true,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
      valueOptions: [
        { value: true, label: 'Si' },
        { value: false, label: 'No' },
      ],
      valueFormatter: ({ value }) => {
        if (value === '') return '';
        if (value === null) return '';
        return value ? 'Si' : 'No';
      },
      renderEditCell: (params) => {
        return (
          <Select
            fullWidth
            value={params.value !== null ? params.value : ''}
            onChange={(event) => {
              params.api.setEditCellValue({
                id: params.id,
                field: 'amtimaSocio',
                value: event.target.value,
              });
            }}
          >
            <MenuItem value={true}>Si</MenuItem>
            <MenuItem value={false}>No</MenuItem>
          </Select>
        );
      },
    },
    {
      field: 'errores',
      headerName: 'Errores',
      width: 100,
      type: 'boolean',
    },
  ];

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
              <DemoContainer components={['DatePicker']}>
                <DesktopDatePicker
                  label={'Periodo'}
                  views={['month', 'year']}
                  closeOnSelect={true}
                  //onChange={handleChangePeriodo}
                  onChange={(date) => {
                    validarPeriodo(date);
                    setPeriodo(date);
                  }}
                  //value={periodo}
                  disabled={!actualizacionHabilitada}
                />
              </DemoContainer>

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
              <Box>
                <DDJJArchivoImport
                  ddjjCabe={ddjjCabe}
                  handlerGrillaActualizar={handlerGrillaActualizarImportArchivo}
                  plantas={plantas}
                  camaras={camaras}
                  categoriasPorCamara={categorias}
                ></DDJJArchivoImport>
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
                        <DemoContainer components={['DatePicker']}>
                          <DesktopDatePicker
                            label={'Otro período'}
                            views={['month', 'year']}
                            closeOnSelect={true}
                            onChange={(date) => setOtroPeriodo(date)}
                            value={otroPeriodo}
                            disabled={!actualizacionHabilitada}
                          />
                        </DemoContainer>
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
                height: '80%',
                width: '100%',
                '& .actions': {
                  color: 'text.secondary',
                },
                '& .textPrimary': {
                  color: 'text.primary',
                },
                '& .cold': {
                  backgroundColor: '#b9d5ff91',
                  color: '#1a3e72',
                },
                '& .hot': {
                  backgroundColor: '#ff943975',
                  color: '#1a3e72',
                },
              }}
            >
              <ThemeProvider theme={themeWithLocale}>
                <StripedDataGrid
                  rows={rows || []}
                  columns={columns}
                  editMode="row"
                  filterModel={filterModel}
                  sortModel={sortModel}
                  rowModesModel={rowModesModel}
                  onRowModesModelChange={(newRowModesModel) => {
                    useGridCrud.handleRowModesModelChange(newRowModesModel);
                  }}
                  onRowEditStop={(params) => {
                    useGridCrud.handleRowEditStop(gridApiRef, params);
                  }}
                  processRowUpdate={(newRow) => {
                    return useGridCrud.processRowUpdate(ddjjCabe, newRow);
                  }}
                  onProcessRowUpdateError={(error) => {
                    useGridCrud.onProcessRowUpdateError(error);
                  }}
                  getRowClassName={(params) => {
                    if (rows && rows.indexOf)
                      rows.indexOf(params.row) % 2 === 0 ? 'even' : 'odd';
                  }}
                  localeText={dataGridStyle.toolbarText}
                  slots={{
                    toolbar: EditToolbar,
                  }}
                  slotProps={{
                    toolbar: {
                      setRows,
                      rows,
                      setRowModesModel,
                      showQuickFilter: true,
                      themeWithLocale,
                      filtrarGrilla,
                      gridApiRef,
                      setSortModel,
                    },
                  }}
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  pageSizeOptions={pageSizeOptions}
                  apiRef={gridApiRef}
                  className="afiliados"
                  columnVisibilityModel={{ errores: false }}
                  timezoneOffset={null}
                  sx={{
                    '& .MuiDataGrid-virtualScroller::-webkit-scrollbar': {
                      width: '8px',
                      visibility: 'visible',
                    },
                    '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb': {
                      backgroundColor: '#ccc',
                    },
                    '& .css-1iyq7zh-MuiDataGrid-columnHeaders': {
                      backgroundColor: '#1A76D2 !important',
                    },
                    '& .art46--cell': {
                      backgroundColor: '#ccc',
                    },
                  }}
                  getCellClassName={getCellClassName}
                />
              </ThemeProvider>
              <div
                style={{
                  marginTop: '20px',
                }}
              ></div>
            </Box>
            <DDJJCuilForm
              regCuil={formCuilReg}
              formShow={formCuilShow}
              setFormShow={setFormCuilShow}
            ></DDJJCuilForm>

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
