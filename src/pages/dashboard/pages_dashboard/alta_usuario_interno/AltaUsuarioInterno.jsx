import { useEffect, useState } from 'react';
import { crearUsuarioInterno, deshabilitarUsuarioInterno, habilitarUsuarioInterno, actualizarUsuarioInterno, obtenerRoles, obtenerUsuariosInternos } from './AltaUsuarioInternoApi';
import { AltaUsuarioInternoNuevo } from './AltaUsuarioInternoNuevo';
import {
  GridRowModes,
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import Box from "@mui/material/Box";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import './AltaUsuarioInterno.css'
import { Grid, IconButton } from '@mui/material';

export const AltaUsuarioInterno = () => {

  const [rowModesModel, setRowModesModel] = useState({});
  const [rows, setRows] = useState([])
  const [roles, setRoles] = useState([]);

  const TOKEN = JSON.parse(localStorage.getItem('stateLogin')).usuarioLogueado.usuario.token;

  useEffect(() => {

    const ObtenerUsuariosInternos = async () => {

      const usuarios = await obtenerUsuariosInternos(TOKEN);
      setRows(usuarios.map((item, index) => ({ ...item, id: item.id })));

    };

    ObtenerUsuariosInternos();

  }, []);

  useEffect(() => {
    const ObtenerRol = async () => {
      const rol = await obtenerRoles(TOKEN);
      setRoles(rol);
    }
    ObtenerRol();
    
  }, [])

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

  const handleDeleteClick = (id) => () => {
    setRows((oldRows) => oldRows.filter((row) => row.id !== id));
    setRowModesModel((oldModel) => {
      const newModel = { ...oldModel };
      delete newModel[id];
      return newModel;
    });
  }

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

  const processRowUpdate = async (newRow) => {

    const updatedRow = { ...newRow, isNew: false };

    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    // Recorda manejar el si y no con true y false

    if (newRow.isNew) {

      const nuevoUsuario = {

        descripcion: newRow.descripcion,
        clave: newRow.clave,
        rolId: newRow.rolId,
        nombre: newRow.nombre,
        apellido: newRow.apellido,
        email: newRow.email,

      }

      await crearUsuarioInterno(TOKEN, nuevoUsuario);

    } else {

      const usuario = {

        descripcion: newRow.descripcion,
        clave: newRow.clave,
        rolId: newRow.rolId,
        nombre: newRow.nombre,
        apellido: newRow.apellido,
        email: newRow.email,

      }

      await actualizarUsuarioInterno(TOKEN, usuario, newRow.id);

    }

    return updatedRow;
  }

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleHabilitar = (id) => async () => {

    const updatedRow = { ...rows.find((row) => row.id === id) };
    updatedRow.habilitado = !updatedRow.habilitado;
    setRows(rows.map((row) => (row.id === id ? updatedRow : row)));

    const habilitado = {
      habilitado: updatedRow.habilitado
    }

    if (updatedRow.habilitado) {

      await habilitarUsuarioInterno(TOKEN, id, habilitado);

    } else {

      await deshabilitarUsuarioInterno(TOKEN, id, habilitado);

    }
  };

  const columns = [
    {
      field: 'apellido',
      headerName: 'Apellido',
      width: 200,
      type: 'string',
      editable: true,
      headerClassName: 'header--cell',
      cellClassName: 'row--cell',
    },
    {
      field: 'nombre',
      headerName: 'Nombre',
      width: 200,
      type: 'string',
      editable: true,
      headerClassName: 'header--cell',
    },
    {
      field: 'descripcion',
      headerName: 'Usuario',
      width: 200,
      type: 'string',
      editable: true,
      headerClassName: 'header--cell',
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 225,
      type: 'string',
      editable: true,
      headerClassName: 'header--cell',
    },
    {
      field: 'clave',
      headerName: 'Contraseña',
      width: 200,
      type: 'string',
      editable: true,
      headerClassName: 'header--cell',
    },
    {
      field: 'repetirClave',
      headerName: 'Repetir Contraseña',
      width: 200,
      type: 'string',
      editable: true,
      headerClassName: 'header--cell',
      valueGetter: (params) => {

        return params.row.clave
      },
    },
    {
      field: 'rolId',
      headerName: 'Rol',
      width: 200,
      type: 'singleSelect',
      editable: true,
      headerClassName: 'header--cell',
      valueOptions: roles.map((item) => {
        return { value: item.id, label: item.descripcion }
      }),
    },
    {
      field: 'habilitado',
      headerName: 'Habilitado',
      width: 170,
      type: 'string',
      editable: false,
      valueGetter: (params) => {

        //if (params.row.habilitado === null) return ("");

        return params.row.habilitado ? "Si" : "No"
      },
      headerClassName: 'habilitado--cell',
      cellClassName: 'habilitado--cell',
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 200,
      type: 'actions',
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

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={row.habilitado ? <CloseIcon sx={{ color: 'red' }} /> : <CheckIcon sx={{ color: 'green' }} />}
            label={row.habilitado ? "Cerrar" : "Abrir"}
            onClick={handleHabilitar(id)}
            color="inherit"
          />
        ];
      },
    }
  ]


  return (
    <div className='usuario_interno_container'>
      <h1>Alta Usuario Interno</h1>
      <Box
        sx={{
          height: "auto",
          width: "90%",
          overflowX: "auto",
          "& .actions": {
            color: "text.secondary",
          },
          "& .textPrimary": {
            color: "text.primary",
          },
        }}
      >

        <DataGrid
          rows={rows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          slots={{
            toolbar: AltaUsuarioInternoNuevo,
          }}
          slotProps={{
            toolbar: { setRows, rows, setRowModesModel },
          }}
          sx={{
            // ...
            '& .MuiDataGrid-virtualScroller::-webkit-scrollbar': {
              width: '8px',
              visibility: 'visible',
            },
            '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb': {
              backgroundColor: '#ccc',
            },
          }}
        />
      </Box>
    </div>
  )
}
