import * as locales from "@mui/material/locale";
import { useState, useEffect, useMemo } from "react";
import { Box, Button } from "@mui/material";

import { Add, Edit, DeleteOutlined, Save, Close } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";

import { axiosUsuariosInternos } from "./AltaUsuarioInternoApi";
import { axiosRoles } from "@pages/dashboard/pages_dashboard/roles/RolesApi";

import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";

import Swal from "sweetalert2";
import "./AltaUsuarioInterno.css";

const crearNuevoRegistro = (props) => {
  const { setRows, rows, setRowModesModel, volverPrimerPagina } = props;

  const altaHandleClick = () => {
    const maxId = Math.max(...rows.map((row) => row.id), 0);
    const newId = maxId + 1;
    const id = newId;
    volverPrimerPagina();

    //saque campo:         password2: "",
    setRows((oldRows) => [
      {
        id,
        apellido: "",
        nombre: "",
        descripcion: "",
        email: "",
        clave: "",
        rolId: "",
        habilitado: null,
        isNew: true,
      },
      ...oldRows,
    ]);
    setRowModesModel((oldModel) => ({
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
      ...oldModel,
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={altaHandleClick}>
        Nuevo Registro
      </Button>
    </GridToolbarContainer>
  );
};

export const AltaUsuarioInterno = () => {
  const [locale, setLocale] = useState("esES");
  const [rowModesModel, setRowModesModel] = useState({});
  const [rows, setRows] = useState([]);
  const [roles, setRoles] = useState([]);
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
    const ObtenerUsuariosInternos = async () => {
      const response = await axiosUsuariosInternos.consultar();
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
            const bBajaOk = await axiosUsuariosInternos.eliminar(id);
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
        delete newRow.repetirClave;
        bOk = await axiosUsuariosInternos.actualizar(newRow);
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

  const handleHabilitar = (id) => async () => {
    const updatedRow = { ...rows.find((row) => row.id === id) };
    updatedRow.habilitado = !updatedRow.habilitado;
    setRows(rows.map((row) => (row.id === id ? updatedRow : row)));

    await axiosUsuariosInternos.habilitar(id, updatedRow.habilitado);
  };

  const columns = [
    {
      field: "apellido",
      headerName: "Apellido",
      flex: 1,
      type: "string",
      editable: true,
      headerAlign: "center",
      align: "center",
      headerClassName: "header--cell",
    },
    {
      field: "nombre",
      headerName: "Nombre",
      flex: 1,
      type: "string",
      editable: true,
      headerAlign: "center",
      align: "center",
      headerClassName: "header--cell",
    },
    {
      field: "descripcion",
      headerName: "Usuario",
      flex: 1,
      type: "string",
      editable: true,
      headerAlign: "center",
      align: "center",
      headerClassName: "header--cell",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 2,
      type: "string",
      editable: true,
      headerAlign: "center",
      align: "center",
      headerClassName: "header--cell",
    },
    {
      field: "clave",
      headerName: "Contraseña",
      flex: 1,
      type: "string",
      editable: true,
      headerAlign: "center",
      align: "center",
      headerClassName: "header--cell",
    },
    {
      field: "repetirClave",
      headerName: "Repetir Contraseña",
      flex: 1,
      type: "string",
      editable: true,
      headerAlign: "center",
      align: "center",
      headerClassName: "header--cell",
      valueGetter: (params) => {
        return params.row.clave;
      },
    },
    {
      field: "rolId",
      headerName: "Rol",
      flex: 2,
      type: "singleSelect",
      editable: true,
      headerAlign: "center",
      align: "center",
      headerClassName: "header--cell",
      valueOptions: roles.map((item) => {
        return { value: item.id, label: item.descripcion };
      }),
    },
    {
      field: "habilitado",
      headerName: "Habilitado",
      flex: 2,
      width: 40,
      minWidth: 25,
      maxWidth: 80,
      type: "string",
      headerAlign: "center",
      align: "center",
      editable: false,
      valueGetter: (params) => {
        return params.row.habilitado ? "Si" : "No";
      },
      headerClassName: "header--cell",
      cellClassName: "habilitado--cell",
    },
    {
      field: "actions",
      headerName: "Acciones",
      flex: 2,
      type: "actions",
      headerAlign: "center",
      align: "center",
      headerClassName: "header--cell",
      getActions: ({ id, row }) => {
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
            icon={
              row.habilitado ? (
                <CloseIcon sx={{ color: "red" }} />
              ) : (
                <CheckIcon sx={{ color: "green" }} />
              )
            }
            label={row.habilitado ? "Cerrar" : "Abrir"}
            onClick={handleHabilitar(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <div className="usuario_interno_container">
      <h1>Alta Usuario Interno</h1>
      <Box
        sx={{
          height: "600px",
          width: "100%",
          overflowX: "auto",
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
            processRowUpdate={(updatedRow, originalRow) =>
              processRowUpdate(updatedRow, originalRow)
            }
            slots={{ toolbar: crearNuevoRegistro }}
            slotProps={{
              toolbar: { setRows, rows, setRowModesModel, volverPrimerPagina },
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
