import { useState, useEffect, useMemo } from "react";
import { axiosPublicaciones } from "./PublicacionesApi";
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
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import * as locales from "@mui/material/locale";
import Swal from "sweetalert2";
import "./Publicaciones.css";
import { ThreeCircles } from "react-loader-spinner";

export const Publicaciones = () => {
  const [locale, setLocale] = useState("esES");
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [showDataGrid, setShowDataGrid] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const theme = useTheme();

  const themeWithLocale = useMemo(
    () => createTheme(theme, locales[locale]),
    [locale, theme]
  );

  //Consulta rows de la Grilla
  useEffect(() => {
    const obtenerPublicaciones = async () => {
      const publicaciones = await axiosPublicaciones.consultar();
      setRows(publicaciones.map((item, index) => ({ ...item, id: item.id })));
    };

    obtenerPublicaciones();
  }, []);

  const volverPrimerPagina = () => {
    setPaginationModel((prevPaginationModel) => ({
      ...prevPaginationModel,
      page: 0,
    }));
  };

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
            const bBajaOk = await axiosPublicaciones.eliminar(id);
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

    let fechaDesdeOri = null;
    let fechaHastaOri = null;
    if (newRow.vigenciaDesde) {
      fechaDesdeOri = new Date(newRow.vigenciaDesde);
      fechaDesdeOri.setUTCHours(0, 0, 0, 0);
      const fechaDesdeFormateada = fechaDesdeOri.toISOString();
      newRow.vigenciaDesde = fechaDesdeFormateada;
    }
    if (newRow.vigenciaHasta) {
      fechaHastaOri = new Date(newRow.vigenciaHasta);
      fechaHastaOri.setUTCHours(0, 0, 0, 0);
      const fechaHastaFormateada = fechaHastaOri.toISOString();
      newRow.vigenciaHasta = fechaHastaFormateada;
    }

    if (newRow.isNew) {
      console.log("processRowUpdate - ALTA");
      try {
        delete newRow.id;
        delete newRow.isNew;
        const data = await axiosPublicaciones.crear(newRow);
        if (data && data.id) {
          newRow.id = data.id;
          newRow.isNew = false;
          bOk = true;
          const newRows = rows.map((row) => (row.isNew ? newRow : row));
          setRows(newRows);
        }
      } catch (error) {
        console.log(
          "X - processRowUpdate - ALTA - ERROR: " + JSON.stringify(error)
        );
      }
    } else {
      console.log("processRowUpdate - MODI");
      try {
        delete newRow.isNew;
        bOk = await axiosPublicaciones.actualizar(newRow);
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

    if (fechaDesdeOri) newRow.vigenciaDesde = fechaDesdeOri;
    if (fechaHastaOri) newRow.vigenciaHasta = fechaHastaOri;

    if (bOk) {
      return newRow;
    } else {
      return oldRow;
    }
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDataGrid(true);
    }, 2000);

    return () => clearTimeout(timer);
  });

  const columns = [
    {
      field: "titulo",
      headerName: "Titulo",
      flex: 1,
      type: "string",
      editable: true,
      headerAlign: "center",
      align: "center",
      headerClassName: "header--cell",
    },
    {
      field: "cuerpo",
      headerName: "Cuerpo",
      flex: 1,
      type: "string",
      editable: true,
      headerAlign: "center",
      align: "center",
      headerClassName: "header--cell header--cell--left",
    },
    {
      field: "vigenciaDesde",
      headerName: "Vigencia Desde",
      flex: 1,
      type: "date",
      editable: true,
      headerAlign: "center",
      align: "center",
      headerClassName: "header--cell header--cell--left",
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
      flex: 1,
      type: "date",
      editable: true,
      headerAlign: "center",
      align: "center",
      headerClassName: "header--cell header--cell--left",
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
      flex: 1,
      type: "actions",
      headerAlign: "center",
      align: "center",
      headerClassName: "header--cell header--cell--left",
      getActions: ({ row }) => {
        const id = row.id;
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
        {!showDataGrid && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <ThreeCircles
              visible={true}
              height="100"
              width="100"
              color="#1A76D2"
              ariaLabel="three-circles-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
            <ThreeCircles
              visible={true}
              height="100"
              width="100"
              color="#1A76D2"
              ariaLabel="three-circles-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
            <ThreeCircles
              visible={true}
              height="100"
              width="100"
              color="#1A76D2"
              ariaLabel="three-circles-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        )}
        {showDataGrid && (
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
                toolbar: EditarNuevaFila,
              }}
              slotProps={{
                toolbar: {
                  setRows,
                  rows,
                  setRowModesModel,
                  volverPrimerPagina,
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
        )}
      </Box>
    </div>
  );
};
