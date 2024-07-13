import { useState, useEffect, useContext } from 'react';
import { ThemeProvider } from '@mui/material/styles';
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
import { DDJJCuilForm } from '@pages/dashboard/pages_dashboard/ddjjPrueba/DDJJCuilForm';
import {
  Button,
  Radio,
  RadioGroup,
  TextField,
  Select,
  MenuItem,
  IconButton,
  alpha,
  Modal,
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

import {
  GridRowModes,
  DataGrid,
  GridToolbar,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
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
for (let i = 1; i < 30; i++) {
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

export const DDJJGrillaPrueba = () => {
  const ID_EMPRESA = localStorageService.getEmpresaId();
  const [ddjjCabe, setDdjjCabe] = useState({
    id: null,
    periodo: null,
    empresaId: ID_EMPRESA,
  });

  const gridApiRef = useGridApiRef();
  const [rows, setRows] = useState([]); //Con esto lleno la grilla
  //rowsNew => es el vector que viene de Archivo o de Backend antes de cargar la grilla.-
  const [rowsValidaciones, setRowsValidaciones] = useState([]); //Usado para "Pintar" errores en la grilla.-
  const [filterModel, setFilterModel] = useState({ items: [] });
  const [sortModel, setSortModel] = useState([
    {
      field: 'id',
      sort: 'asc',
    },
  ]);
  const [rowModesModel, setRowModesModel] = useState({});
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

  //Grilla - Eventos
  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };
  const handleRowEditStop = (params) => {
    console.log('handleRowEditStop - RUN');
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      gridApiRef.current?.stopRowEditMode({
        id: params.id,
        ignoreModifications: false,
      });
    }
  };
  const handleEditClick = (id) => () => {
    console.log('handleEditClick - id: ' + id);
    //const editedRow = rows.find((row) => row.id === id);
    //getCategoriasCamara(editedRow.camara);
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.Edit },
    });
  };
  const handleDeleteClick = (row) => async () => {
    gridApiRef.current.updateRows([{ id: row.id, _action: 'delete' }]);

    const newRowsValidaciones = { ...rowsValidaciones };
    newRowsValidaciones.errores = newRowsValidaciones.errores.filter((item) => {
      if (row.cuil !== item.cuil) {
        return item;
      }
    });
    setRowsValidaciones(newRowsValidaciones);
  };
  const handleSaveClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View },
    });
  };
  const handleCancelClick = (row) => () => {
    setRowModesModel({
      ...rowModesModel,
      [row.id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    //const editedRow = rows.find((row) => row.id === id);
    if (row.regId || row.regId == null) {
      gridApiRef.current.updateRows([{ id: row.id, _action: 'delete' }]);
      //setRows(rows.filter((row) => row.id !== id));
    }
  };
  const processRowUpdate = async (newRow) => {
    try {
      //console.log('processRowUpdate - newRow:', newRow);
      //Actualizar newRow.gErrores
      const DDJJ = getDDJJDtoCabecera();
      const DDJJAfiliadoDto = castRowToBackendDto(newRow);
      DDJJ.afiliados.push(DDJJAfiliadoDto);
      //console.log('processRowUpdate - DDJJ:', DDJJ);

      const valDDJJResponse = await axiosDDJJ.validar(ID_EMPRESA, DDJJ);
      //console.log('processRowUpdate - valDDJJResponse:', valDDJJResponse);

      if (
        valDDJJResponse &&
        valDDJJResponse.errores &&
        valDDJJResponse.errores.length > 0
      ) {
        //console.log('rowsValidaciones: ', rowsValidaciones);
        const newRowsValidaciones = { ...rowsValidaciones };
        //console.log('newRowsValidaciones: ', newRowsValidaciones);
        valDDJJResponse.errores.map((item) => {
          newRowsValidaciones.errores.push(item);
        });
        //console.log('newRowsValidaciones: ', rowsValidaciones);

        setRowsValidaciones(newRowsValidaciones);
        newRow.gErrores = true;
      }
      //console.log('processRowUpdate - newRow:', newRow);
      return newRow;
    } catch (error) {
      console.log(error);
    }
  };
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
    console.log('filtrarGrilla - rowsAltaDDJJ:', rows);
    let newFilterModel = null;
    if (filterModel.items.length == 0) {
      newFilterModel = {
        items: [
          {
            field: 'gErrores',
            operator: 'is',
            value: 'true',
          },
          /*{field: 'apellido',operator: 'contains',value: 'P',},*/
        ],
      };
    } else {
      newFilterModel = {
        items: [],
      };
    }

    setFilterModel(newFilterModel);
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

  const getDDJJ = () => {
    //Castea "rowsNew" a BackendDto
    console.log(
      'getDDJJ - gridApiRef.current.getRowModels(): ',
      gridApiRef.current.getRowModels(),
    );
    const DDJJ = getDDJJDtoCabecera();

    //rowsNew: viene de Archivo o Backend
    rowsNew.map(function (item) {
      const registroNew = castRowToBackendDto(item);
      DDJJ.afiliados.push(registroNew);
    });

    return DDJJ;
  };
  const getDDJJDtoCabecera = () => {
    const DDJJ = {
      periodo: ddjjCabe.periodo,
      id: ddjjCabe.id,
      afiliados: [],
    };
    return DDJJ;
  };
  const castRowToBackendDto = (item) => {
    const registroNew = {
      //errores: item.gErrores,
      cuil: !item.cuil ? null : item.cuil,
      //inte: item.inte,
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
    if (item.regId) registroNew.id = item.regId;

    return registroNew;
  };
  const validarDDJJ = async () => {
    let DDJJ = getDDJJ();
    console.log('validarDDJJ - DDJJ:', DDJJ);
    const valDDJJResponse = await axiosDDJJ.validar(ID_EMPRESA, DDJJ);
    console.log('validarDDJJ - 1 - valDDJJResponse:', valDDJJResponse);
    const valCUILESResponse = await validarDDJJCuiles(DDJJ);
    console.log('validarDDJJ - valCUILESResponse:', valCUILESResponse);

    //Unifico Errores CUIL y Errores Atributos CUIL
    valCUILESResponse.forEach((element) => {
      if (!element.cuilValido) {
        if (valDDJJResponse && valDDJJResponse.errores)
          valDDJJResponse.errores.push({
            cuil: element.cuil.toString(),
            codigo: 'cuil',
            descripcion: 'CUIL INVALIDO',
            indice: null,
          });
      }
    });
    console.log('validarDDJJ - 2 - valDDJJResponse:', valDDJJResponse);

    //Dejo en sesion los errores para "Pintar" errores en la grilla.-
    setRowsValidaciones(valDDJJResponse);

    //rowsNew: viene de Archivo o Backend
    //Seteo propiedad "rowsNew.gErrores" para que al cargar la grilla se la pueda "Filtrar".-
    validarDDJJRowNewErroresSet(valCUILESResponse);
  };
  const validarDDJJCuiles = async (DDJJ) => {
    const cuiles = [];
    DDJJ.afiliados.map(function (item) {
      cuiles.push(item.cuil);
    });

    const cuilesString = cuiles.map((item) => item?.toString());
    const cuilesResponse = await axiosDDJJ.validarCuiles(
      ID_EMPRESA,
      cuilesString,
    );

    return cuilesResponse;
  };
  const validarDDJJRowNewErroresSet = (valCUILES) => {
    console.log('validarDDJJGrillaErroresRefresh - valCUILES:', valCUILES);

    rowsNew.map((row) => {
      //console.log('validarDDJJGrillaErroresRefresh - updateRows - gridData.forEach - row:',row);
      valCUILES.forEach((reg) => {
        if (reg.cuil == row.cuil) {
          //pongo en true el row
          row.gErrores = true;
        }
      });
    });
  };

  const getCategoriasCamara = (codigoCamara) => {
    const filtroCategorias = categorias.filter(
      (categoria) => categoria.camara === codigoCamara,
    );
    const soloCategorias = filtroCategorias.map((item) => item.categoria);
    return soloCategorias;
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
    validarDDJJ();
    console.log('** rowsNew: ', rowsNew);
    setRows(rowsNew);
  }, []);

  useEffect(() => {
    validarDDJJ();
  }, [rows]);

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
              onClick={handleSaveClick(row.id)}
              disabled={!actualizacionHabilitada}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(row)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(row.id)}
            color="inherit"
            disabled={!actualizacionHabilitada}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(row)}
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
    <div>
      <Box
        sx={{
          mt: 15,
          ml: 10,
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
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            getRowClassName={(params) =>
              rows.indexOf(params.row) % 2 === 0 ? 'even' : 'odd'
            }
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
    </div>
  );
};
