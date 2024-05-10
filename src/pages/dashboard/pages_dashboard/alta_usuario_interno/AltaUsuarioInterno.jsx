import * as locales from '@mui/material/locale';
import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  Tooltip,
  IconButton,
  alpha,
  TextField,
  Grid,
  InputAdornment,
  OutlinedInput,
} from '@mui/material';

import { Add, Edit, DeleteOutlined, Save, Close } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridToolbar,
} from '@mui/x-data-grid';

import { axiosUsuariosInternos } from './AltaUsuarioInternoApi';
import { axiosRoles } from '@pages/dashboard/pages_dashboard/roles/RolesApi';

import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';

import Swal from 'sweetalert2';
import './AltaUsuarioInterno.css';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { dataGridStyle } from '@/common/dataGridStyle';
import { margin } from '@mui/system';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  border: '2px solid #1A76D2',
  boxShadow: 24,
  p: 4,
};

const crearNuevoRegistro = (props) => {
  const {
    setRows,
    rows,
    setRowModesModel,
    volverPrimerPagina,
    showQuickFilter,
    themeWithLocale,
  } = props;

  const altaHandleClick = () => {
    const maxId = rows ? Math.max(...rows.map((row) => row.id), 0) : 1;
    const newId = maxId + 1;
    const id = newId;
    volverPrimerPagina();

    setRows((oldRows) => [
      {
        id,
        apellido: '',
        nombre: '',
        descripcion: '',
        email: '',
        clave: '',
        rolId: '',
        notificaciones: '',
        habilitado: null,
        isNew: true,
      },
      ...oldRows,
    ]);
    setRowModesModel((oldModel) => ({
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
      ...oldModel,
    }));
  };

  return (
    <GridToolbarContainer
      theme={themeWithLocale}
      style={{ display: 'flex', justifyContent: 'space-between' }}
    >
      <Button color="primary" startIcon={<AddIcon />} onClick={altaHandleClick}>
        Nuevo Registro
      </Button>
      <GridToolbar showQuickFilter={showQuickFilter} />
    </GridToolbarContainer>
  );
};

