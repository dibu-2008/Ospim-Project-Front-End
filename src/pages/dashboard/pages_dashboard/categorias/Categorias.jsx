import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";

import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { actualizarCategoria, crearCategoria, eliminarCategoria, obtenerCamaras, obtenerCategorias } from "./CategoriasApi";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const ERROR_MESSAGE = import.meta.env.VITE_ERROR_MESSAGE;
const ERROR_BODY = import.meta.env.VITE_ERROR_BODY;
const ERROR_BUSINESS = import.meta.env.VITE_ERROR_BUSINESS;

function EditToolbar(props) {
  const { setRows, rows, setRowModesModel } = props;

  const handleClick = () => {
    const maxId = Math.max(...rows.map((row) => row.id), 0);
    const newId = maxId + 1;
    const id = newId;

    setRows((oldRows) => [
      { id, camaraCodigo: "", descripcion: "", isNew: true },
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

export const Categorias = () => {
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [camaras, setCamaras] = useState([]);

  const TOKEN = JSON.parse(localStorage.getItem('stateLogin')).usuarioLogueado.usuario.token;

  

  useEffect(() => {
    const ObtenerCategorias = async () => {

      const categoriasResponse = await obtenerCategorias(TOKEN);

      setRows(categoriasResponse.map((item) => ({ id: item.id, ...item })));
   
    };
    ObtenerCategorias();
  }, []);

  
  useEffect(() => {
    const ObtenerCamaras = async () => {

      const camarasResponse = await obtenerCamaras(TOKEN);

      setCamaras(camarasResponse.map((item) => ({ id: item.id, ...item })));
    };
    ObtenerCamaras();  
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
    
    setRows(rows.filter((row) => row.id !== id));
    
    await eliminarCategoria(id, TOKEN);
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

    if (newRow.isNew) {

      const nuevaCategoria = {
        camaraCodigo: newRow.camaraCodigo,
        descripcion: newRow.descripcion,
      };

      await crearCategoria(nuevaCategoria, TOKEN);

     
    } else {

      const categoria = {
        camaraCodigo: newRow.camaraCodigo,
        descripcion: newRow.descripcion,
      };

      await actualizarCategoria(newRow.id, categoria, TOKEN);
    }

    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    {
      field: "camaraCodigo",
      headerName: "Camara",
      width: 150,
      editable: true,
      headerAlign: "center",
      align: "center",
      type: "singleSelect",
      valueOptions: camaras.map((camara) => camara.codigo),
    },
    {
      field: "descripcion",
      headerName: "Descripcion",
      width: 200,
      editable: true,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Acciones",
      width: 100,
      headerAlign: "center",
      align: "center",
      cellClassName: "actions",
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
    <div
      style={{
        marginTop: 60,
        height: 400,
        width: "100%",
      }}>
      <h1>Administracion de Categorias</h1>
      <Box
        sx={{
          margin: "60px auto",
          height: "auto",
          width: "40%",
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
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { setRows, rows, setRowModesModel },
          }}
        />
      </Box>
    </div>
  );
};
