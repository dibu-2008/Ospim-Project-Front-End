import * as locales from "@mui/material/locale";
import { useState, useEffect, useMemo} from "react";
import {
  Box,
  Button,
} from "@mui/material";
import {  TextField} from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  GridRowModes,
  GridToolbar,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import { axiosAjustes } from "./AjustesApi";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import "./ajustes.css";
import formatter from "@/common/formatter";
import swal from "@/components/swal/swal";
import { StripedDataGrid, dataGridStyle } from "@/common/dataGridStyle";
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { esES } from '@mui/x-date-pickers/locales';



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
    const newReg = { fecha: "" };

    volverPrimerPagina();

    setRows((oldRows) => [newReg, ...oldRows]);
    setRowModesModel((oldModel) => ({
      [0]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
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

export const Ajustes = () => {
  const [locale, setLocale] = useState("esES");
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 50,
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

  const ObtenerAjustes = async () => {
    const response = await axiosAjustes.consultar();
    setRows(response);
  };

  useEffect(() => {
    ObtenerAjustes();
  }, []);

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (row) => () => {
    console.log("handleEditClick - row:");
    console.log(row);
    setRowModesModel({
      ...rowModesModel,
      [rows.indexOf(row)]: { mode: GridRowModes.Edit },
    });
  };

  const handleSaveClick = (row) => () => {
    setRowModesModel({
      ...rowModesModel,
      [rows.indexOf(row)]: { mode: GridRowModes.View },
    });
  };

  const handleCancelClick = (row) => () => {
    setRowModesModel({
      ...rowModesModel,
      [rows.indexOf(row)]: {
        mode: GridRowModes.View,
        ignoreModifications: true,
      },
    });

    const editedRow = rows.find((reg) => reg.id === row.id);
    if (editedRow.isNew) {
      setRows(rows.filter((reg) => reg.id !== row.id));
    }
  };

  const processRowUpdate = async (newRow, oldRow) => {
    console.log("processRowUpdate - INIT");
    let bOk = false;

    if (!newRow.id) {
      try {
        const data = await axiosAjustes.crear(newRow);
        if (data && data.id) {
          newRow.id = data.id;
          bOk = true;
          const newRows = rows.map((row) => (!row.id ? newRow : row));
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
      try {
        bOk = await axiosAjustes.actualizar(newRow);
        if (bOk) {
          const rowsNew = rows.map((row) =>
            row.id === newRow.id ? newRow : row
          );
          setRows(rowsNew);
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
   //{
   //  field: "fecha",
   //  headerName: "Fecha",
   //  flex: 1,
   //  type: "date",
   //  editable: true,
   //  headerAlign: "center",
   //  align: "center",
   //  headerClassName: "header--cell",
   //  valueFormatter: ({ value }) => {
   //    return formatter.date(value);
   //  },
   //},
    { field: 'cuit',
        headerName: 'CUIT',
        flex: 1,
        type:'text',
        editable: true,
        headerAlign: "center",
        align:"center",
        headerClassName: "header--cell"
      },
      {
        field: 'periodo_original',
        headerName: 'PERIODO ORIGINAL',
        flex: 1,
        type:'month',
        editable: true,
        headerAlign: "center",
        align:"center",
        headerClassName: "header--cell"
      },
      {
        field: 'importe',
        headerName: 'IMPORTE',
        flex: 1,
        type:'number',
        editable: true,
        headerAlign: "center",
        align:"center",
        headerClassName: "header--cell"
      },
      {
        field: 'aporte',
        headerName: 'TIPO APORTE',
        type:'singleSelect',
        flex:1,
        valueOptions: { 1: 'ART.46', 2: 'AMTIMA', 3: 'UOMA' },
        headerAlign: "center",
        align:"center",
        headerClassName: "header--cell"
      },
      {
        field: 'vigencia',
        headerName: 'VIGENTE DESDE',
        width: 200,
        flex: 1,
        editable: true,
        headerAlign: 'center',
        align: 'center',
        renderEditCell: (params) => (
            <TextField
              type="month"
              autoFocus
              value={formatter.periodo(params.value).split('/')[1] + '-' + formatter.periodo(params.value).split('/')[0]}
              onBlur={params.stopEditing}
            />
        ),
        renderCell: (params) => formatter.periodo(params.value),
        headerClassName: 'header--cell',
      },
      { field: 'nro_boleta',
        headerName: 'NRO BOLETA',
        width: 150,
        editable: false,
        headerAlign: "center",
        align:"center",
        headerClassName: "header--cell" },
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
          rowModesModel[rows.indexOf(row)]?.mode === GridRowModes.Edit;

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
          />
        ];
      },
    },
  ];

  return (
    <div className="ajustes_container">
      <h1
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        Administración de Ajustes
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
            getRowId={(row) => rows.indexOf(row)}
            getRowClassName={(params) =>
              rows.indexOf(params.row) % 2 === 0 ? "even" : "odd"
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
    </div>
  );
};
