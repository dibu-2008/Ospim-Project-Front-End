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

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
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
import { dataGridStyle } from '@/common/dataGridStyle';
import dayjs from 'dayjs';
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
  const [open, setOpen] = useState(false);
  const [dataModal, setDataModal] = useState({
    cuil: '',
    apellido: '',
    nombre: '',
  });

  const { paginationModel, setPaginationModel, pageSizeOptions } =
    useContext(UserContext);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const theme = useTheme();
  const themeWithLocale = useMemo(
    () => createTheme(theme, locales[locale]),
    [locale, theme],
  );

  const gridApiRef = useGridApiRef();

  const obtenerAfiliados = async (params, cuilElegido) => {
    if (cuilElegido === '') {
      swal.showWarning('Debe ingresar un CUIL y presionar la lupa');
    }

    if (cuilElegido.length < 11) {
      swal.showWarning(
        'El CUIL ingresado es incorrecto, debe tener 11 dígitos.',
      );
    } else {
      const afiliados = await axiosDDJJ.getAfiliado(cuilElegido);

      const afiliadoEncontrado = afiliados.find(
        (afiliado) => afiliado.cuil === cuilElegido,
      );

      if (afiliado) {
        setAfiliado(afiliadoEncontrado);
      }

      // TODO : Mirar el tema de la logica de busqueda por que tambien podria poder escribir sin buscar el cuil
      if (afiliadoEncontrado) {
        if (afiliadoEncontrado.inte !== null) {
          setInteDataBase(afiliadoEncontrado.inte);
        }

        setAfiliado(afiliadoEncontrado);

        // Apellido
        params.api.setEditCellValue({
          id: params.id,
          field: 'apellido',
          value: afiliadoEncontrado.apellido,
        });

        const textFieldApellido = document.getElementById(
          'apellido' + params.row.id,
        );
        const abueloApellido = textFieldApellido.parentNode.parentNode;
        abueloApellido.style.display = 'block';

        // Nombre
        params.api.setEditCellValue({
          id: params.id,
          field: 'nombre',
          value: afiliadoEncontrado.nombre,
        });

        const textFieldNombre = document.getElementById(
          'nombre' + params.row.id,
        );
        const abueloNombre = textFieldNombre.parentNode.parentNode;
        abueloNombre.style.display = 'block';
      } else {
        swal.showWarning(
          'CUIL inexistente, al presentarse la DDJJ, el mismo, será incorporado a la lista de la nómina del CUIT correspondiente.',
        );

        const textFieldApellido = document.getElementById(
          'apellido' + params.row.id,
        );
        const abueloApellido = textFieldApellido.parentNode.parentNode;
        abueloApellido.style.display = 'block';

        const textFieldNombre = document.getElementById(
          'nombre' + params.row.id,
        );
        const abueloNombre = textFieldNombre.parentNode.parentNode;
        abueloNombre.style.display = 'block';
      }
    }
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
    console.log('processRowUpdate - INIT');
    console.log(newRow);
    console.log(inteDataBase);
    if (newRow.isNew) {
      const fila = { ...newRow, inte: inteDataBase, errores: false };
      setRowsAltaDDJJ(
        rowsAltaDDJJ.map((row) => (row.id === newRow.id ? fila : row)),
      );

      return { ...fila, isNew: false };
    } else {
      const fila = { ...newRow, inte: inteDataBase };

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
      if (params.row.cuil === error.cuil && params.field === error.codigo) {
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
    setOpen(true);
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
                obtenerAfiliados(params, params.value);
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
            {afiliado?.cuil === params.value && (
              <CreateIcon
                sx={{
                  fontSize: '1.8rem',
                  color: '#1A76D2',
                  cursor: 'pointer',
                }}
                onClick={handleDataModal(params.row)}
              />
            )}
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
      renderEditCell: (params) => {
        return afiliado?.apellido ? (
          <TextField
            id={params.row.id ? 'apellido' + params.row.id.toString() : ''}
            fullWidth
            value={params.value || ''}
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
        ) : (
          <TextField
            id={params.row.id ? 'apellido' + params.row.id.toString() : ''}
            fullWidth
            value={params.value || ''}
            onChange={(event) => {
              const newValue = event.target.value;

              params.api.setEditCellValue({
                id: params.id,
                field: 'apellido',
                value: newValue,
              });
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  backgroundColor:
                    params.row.cuil === '' ? 'white' : 'transparent',
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
      renderEditCell: (params) => {
        return afiliado?.nombre ? (
          <TextField
            id={params.row.id ? 'nombre' + params.row.id.toString() : ''}
            fullWidth
            value={params.value || ''}
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
        ) : (
          <TextField
            id={params.row.id ? 'nombre' + params.row.id.toString() : ''}
            fullWidth
            value={params.value || ''}
            onChange={(event) => {
              const newValue = event.target.value;
              params.api.setEditCellValue({
                id: params.id,
                field: 'nombre',
                value: newValue,
              });
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  backgroundColor:
                    params.row.cuil === '' ? 'white' : 'transparent',
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
        );
      },
    },
    {
      field: 'camara',
      headerName: 'Camara',
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
      headerName: 'Categoria',
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
      valueFormatter: ({ value }) => {
        if (!value) return '';
        //return formatter.date(value);
        //return dayjs(value).format("MM/YYYY");
        return dayjs(value).format('DD/MM/YYYY');
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
        console.log('renderEditCell-params: ', params);
        return (
          <CurrencyInput
            id={params.row.id ? 'remunerativo' + params.row.id.toString() : ''}
            className="input-currency"
            //prefix="$"
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
              console.log(value, name, values);
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

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const resp = axiosDDJJ.actualizarNombreApellido(dataModal);
    console.log(resp);
  };

  console.log('rowsAltaDDJJ', rowsAltaDDJJ);

  return (
    <div>
      <Box
        sx={{
          height: 'auto',
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
          <DataGrid
            apiRef={gridApiRef}
            className="afiliados"
            rows={rowsAltaDDJJ || []}
            columns={columns}
            columnVisibilityModel={{ errores: false }}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            localeText={dataGridStyle.toolbarText}
            timezoneOffset={null}
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
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={pageSizeOptions}
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
        open={open}
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
