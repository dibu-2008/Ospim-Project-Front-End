import { useState, useEffect, useMemo } from "react";
import { crearPublicacion, obtenerPublicaciones, actualizarPublicacion, eliminarPublicacion } from "./PublicacionesApi";
import { EditarNuevaFila } from "./PublicacionNueva";
import {
  GridRowModes,
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import * as locales from '@mui/material/locale';
import Swal from 'sweetalert2'
import "./Publicaciones.css";

export const Publicaciones = () => {

  const [locale, setLocale] = useState('esES');
  const [rowModesModel, setRowModesModel] = useState({});
  const [rows, setRows] = useState([]);

  const TOKEN = JSON.parse(localStorage.getItem('stateLogin')).usuarioLogueado.usuario.token;

  const theme = useTheme();

  const themeWithLocale = useMemo(
    () => createTheme(theme, locales[locale]),
    [locale, theme],
  );

  useEffect(() => {
    const ObtenerPublicaciones = async () => {
      const publicaciones = await obtenerPublicaciones(TOKEN);
      setRows(publicaciones.map((item, index) => ({ ...item, id: item.id })));
    };

    ObtenerPublicaciones();
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

  const handleDeleteClick = (id) => async () => {

    /* setRowModesModel((oldModel) => {
      const newModel = { ...oldModel };
      delete newModel[id];
      return newModel;
    }); */

    const showSwalConfirm = async () => {
      try {
        Swal.fire({
          title: '¿Estás seguro?',
          text: "¡No podrás revertir esto!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#1A76D2',
          cancelButtonColor: '#6c757d',
          confirmButtonText: 'Si, bórralo!'
        }).then(async (result) => {
          if (result.isConfirmed) {
            setRows((oldRows) => oldRows.filter((row) => row.id !== id));
            await eliminarPublicacion(id, TOKEN);
          }
        });
      } catch (error) {
        console.error('Error al ejecutar eliminarFeriado:', error);
      }
    };

    showSwalConfirm();
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

  const processRowUpdate = async (newRow) => {
    const updatedRow = { ...newRow, isNew: false };

    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));

    const fechaDesde = new Date(newRow.vigenciaDesde);
    const fechaHasta = new Date(newRow.vigenciaHasta);

    fechaDesde.setUTCHours(0, 0, 0, 0);
    fechaHasta.setUTCHours(0, 0, 0, 0);

    const fechaDesdeFormateada = fechaDesde.toISOString();
    const fechaHastaFormateada = fechaHasta.toISOString();

    if (newRow.isNew) {
      const nuevaPublicacion = {
        titulo: newRow.titulo,
        cuerpo: newRow.cuerpo,
        vigenciaDesde: fechaDesdeFormateada,
        vigenciaHasta: fechaHastaFormateada,
      };

      await crearPublicacion(nuevaPublicacion, TOKEN);
    } else {
      const publicacionEditada = {
        titulo: newRow.titulo,
        cuerpo: newRow.cuerpo,
        vigenciaDesde: fechaDesdeFormateada,
        vigenciaHasta: fechaHastaFormateada,
      };

      await actualizarPublicacion(newRow.id, publicacionEditada, TOKEN);
    }

    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    {
      field: "titulo",
      headerName: "Titulo",
      width: 300,
      type: "string",
      editable: true,
      headerAlign: "center",
      align: "center",
      headerClassName: 'header--cell',
    },
    {
      field: "cuerpo",
      headerName: "Cuerpo",
      width: 325,
      type: "string",
      editable: true,
      headerAlign: "center",
      align: "center",
      headerClassName: 'header--cell',
    },
    {
      field: "vigenciaDesde",
      headerName: "Vigencia Desde",
      width: 300,
      type: "date",
      editable: true,
      headerAlign: "center",
      align: "center",
      headerClassName: 'header--cell',
      valueFormatter: (params) => {
        
        const date = new Date(params.value);
      
        const day = date.getUTCDate().toString().padStart(2, "0");
        const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
        const year = date.getUTCFullYear();
      
        return `${day}-${month}-${year}`;
      },
    },
    {
      field: "vigenciaHasta",
      headerName: "Vigencia Hasta",
      width: 300,
      type: "date",
      editable: true,
      headerAlign: "center",
      align: "center",
      headerClassName: 'header--cell',
      valueFormatter: (params) => {
        
        const date = new Date(params.value);
      
        const day = date.getUTCDate().toString().padStart(2, "0");
        const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
        const year = date.getUTCFullYear();
      
        return `${day}-${month}-${year}`;
      },
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 300,
      type: "actions",
      headerAlign: "center",
      align: "center",
      headerClassName: 'header--cell',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
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
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <div className="publicaciones_container">
      <h1>Administracion de Publicaciones</h1>
      <Box
        sx={{
          height: "400px",
          width: "100%",
          "& .actions": {
            color: "text.secondary",
          },
          "& .textPrimary": {
            color: "text.primary",
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
            processRowUpdate={processRowUpdate}
            slots={{
              toolbar: EditarNuevaFila,
            }}
            slotProps={{
              toolbar: { setRows, rows, setRowModesModel },
            }}
            sx={{
              '& .MuiDataGrid-virtualScroller::-webkit-scrollbar': {
                width: '8px',
                visibility: 'visible',
              },
              '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb': {
                backgroundColor: '#ccc',
              },
            }}
            initialState={{
              ...rows.initialState,
              pagination: {
                paginationModel: { pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10, 25]}
          />
        </ThemeProvider>
      </Box>
    </div>
  );
};


