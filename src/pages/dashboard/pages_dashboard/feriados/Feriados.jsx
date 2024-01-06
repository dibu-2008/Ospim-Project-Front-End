import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DescriptionIcon from "@mui/icons-material/Description";
import { Grid, IconButton } from "@mui/material";
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import { actualizarFeriado, crearFeriado, eliminarFeriado, obtenerFeriados } from "./FeriadosApi";

function EditToolbar(props) {
  const { setRows, rows, setRowModesModel } = props;

  const handleClick = () => {
    const maxId = Math.max(...rows.map((row) => row.id), 0);
    const newId = maxId + 1;
    const id = newId;

    setRows((oldRows) => [
      { id, fecha: "", descripcion: "", isNew: true },
      ...oldRows,
    ]);
    setRowModesModel((oldModel) => ({
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
      ...oldModel,
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Nuevo Registro
      </Button>
    </GridToolbarContainer>
  );
}

export function Feriados() {
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});

  const TOKEN = JSON.parse(localStorage.getItem('stateLogin')).usuarioLogueado.usuario.token;

  useEffect(() => {
    const ObtenerFeriados = async () => {

      const feriadosResponse = await obtenerFeriados(TOKEN);
      setRows(feriadosResponse.map((item) => ({ id: item.id, ...item })));

    };

    ObtenerFeriados();

  }, []);

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (fila, id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => async () => {
    
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    
    await eliminarFeriado(id, TOKEN);
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

    if (newRow.isNew) {

      const nuevoFeriado = {
        fecha: newRow.fecha,
        descripcion: newRow.descripcion,
      };

      await crearFeriado(nuevoFeriado, TOKEN);

    } else {


      const updatedFeriado = {
        fecha: newRow.fecha,
        descripcion: newRow.descripcion,
      };

      await actualizarFeriado(newRow.id, updatedFeriado, TOKEN);
    }

    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));

    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    {
      field: "fecha",
      headerName: "Fecha",
      width: 250,
      type: "date",
      editable: true,
      valueFormatter: (params) => {
        const date = new Date(params.value);

        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
      },
      renderHeader: (params) => (
        <Grid container alignItems="center">
          <Grid item>Fecha</Grid>
          <Grid item>
            <IconButton size="small" sx={{ ml: 1, color: "#1A76D2" }}>
              <CalendarMonthIcon />
            </IconButton>
          </Grid>
        </Grid>
      ),
    },
    {
      field: "descripcion",
      headerName: "Descripción",
      width: 250,
      editable: true,
      renderHeader: (params) => (
        <Grid container alignItems="center">
          <Grid item>Descripción</Grid>
          <Grid item>
            <IconButton size="small" sx={{ ml: 1, color: "#1A76D2" }}>
              <DescriptionIcon />
            </IconButton>
          </Grid>
        </Grid>
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Edición",
      width: 250,
      cellClassName: "actions",
      getActions: (params) => {
        const isInEditMode =
          rowModesModel[params.row.id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(params.row, params.row.id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(params.row.id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(params.row.id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            color="inherit"
            onClick={handleDeleteClick(params.row.id)}
          />,
        ];
      },
      renderHeader: (params) => (
        <Grid container alignItems="center">
          <Grid item>Descripción</Grid>
          <Grid item>
            <IconButton size="small" sx={{ ml: 1, color: "#1A76D2" }}>
              <EditIcon />
            </IconButton>
          </Grid>
        </Grid>
      ),
    },
  ];

  return (
    <div
      style={{
        width: "70%",
        margin: "80px auto",
      }}
    >
      <h1
        style={{
          color: "#1A76D2",
          marginBottom: "10px",
          textAlign: "center",
        }}
      >
        Administración de feriados
      </h1>
      <Box
        sx={{
          margin: "60px auto",
          height: "auto",
          width: "80%",
          boxShadow: "0px 4px 8px rgba(26, 118, 210, 0.6)",
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
          onProcessRowUpdateError={(error) => {
            console.error("Error during row update:", error);
            // Puedes agregar lógica adicional para manejar el error, si es necesario.
          }}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { setRows, rows, setRowModesModel },
          }}
        />
      </Box>
    </div>
  );
}