export const AltaUsuarioInterno = () => {
  const [locale, setLocale] = useState('esES');
  const [rowModesModel, setRowModesModel] = useState({});
  const [rows, setRows] = useState([]);
  const [roles, setRoles] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const volverPrimerPagina = () => {
    setPaginationModel((prevPaginationModel) => ({
      ...prevPaginationModel,
      page: 0,
    }));
  };

  const theme = useTheme();

  const themeWithLocale = useMemo(
    () => createTheme(theme, locales[locale]),
    [locale, theme],
  );

  useEffect(() => {
    const ObtenerUsuariosInternos = async () => {
      const response = await axiosUsuariosInternos.consultar();
      console.log('response: ', response);
      setRows(response.map((item) => ({ id: item.id, ...item })));
    };
    ObtenerUsuariosInternos();
  }, []);

  useEffect(() => {
    const ObtenerRol = async () => {
      const rol = await axiosRoles.deUsuarioConsultar();
      setRoles(rol);
    };
    ObtenerRol();
  }, []);

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const handleGestionClave = (id, row) => () => {
    setNombre(row.nombre);
    setApellido(row.apellido);
    setUsuario(row.descripcion);
    setEmail(row.email);
    setClave(row.clave);
    setRepetirClave(row.clave);
    setIdUsuario(id);
    handleOpen();
  };

  const processRowUpdate = async (newRow, oldRow) => {
    console.log('processRowUpdate - INIT');
    let bOk = false;

    if (newRow.isNew) {
      console.log('processRowUpdate - ALTA');
      try {
        delete newRow.id;
        delete newRow.repetirClave;
        delete newRow.isNew;
        const data = await axiosUsuariosInternos.crear(newRow);
        if (data && data.id) {
          newRow.id = data.id;
          newRow.isNew = false;
          bOk = true;
          const newRows = rows.map((row) => (row.isNew ? newRow : row));
          setRows(newRows);
        } else {
          console.log('alta sin ID generado');
        }
      } catch (error) {
        console.log(
          'X - processRowUpdate - ALTA - ERROR: ' + JSON.stringify(error),
        );
      }
    } else {
      console.log('3 - processRowUpdate - MODI ');
      try {
        delete newRow.isNew;
        delete newRow.repetirClave;
        bOk = await axiosUsuariosInternos.actualizar(newRow);
        console.log('4 - processRowUpdate - MODI - bOk: ' + bOk);
        newRow.isNew = false;
        if (bOk) {
          setRows(rows.map((row) => (row.id === newRow.id ? newRow : row)));
        }
      } catch (error) {
        console.log(
          'X - processRowUpdate - MODI - ERROR: ' + JSON.stringify(error),
        );
      }
    }

    if (bOk) {
      return newRow;
    } else {
      return oldRow;
    }
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleHabilitar = (id) => async () => {
    const updatedRow = { ...rows.find((row) => row.id === id) };
    updatedRow.habilitado = !updatedRow.habilitado;
    setRows(rows.map((row) => (row.id === id ? updatedRow : row)));

    await axiosUsuariosInternos.habilitar(id, updatedRow.habilitado);
  };

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [usuario, setUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [clave, setClave] = useState('');
  const [repetirClave, setRepetirClave] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [idUsuario, setIdUsuario] = useState(0);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClave = (e) => {
    setClave(e.target.value);
  };

  const handleRepetirClave = (e) => {
    setRepetirClave(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    console.log(rows);

    e.preventDefault();
    if (clave !== repetirClave) {
      toast.error('Las claves no coinciden !', {
        position: 'top-right',
        autoClose: 2000,
        style: {
          fontSize: '1rem',
        },
      });
      return; // Para salir de la función sin continuar
    }

    // Buscar el usuario en el array de usuarios
    const usuario = rows.find((usuario) => usuario.id === idUsuario);
    console.log(usuario);

    usuario.nombre = nombre;
    usuario.apellido = apellido;
    usuario.clave = clave;

    const resp = await axiosUsuariosInternos.actualizar(usuario);
    if (resp) {
      toast.success('Clave actualizada correctamente !', {
        position: 'top-right',
        autoClose: 2000,
        style: {
          fontSize: '1rem',
        },
      });
      handleClose();
    }
  };

  const columns = [
    {
      field: 'apellido',
      headerName: 'Apellido',
      flex: 2,
      type: 'string',
      editable: true,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
    },
    {
      field: 'nombre',
      headerName: 'Nombre',
      flex: 2,
      type: 'string',
      editable: true,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
    },
    {
      field: 'descripcion',
      headerName: 'Usuario',
      flex: 2,
      type: 'string',
      editable: true,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 2,
      type: 'string',
      editable: true,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
    },
    {
      field: 'rolId',
      headerName: 'Rol',
      flex: 2,
      type: 'singleSelect',
      editable: true,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
      valueOptions: roles.map((item) => {
        return { value: item.id, label: item.descripcion };
      }),
    },
    {
      field: 'notificaciones',
      headerName: 'Notificaciones',
      flex: 2,
      type: 'singleSelect',
      editable: true,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
      valueOptions: ['Si','No'],
      value: (params) => params.row.notificaciones || 'No'
      //value:(params) => params.row.notificaciones
    },
    {
      field: 'habilitado',
      headerName: 'Habilitado',
      flex: 2,
      width: 40,
      minWidth: 25,
      maxWidth: 80,
      type: 'string',
      headerAlign: 'center',
      align: 'center',
      editable: false,
      valueGetter: (params) => {
        return params.row.habilitado ? 'Si' : 'No';
      },
      headerClassName: 'header--cell',
      cellClassName: 'habilitado--cell',
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      flex: 2,
      type: 'actions',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
      getActions: ({ id, row }) => {
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

        const actions = [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={
              row.habilitado ? (
                <CloseIcon sx={{ color: 'red' }} />
              ) : (
                <CheckIcon sx={{ color: 'green' }} />
              )
            }
            label={row.habilitado ? 'Cerrar' : 'Abrir'}
            onClick={handleHabilitar(id)}
            color="inherit"
          />,
        ];

        actions.push(
          <Tooltip title="Gestionar Clave" key="clave" placement="top">
            <GridActionsCellItem
              icon={<LockPersonIcon />}
              label="Gestionar Clave"
              sx={{ color: 'primary.main' }}
              onClick={handleGestionClave(id, row)}
            />
          </Tooltip>,
        );

        return actions;
      },
    },
  ];

  return (
    <div className="usuario_interno_container">
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <h1>Alta Usuario Interno</h1>
        </Grid>
        <Grid item xs={6}>
          <ToastContainer />
        </Grid>
      </Grid>
      <Box
        sx={{
          height: '600px',
          width: '100%',
          overflowX: 'auto',
          '& .actions': {
            color: 'text.secondary',
          },
          '& .textPrimary': {
            color: 'text.primary',
          },
        }}
      >
        <ThemeProvider theme={themeWithLocale}>
          <DataGrid
            rows={rows}
            columns={columns}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={(updatedRow, originalRow) =>
              processRowUpdate(updatedRow, originalRow)
            }
            localeText={dataGridStyle.toolbarText}
            slots={{ toolbar: crearNuevoRegistro }}
            slotProps={{
              toolbar: {
                setRows,
                rows,
                setRowModesModel,
                volverPrimerPagina,
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
            }}
            initialState={{
              ...rows.initialState,
              pagination: {
                paginationModel: { pageSize: 50 },
              },
            }}
            pageSizeOptions={[5, 10, 25, 50]}
          />
        </ThemeProvider>
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
                Gestion de Clave
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <p
                    style={{
                      marginLeft: '10px',
                    }}
                  >
                    {nombre}
                  </p>
                </Grid>
                <Grid item xs={6}>
                  <p
                    style={{
                      marginLeft: '10px',
                    }}
                  >
                    {apellido}
                  </p>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <p
                    style={{
                      marginLeft: '10px',
                    }}
                  >
                    {usuario}
                  </p>
                </Grid>
                <Grid item xs={6}>
                  <p
                    style={{
                      marginLeft: '10px',
                    }}
                  >
                    {email}
                  </p>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <OutlinedInput
                    value={clave}
                    label="Clave"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    type={showPassword ? 'text' : 'password'}
                    onChange={handleClave}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <OutlinedInput
                    value={repetirClave}
                    label="Repetir Clave"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    type={showPassword ? 'text' : 'password'}
                    onChange={handleRepetirClave}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </Grid>
              </Grid>
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
                  Actualizar
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
      </Box>
    </div>
  );
};
