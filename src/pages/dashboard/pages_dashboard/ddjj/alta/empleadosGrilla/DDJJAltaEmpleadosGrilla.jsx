import { useState, useMemo, useEffect, useContext } from 'react';
import {
  GridRowModes,
  DataGrid,
  GridToolbar,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
  useGridApiRef,
} from '@mui/x-data-grid';
import { StripedDataGrid, dataGridStyle } from '@/common/dataGridStyle';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import CreateIcon from '@mui/icons-material/Create';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import * as locales from '@mui/material/locale';
import formatter from '@/common/formatter';
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  IconButton,
  alpha,
  Modal,
} from '@mui/material';
import { axiosDDJJ } from '../DDJJAltaApi';
import './DDJJAltaEmpleadosGrilla.css';
import swal from '@/components/swal/swal';
import Typography from '@mui/material/Typography';
import CurrencyInput from 'react-currency-input-field';
import { formatValue } from 'react-currency-input-field';
import { UserContext } from '@/context/userContext';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #1A76D2',
  boxShadow: 24,
  p: 4,
};

function EditToolbar(props) {
  const {
    setRowsAltaDDJJ,
    rowsAltaDDJJ,
    setRowModesModel,
    showQuickFilter,
    themeWithLocale,
  } = props;

  const handleClick = () => {
    const maxId = rowsAltaDDJJ
      ? Math.max(...rowsAltaDDJJ.map((row) => row.id), 0)
      : 1;
    const newId = maxId + 1;
    const id = newId;

    setRowsAltaDDJJ((oldRows) => [
      {
        id,
        //fila: oldRows.length + 1, // Asignamos el número de fila incremental
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
        isNew: '',
      },
      ...oldRows,
    ]);

    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  return (
    <GridToolbarContainer
      theme={themeWithLocale}
      style={{ display: 'flex', justifyContent: 'space-between' }}
    >
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Nuevo Registro
      </Button>
      <GridToolbar showQuickFilter={showQuickFilter} />
    </GridToolbarContainer>
  );
}

export const DDJJAltaEmpleadosGrilla = ({
  rowsAltaDDJJ,
  setRowsAltaDDJJ,
  camaras,
  categoriasFiltradas,
  setCategoriasFiltradas,
  afiliado,
  setAfiliado,
  todasLasCategorias,
  plantas,
  validacionResponse,
  rowModesModel,
  setRowModesModel,
  actualizacionHabilitada,
}) => {
  const [locale, setLocale] = useState('esES');
  const [inteDataBase, setInteDataBase] = useState(null);
  const [cuilModiModalOpen, setCuilModiModalOpen] = useState(false);
  const [dataModal, setDataModal] = useState({
    cuil: '',
    apellido: '',
    nombre: '',
  });

  const { paginationModel, setPaginationModel, pageSizeOptions } =
    useContext(UserContext);
  const handleOpen = () => setCuilModiModalOpen(true);
  const handleClose = () => setCuilModiModalOpen(false);

  const theme = useTheme();
  const themeWithLocale = useMemo(
    () => createTheme(theme, locales[locale]),
    [locale, theme],
  );

  const gridApiRef = useGridApiRef();

  const setAfiliadoGrilla = (params, cuil, apellido, nombre) => {
    console.log('setAfiliadoGrilla - params:', params);
    params.api.setEditCellValue({
      id: params.id,
      field: 'cuil',
      value: cuil,
    });

    // Apellido
    params.api.setEditCellValue({
      id: params.id,
      field: 'apellido',
      value: apellido,
    });

    const textFieldApellido = document.getElementById('apellido' + params.id);
    const abueloApellido = textFieldApellido.parentNode.parentNode;
    console.log('setAfiliadoGrilla - abueloApellido: ', abueloApellido);
    if (apellido != '') {
      abueloApellido.style.display = 'block';
    } else {
      abueloApellido.style.display = '';
    }

    // Nombre
    params.api.setEditCellValue({
      id: params.id,
      field: 'nombre',
      value: nombre,
    });
    const textFieldNombre = document.getElementById('nombre' + params.id);
    const abueloNombre = textFieldNombre.parentNode.parentNode;
    console.log('setAfiliadoGrilla - abueloNombre: ', abueloNombre);
    if (nombre != '') {
      abueloNombre.style.display = 'block';
      //abueloNombre.off('click');
    } else {
      abueloNombre.style.display = '';
      //abueloNombre.on('click');
    }
  };

  const validarAfiliado = async (cuil) => {
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

  const obtenerAfiliados = async (params) => {
    console.log('obtenerAfiliados - params:', params);
    const cuilElegido = params.value;
    let afiliados = null;

    const rta = await validarAfiliado(cuilElegido);
    console.log('obtenerAfiliados - rta:', rta);
    if (rta.error != 'OK') {
      swal.showWarning(rta.error);
      setAfiliadoGrilla(params, cuilElegido, '', '');
      return;
    }

    console.log('obtenerAfiliados - (2)');
    const afiliadoDB = rta.afiliados?.find(
      (afiliado) => afiliado.cuil === cuilElegido,
    );

    console.log('obtenerAfiliados - (3)');
    if (!afiliadoDB) {
      swal.showWarning(
        'CUIL inexistente en la nómina de Afiliados. El mismo sera dado de alta cuando registre la DDJJ.',
      );
      setAfiliadoGrilla(params, cuilElegido, '', '');
    } else {
      setAfiliadoGrilla(
        params,
        cuilElegido,
        afiliadoDB.apellido,
        afiliadoDB.nombre,
      );
      setAfiliado(afiliadoDB);
    }
    console.log('obtenerAfiliados - FIN');
  };

  const filtroDeCategoria = (codigoCamara) => {
    const filtroCategorias = todasLasCategorias.filter(
      (categoria) => categoria.camara === codigoCamara,
    );
    const soloCategorias = filtroCategorias.map((item) => item.categoria);
    setCategoriasFiltradas(soloCategorias);
    return soloCategorias;
  };

  const handleRowEditStop = (params) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      gridApiRef.current?.stopRowEditMode({
        id: params.id,
        ignoreModifications: false,
      });
    }
  };

  const handleEditClick = (id) => () => {
    console.log('handleEditClick - id: ' + id);
    const editedRow = rowsAltaDDJJ.find((row) => row.id === id);

    filtroDeCategoria(editedRow.camara);
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => async () => {
    setRowsAltaDDJJ(rowsAltaDDJJ.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rowsAltaDDJJ.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRowsAltaDDJJ(rowsAltaDDJJ.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = async (newRow) => {
    if (newRow.isNew) {
      const fila = { ...newRow, inte: 0, errores: false };
      setRowsAltaDDJJ(
        rowsAltaDDJJ.map((row) => (row.id === newRow.id ? fila : row)),
      );

      return { ...fila, isNew: false };
    } else {
      const fila = { ...newRow, inte: 0 };

      setRowsAltaDDJJ(
        rowsAltaDDJJ.map((row) => (row.id === newRow.id ? fila : row)),
      );

      return fila;
    }
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const colorErrores = (params) => {
    let cellClassName = '';

    validacionResponse?.errores?.forEach((error) => {
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

  const handleDataModal = (row) => () => {
    setDataModal({
      cuil: row.cuil,
      apellido: row.apellido,
      nombre: row.nombre,
    });
    setCuilModiModalOpen(true);
  };

  const handleChangeDataModal = (event, field) => {
    setDataModal((prevDataModal) => ({
      ...prevDataModal,
      [field]: event.target.value,
    }));
  };

  const columns = [
    {
      field: 'filaNew',
      type: 'number',
      headerName: 'Fila',
      width: 50,
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
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
              disabled={!actualizacionHabilitada}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
            disabled={!actualizacionHabilitada}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
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
                obtenerAfiliados(params);
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
              onClick={handleDataModal(params.row)}
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
              const rtaValidacion = await validarAfiliado(cuilActual);
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
              const rtaValidacion = await validarAfiliado(cuilActual);
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
                    const vec = filtroDeCategoria(camara.codigo);
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
      valueOptions: categoriasFiltradas,
      valueFormatter: ({ value }) => value || '',
      renderEditCell: (params) => {
        return (
          <Select
            fullWidth
            value={categoriasFiltradas.length > 0 ? params.value : ''}
            onChange={(event) => {
              params.api.setEditCellValue({
                id: params.id,
                field: 'categoria',
                value: event.target.value,
              });
            }}
          >
            {categoriasFiltradas.map((categoria) => {
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
      headerAlign: 'right',
      align: 'right',
      headerClassName: 'header--cell',
      valueFormatter: ({ value }) => {
        //return formatter.currencyString(value || 0);
        // Averiguar sobre el pais y la moneda

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
        <div style={{ textAlign: 'right', color: '#fff', fontSize: '0.8rem' }}>
          <span role="img" aria-label="enjoy">
            No
            <br />
            Remunerativo
          </span>
        </div>
      ),
      width: 150,
      editable: true,
      headerAlign: 'right',
      align: 'right',
      headerClassName: 'header--cell',
      valueFormatter: ({ value }) => {
        if (value === '') return '';
        if (value === null) return '';
        //return formatter.currency.format(value || 0);
        // Averiguar sobre el pais y la moneda
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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const resp = await axiosDDJJ.actualizarNombreApellido(dataModal);
    handleClose();
    console.log('handleFormSubmit - resp: ', resp);
  };

  return (
    <div>
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
            rows={rowsAltaDDJJ || []}
            columns={columns}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            getRowClassName={(params) =>
              rowsAltaDDJJ.indexOf(params.row) % 2 === 0 ? 'even' : 'odd'
            }
            localeText={dataGridStyle.toolbarText}
            slots={{
              toolbar: EditToolbar,
            }}
            slotProps={{
              toolbar: {
                setRowsAltaDDJJ,
                rowsAltaDDJJ,
                setRowModesModel,
                showQuickFilter: true,
                themeWithLocale,
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
            getCellClassName={colorErrores}
          />
        </ThemeProvider>
        <div
          style={{
            marginTop: '20px',
          }}
        ></div>
      </Box>
      <Modal
        open={cuilModiModalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={handleFormSubmit}>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                textAlign: 'center',
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                borderRadius: '5px',
                width: '400px',
                marginBottom: '20px',
                color: theme.palette.primary.main,
              }}
            >
              Gestion Datos DDJJ
            </Typography>
            <TextField
              fullWidth
              label="CUIL"
              value={dataModal.cuil}
              variant="outlined"
              sx={{ marginBottom: '20px' }}
            />
            <TextField
              fullWidth
              label="Apellido"
              value={dataModal.apellido}
              variant="outlined"
              sx={{ marginBottom: '20px' }}
              onChange={(e) => handleChangeDataModal(e, 'apellido')}
            />
            <TextField
              fullWidth
              label="Nombre"
              value={dataModal.nombre}
              variant="outlined"
              sx={{ marginBottom: '20px' }}
              onChange={(e) => handleChangeDataModal(e, 'nombre')}
            />
            <Box
              display="flex"
              justifyContent="space-between"
              sx={{ width: '76%' }}
            >
              <Button
                variant="contained"
                sx={{ marginTop: '20px' }}
                type="submit"
              >
                Enviar
              </Button>
              <Button
                variant="contained"
                sx={{ marginTop: '20px' }}
                onClick={handleClose}
              >
                Cancelar
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </div>
  );
};
