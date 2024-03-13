import * as locales from "@mui/material/locale";
import { useState, useEffect, useMemo, useRef } from "react";
import { Box, Button, TextField } from "@mui/material";

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
} from "@mui/x-data-grid";
import { axiosFeriados } from "./FeriadosApi";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";

import Swal from "sweetalert2";
import "./Feriados.css";
import DateRangeIcon from "@mui/icons-material/DateRange";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { esES } from "@mui/x-date-pickers/locales";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import formatter from "@/common/formatter";
import swal from "@/components/swal/swal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #1A76D2",
  boxShadow: 24,
  p: 4,
};

// Traerme las etiquetas del dom que tengas la clase .MuiDataGrid-cell--editable
const crearNuevoRegistro = (props) => {
  const { setRows, rows, setRowModesModel, volverPrimerPagina } = props;

  const altaHandleClick = () => {
    const maxId = rows ? Math.max(...rows.map((row) => row.id), 0) : 1;
    const newId = maxId + 1;
    const id = newId;
    volverPrimerPagina();

    setRows((oldRows) => [{ id, fecha: "", isNew: true }, ...oldRows]);
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

export const Feriados = () => {

  const [locale, setLocale] = useState("esES");
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const gridRef = useRef(null);

  // State del modal *************************************************
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [fecha, setFecha] = useState(null);

  const handleChangeFecha = (date) => setFecha(date);
  // State del modal *************************************************

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
    const ObtenerFeriados = async () => {
      const response = await axiosFeriados.consultar();
      setRows(response);
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
            const bBajaOk = await axiosFeriados.eliminar(id);
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
    console.log("processRowUpdate - INIT");
    let bOk = false;
    /*
    const fecha = new Date(newRow.fecha);
    fecha.setUTCHours(0, 0, 0, 0);
    const fechaFormateada = fecha.toISOString();
*/

    if (newRow.isNew) {
      console.log("processRowUpdate - ALTA");
      try {
        delete newRow.id;
        delete newRow.isNew;
        const data = await axiosFeriados.crear(newRow);
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
        bOk = await axiosFeriados.actualizar(newRow);
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

  const obSubmitAnio = async (e) => {
    
    e.preventDefault();
    const anio = fecha.$y;

    const response = await axiosFeriados.duplicar(anio);

    if (response) {
      swal.showSuccess("Año duplicado correctamente");
    }else {
      swal.showError("Error al duplicar el año");  
    }
    
    handleClose();

  }

  useEffect(() => {
    const paintCells = () => {
      const feriadosContainer = document.querySelector(".feriados_container");
      const cellEditable = feriadosContainer.querySelectorAll(
        ".MuiDataGrid-cell--editable"
      );
      cellEditable.forEach((cell) => {
        cell.style.backgroundColor = "rgba(26, 118, 210, 0.550)";
        cell.style.color = "white";
      });

      const dias = [];

      cellEditable.forEach((cell) => {
        const dia = cell.nextElementSibling;
        dias.push(dia);
      });

      dias.forEach((dia) => {
        dia.style.backgroundColor = "rgba(26, 118, 210, 0.550)";
        dia.style.color = "white";
      });
    };

    // Esperar un poco antes de pintar las celdas
    const timeoutId = setTimeout(() => {
      paintCells();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  const columnas = [
    {
      field: "fecha",
      headerName: "Fecha",
      flex: 1,
      type: "date",
      editable: true,
      headerAlign: "center",
      align: "center",
      headerClassName: "header--cell",
      valueFormatter: ({ value }) => {
        return formatter.date(value);
      },
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
        /* const isEvenRow = numeroFila % 2 !== 0;
        console.log("row", id) */

        // buscar el id en rows y obtener el numeroFila que siga esta logica numeroFila % 2 !== 0;
        const isEvenRow =
          rows.find((row) => row.id === id).numeroFila % 2 !== 0;

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
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Eliminar"
            className="textPrimary"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <div className="feriados_container">
      <h1>
        Administración de feriados
        <DateRangeIcon
          sx={{ marginLeft: "10px", fontSize: "2rem", cursor: "pointer" }}
          onClick={handleOpen}
        />
      </h1>
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
            ref={gridRef}
            onRender={() => {
              if (gridRef.current) {
                paintCells();
              }
            }}
            rows={rows}
            columns={columnas}
            isCellEditable={(params) => params.row.numeroFila % 2 != 0}
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

              /* "& .MuiDataGrid-cell--editable": {
                bgcolor: (theme) =>
                  theme.palette.mode === "dark" ? "#1A76D2" : "rgba(26, 118, 210, 0.550)",
                color: (theme) => (theme.palette.mode === "dark" ? "white" : "white"),
              }, */
            }}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 15, 25]}
          />
        </ThemeProvider>
      </Box>
      {/* MODAL *********************************************************************************** */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form
            onSubmit={obSubmitAnio}
          >
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale={"es"}
              localeText={
                esES.components.MuiLocalizationProvider.defaultProps.localeText
              }
            >
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label={"Año"}
                  views={["year"]}
                  onChange={handleChangeFecha}
                  value={fecha}
                />
              </DemoContainer>
            </LocalizationProvider>
            <Button
              variant="contained"
              sx={{ marginTop: '10px' }}
              type="submit">
              Enviar
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

/* he usado setTimeout dentro del efecto de React para asegurarme 
de que las celdas se pinten después de que el componente se monte 
y el DOM esté completamente cargado, también use el evento onRender 
proporcionado por DataGrid para asegurarme de que las celdas se 
vuelvan a pintar cada vez que se renderiza el componente. */
