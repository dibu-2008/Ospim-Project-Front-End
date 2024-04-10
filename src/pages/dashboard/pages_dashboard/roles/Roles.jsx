import * as locales from "@mui/material/locale";
import { useState, useEffect, useMemo } from "react";
import { Box, Button } from "@mui/material";

import { Add, Edit, DeleteOutlined, Save, Close } from "@mui/icons-material";
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
  GridToolbar,
} from "@mui/x-data-grid";

import { axiosRoles } from "./RolesApi";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";

import Swal from "sweetalert2";
import "./Roles.css";

const crearNuevoRegistro = (props) => {
  const { 
    setRows, 
    rows, 
    setRowModesModel, 
    volverPrimerPagina,
    showQuickFilter,
    themeWithLocale
  } = props;

  const altaHandleClick = () => {
    const maxId = rows ? Math.max(...rows.map((row) => row.id), 0) : 1;

    const newId = maxId + 1;
    const id = newId;
    volverPrimerPagina();

    setRows((oldRows) => [{ id, descripcion: "", isNew: true }, ...oldRows]);
    setRowModesModel((oldModel) => ({
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
      ...oldModel,
    }));
  };

  return (
    <GridToolbarContainer theme={themeWithLocale} style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Button color="primary" startIcon={<AddIcon />} onClick={altaHandleClick}>
        Nuevo Registro
      </Button>
      <GridToolbar
        showQuickFilter={showQuickFilter}
      />
    </GridToolbarContainer>
  );
};

export const Roles = () => {
  const [locale, setLocale] = useState("esES");
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const volverPrimerPagina = () => {
    setPaginationModel((prevPaginationModel) => ({
      ...prevPaginationModel,
      page: 0,
    }));
  };

  const theme = useTheme();

  const themeWithLocale = useMemo(
    () => createTheme(theme, locales[locale]),
    [locale, theme]
  );

  useEffect(() => {
    const ObtenerRoles = async () => {
      const response = await axiosRoles.deUsuarioConsultar();
      setRows(response.map((item) => ({ id: item.id, ...item })));
    };
    ObtenerRoles();
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
    const showSwalConfirm = async () => {
      try {
        Swal.fire({
          title: "¿Estás seguro?",
          text: "¡No podrás revertir esto!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#1A76D2",
          cancelButtonColor: "#6c757d",
          confirmButtonText: "Si, bórralo!",
        }).then(async (result) => {
          if (result.isConfirmed) {
            const bBajaOk = await axiosRoles.eliminar(id);
            if (bBajaOk) setRows(rows.filter((row) => row.id !== id));
          }
        });
      } catch (error) {
        console.error("Error al ejecutar eliminarRoles:", error);
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

  const processRowUpdate = async (newRow, oldRow) => {
    console.log("processRowUpdate - INIT");
    let bOk = false;

    if (newRow.isNew) {
      console.log("processRowUpdate - ALTA");
      try {
        delete newRow.id;
        delete newRow.isNew;
        const data = await axiosRoles.crear(newRow);
        if (data && data.id) {
          newRow.id = data.id;
          newRow.isNew = false;
          bOk = true;
          const newRows = rows.map((row) => (row.isNew ? newRow : row));
          setRows(newRows);
        } else {
          console.log("alta sin ID generado");
        }
      } catch (error) {
        console.log(
          "X - processRowUpdate - ALTA - ERROR: " + JSON.stringify(error)
        );
      }
    } else {
      console.log("3 - processRowUpdate - MODI ");
      try {
        delete newRow.isNew;
        bOk = await axiosRoles.actualizar(newRow);
        console.log("4 - processRowUpdate - MODI - bOk: " + bOk);
        newRow.isNew = false;
        if (bOk) {
          setRows(rows.map((row) => (row.id === newRow.id ? newRow : row)));
        }
      } catch (error) {
        console.log(
          "X - processRowUpdate - MODI - ERROR: " + JSON.stringify(error)
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

  const columnas = [
    {
      field: "descripcion",
      headerName: "Descripción",
      flex: 1,
      type: "string",
      editable: true,
      headerAlign: "center",
      align: "center",
      headerClassName: "header--cell",
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Acciones",
      flex: 1,
      cellClassName: "actions",
      headerAlign: "center",
      align: "center",
      headerClassName: "header--cell",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Guardar"
              sx={{ color: "primary.main" }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancelar"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Editar"
            className="textPrimary"
            onClick={handleEditClick(id)}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Eliminar"
            className="textPrimary"
            onClick={handleDeleteClick(id)}
          />,
        ];
      },
    },
  ];

  return (
    <div className="feriados_container">
      <h1>Administración de Roles</h1>
      <Box
        sx={{
          height: "600px",
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
            columns={columnas}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={(updatedRow, originalRow) =>
              processRowUpdate(updatedRow, originalRow)
            }
            slots={{ toolbar: crearNuevoRegistro }}
            slotProps={{
              toolbar: { 
                setRows, 
                rows, 
                setRowModesModel, 
                volverPrimerPagina,
                showQuickFilter: true,
                themeWithLocale
              },
            }}
            sx={{
              "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
                width: "8px",
                visibility: "visible",
              },
              "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb": {
                backgroundColor: "#ccc",
              },
              "& .css-1iyq7zh-MuiDataGrid-columnHeaders": {
                backgroundColor: "#1A76D2 !important",
              },
            }}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 15, 25]}
          />
        </ThemeProvider>
      </Box>
    </div>
  );
};
