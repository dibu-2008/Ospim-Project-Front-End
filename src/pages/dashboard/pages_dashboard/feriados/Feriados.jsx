import * as locales from "@mui/material/locale";
import { useState, useEffect, useMemo, useRef } from "react";
import {
  Box,
  Button,
  IconButton,
  TextField,
  Tooltip,
  alpha,
  styled,
} from "@mui/material";

import { Add, Edit, DeleteOutlined, Save, Close } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";

import {
  GridRowModes,
  DataGrid,
  GridToolbar,
  gridClasses,
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
import { StripedDataGrid, dataGridStyle } from "@/common/dataGridStyle";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #1A76D2",
  boxShadow: 24,
  p: 4,
};

// Traerme las etiquetas del dom que tengas la clase .MuiDataGrid-cell--editable
const crearNuevoRegistro = (props) => {
  const { setRows, rows, setRowModesModel, volverPrimerPagina } = props;

  const altaHandleClick = () => {
    const maxId = rows ? Math.max(...rows.map((row) => row.internalId), 0) : 1;
    const newId = maxId + 1;
    const internalId = newId;
    volverPrimerPagina();

    setRows((oldRows) => [{ internalId, fecha: "", isNew: true }, ...oldRows]);
    setRowModesModel((oldModel) => ({
      [internalId]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
      ...oldModel,
    }));
  };

  return (
    <GridToolbarContainer>
      <GridToolbar showQuickFilter={props.showQuickFilter} />
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
    pageSize: 50,
    page: 0,
  });

  //const gridRef = useRef(null);

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

  const ObtenerFeriados = async () => {
    const response = await axiosFeriados.consultar();
    setRows(response.map((row, index) => ({ ...row, internalId: index + 1 })));
  };

  useEffect(() => {
    ObtenerFeriados();
  }, []);

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (row) => () => {
    setRowModesModel({
      ...rowModesModel,
      [row.internalId]: { mode: GridRowModes.Edit },
    });
  };

  const handleSaveClick = (row) => () => {
    setRowModesModel({
      ...rowModesModel,
      [row.internalId]: { mode: GridRowModes.View },
    });
  };

  const handleDeleteClick = (row) => async () => {
    console.log(row);
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
            const bBajaOk = await axiosFeriados.eliminar(row.id);
            if (bBajaOk) setRows(rows.filter((row) => row.id !== id));
          }
        });
      } catch (error) {
        console.error("Error al ejecutar eliminarFeriado:", error);
      }
    };

    showSwalConfirm();
  };

  const handleCancelClick = (row) => () => {
    setRowModesModel({
      ...rowModesModel,
      [row.internalId]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((reg) => reg.id === row.id);
    if (editedRow.isNew) {
      setRows(rows.filter((reg) => reg.id !== row.id));
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
        const internalId = newRow.internalId;
        delete newRow.internalId;
        delete newRow.isNew;
        const data = await axiosFeriados.crear(newRow);
        if (data && data.id) {
          newRow.id = data.id;
          newRow.internalId = internalId;
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
        const internalId = newRow.internalId;
        delete newRow.internalId;
        delete newRow.isNew;
        bOk = await axiosFeriados.actualizar(newRow);
        console.log("4 - processRowUpdate - MODI - bOk: " + bOk);
        newRow.isNew = false;
        newRow.internalId = internalId;
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
    console.log("anio: " + anio);
    const response = await axiosFeriados.duplicar(anio);

    if (response) {
      swal.showSuccess("Año duplicado correctamente");
      ObtenerFeriados();
    } else {
      swal.showError("Error al duplicar el año");
    }

    handleClose();
  };

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
      getActions: ({ row }) => {
        const isInEditMode =
          rowModesModel[row.internalId]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Guardar"
              sx={{ color: "primary.main" }}
              onClick={handleSaveClick(row)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancelar"
              className="textPrimary"
              onClick={handleCancelClick(row)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Editar"
            className="textPrimary"
            onClick={handleEditClick(row)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Eliminar"
            className="textPrimary"
            onClick={handleDeleteClick(row)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <div className="feriados_container">
      <h1
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        Administración de feriados
        <Tooltip
          title="Pasar feriados años siguiente"
          sx={{ marginLeft: "10px", cursor: "pointer" }}
        >
          <IconButton>
            <DateRangeIcon
              sx={{
                fontSize: "2.5rem",
                color: "#1A76D2",
              }}
              onClick={handleOpen}
            />
          </IconButton>
        </Tooltip>
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
          <StripedDataGrid
            rows={rows}
            columns={columnas}
            getRowId={(row) => row.internalId}
            getRowClassName={(params) =>
              params.row.internalId % 2 === 0 ? "even" : "odd"
            }
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
              toolbar: { setRows, rows, setRowModesModel, volverPrimerPagina },
            }}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[50, 75, 100]}
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
          <form onSubmit={obSubmitAnio}>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                textAlign: "center",
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                borderRadius: "5px",
                width: "400px",
                marginBottom: "20px",
                color: theme.palette.primary.main,
              }}
            >
              Duplicar feriados
            </Typography>
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
              sx={{ marginTop: "20px" }}
              type="submit"
            >
              Enviar
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};
