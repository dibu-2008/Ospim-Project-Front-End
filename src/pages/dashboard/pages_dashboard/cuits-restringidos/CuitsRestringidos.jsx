import * as locales from "@mui/material/locale";
import { useState, useEffect, useMemo } from "react";
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { axiosCuitsRestringidos } from "./CuitsRestringidosApi";
import Swal from "sweetalert2";
import "./CuitsRestringidos.css";

function EditToolbar(props) {
  const { setRows, rows, setRowModesModel, volverPrimerPagina } = props;

  const altaHandleClick = () => {
    const maxId = Math.max(...rows.map((row) => row.id), 0);
    const newId = maxId + 1;
    const id = newId;
    volverPrimerPagina();

    setRows((oldRows) => [
      { id, cuit: "", observacion: "", isNew: true },
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
}

export const CuitsRestringidos = () => {
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
    const ObtenerCuitsRestringidos = async () => {
      const response = await axiosCuitsRestringidos.consultar();
      setRows(response.map((item) => ({ id: item.id, ...item })));
    };
    ObtenerCuitsRestringidos();
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
            const bBajaOk = await axiosCuitsRestringidos.eliminar(id);
            if (bBajaOk) setRows(rows.filter((row) => row.id !== id));
          }
        });
      } catch (error) {
        console.error("Error al ejecutar eliminarFeriado:", error);
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
    let bOk = false;
    console.log("1 - processRowUpdate - newRow: " + JSON.stringify(newRow));
    if (newRow.isNew) {
      console.log("2 - processRowUpdate - ALTA ");
      try {
        delete newRow.id;
        delete newRow.isNew;
        const data = await axiosCuitsRestringidos.crear(newRow);
        console.log("data: " + JSON.stringify(data));
        if (data && data.id) {
          newRow.id = data.id;
          newRow.isNew = false;
          bOk = true;

          console.log("ALTA - rows: ");
          console.log(rows);
          const newRows = rows.map((row) => (row.isNew ? newRow : row));
          console.log(newRows);
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
        bOk = await axiosCuitsRestringidos.actualizar(newRow);
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

    console.log("5 -processRowUpdate-FIN-newRow: " + JSON.stringify(newRow));

    if (bOk) {
      return newRow;
    } else {
      return oldRow;
    }
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    {
      field: "cuit",
      headerName: "CUIT",
      flex: 1,
      editable: true,
      headerAlign: "center",
      align: "center",
      headerClassName: "header--cell",
    },
    {
      field: "observacion",
      headerName: "Observacion",
      flex: 1,
      editable: true,
      headerAlign: "center",
      align: "center",
      headerClassName: "header--cell",
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Acciones",
      headerAlign: "center",
      align: "center",
      headerClassName: "header--cell",
      flex: 1,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Guardar"
              sx={{
                color: "primary.main",
              }}
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
    <div className="cuits_restringidos_container">
      <h1>Administracion de Cuits restringidos</h1>
      <Box
        sx={{
          height: "600px",
          width: "100%",
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
            slots={{
              toolbar: EditToolbar,
            }}
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
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 15, 25]}
          />
        </ThemeProvider>
      </Box>
    </div>
  );
};
