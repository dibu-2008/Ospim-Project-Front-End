import { useEffect, useState, useMemo } from "react";
import localStorageService from "@/components/localStorage/localStorageService";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { esES } from "@mui/x-date-pickers/locales";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { CSVLink, CSVDownload } from "react-csv";
import { Stack, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { GrillaDDJJConsultaEmpleado } from "./grilla/GrillaDDJJConsultaEmpleado";
import { useNavigate } from "react-router-dom";
import { axiosDDJJ } from "../mis_ddjj/grilla/GrillaMisDeclaracionesJuradasApi";
import { Box } from "@mui/system";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridActionsCellItem, GridRowModes, GridToolbarContainer, GridToolbar } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import formatter from "@/common/formatter";
import { StripedDataGrid, dataGridStyle } from "@/common/dataGridStyle";
import * as locales from "@mui/material/locale";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import { axiosDDJJEmpleado } from "./DDJJConsultaEmpleadoApi";

function misDDJJColumnaAporteGet(ddjjResponse) {
  //toma todas las ddjj de la consulta de "Mis DDJJ" y arma "vector de Columnas Aportes"
  //Ejemplo: ['UOMACU', 'ART46', 'UOMASC']
  let vecAportes = ddjjResponse.map((item) => item.aportes).flat();
  let colAportes = vecAportes.reduce((acc, item) => {
    if (!acc.includes(item.codigo)) {
      acc.push(item.codigo);
    }
    return acc;
  }, []);
  return colAportes;
}

function ddjjTotalesAportes(ddjj, colAportes) {
  //toma una ddjj de la consulta de "Mis DDJJ" y arma "vector de Columnas Totales por Aportes"

  let vecAportes = ddjj.aportes;

  let vecAportesConTotales = [];
  colAportes.forEach((element) => {
    vecAportesConTotales.push({ codigo: element, importe: 0 });
  });

  vecAportes.forEach((aporte) => {
    vecAportesConTotales.forEach((total) => {
      if (total.codigo == aporte.codigo) {
        total.importe = total.importe + aporte.importe;
      }
    });
  });
  return vecAportesConTotales;
}

function castearMisDDJJ(ddjjResponse) {
  let colAportes = misDDJJColumnaAporteGet(ddjjResponse);
  ddjjResponse.forEach((dj) => {
    let colAportesConTotales = ddjjTotalesAportes(dj, colAportes);

    colAportesConTotales.forEach((regTot) => {
      dj["total" + regTot.codigo] = regTot.importe;
    });
  });
  return ddjjResponse;
}

const paginacion = {
  pageSize: 50,
  page: 0,
}

export const DDJJConsultaEmpleado = () => {

  const [showCuitRazonSocial, setShowCuitRazonSocial] = useState(true);
  const [paginationModel, setPaginationModel] = useState(paginacion);
  const [rowModesModel, setRowModesModel] = useState({});
  const [locale, setLocale] = useState("esES");
  const [desde, setDesde] = useState(null);
  const [hasta, setHasta] = useState(null);
  const [cuit, setCuit] = useState("");
  const [rows, setRows] = useState([]);
  const theme = useTheme();
  const themeWithLocale = useMemo(
    () => createTheme(theme, locales[locale]),
    [locale, theme]
  );

  let colAportes = [];

  useEffect(() => {
    const ObtenerMisDeclaracionesJuradas = async () => {
      let ddjjResponse = await axiosDDJJEmpleado.consultar();
      console.log(ddjjResponse)

      //Agrego las columnas deTotales de Aportes
      ddjjResponse = await castearMisDDJJ(ddjjResponse);

      setRows(ddjjResponse.map((item) => ({ internalId: item.id, ...item })));
    };

    ObtenerMisDeclaracionesJuradas();
  }, []);

  const handleChangeDesde = (date) => setDesde(date);

  const handleChangeHasta = (date) => setHasta(date);

  const handleChangeCuil = (e) => setCuit(e.target.value);

  const buscarDeclaracionesJuradas = async () => {

    // Busqueda por rango de periodo
    if(desde !== null && hasta !== null && cuit === "") {

      const desdeFor = formatter.date(desde.$d);
      const hastaFor = formatter.date(hasta.$d);
      
      const ddjjResponse = await axiosDDJJEmpleado
        .consultarPorRango(desdeFor, hastaFor);
      
      if(ddjjResponse && ddjjResponse.data){
        setRows(ddjjResponse.data.map((item) => ({ internalId: item.id, ...item })));
        setShowCuitRazonSocial(true);
      }
    }

    // Busqueda por cuit
    if(cuit !== "" && desde === null && hasta === null) {
      
      const ddjjResponse = await axiosDDJJEmpleado.consultarPorCuit(cuit);
      
      if(ddjjResponse && ddjjResponse.length > 0){
        console.log("Essssss")
        setRows(ddjjResponse.map((item) => ({ internalId: item.id, ...item })));
        setShowCuitRazonSocial(false);
      }
    }

    // Busqueda por rango de periodo y cuit
    if(desde !== null && hasta !== null && cuit !== "") {

      const desdeFor = formatter.date(desde.$d);
      const hastaFor = formatter.date(hasta.$d);
      
      const ddjjResponse = await axiosDDJJEmpleado
        .consultarPorRangoCuit(desdeFor, hastaFor, cuit);
      
      if(ddjjResponse && ddjjResponse.data){
        setRows(ddjjResponse.data.map((item) => ({ internalId: item.id, ...item })));
      }
    }
    
  };

  const columns = [
    {
      field: "periodo",
      headerName: "Periodo",
      flex: 1.5,
      editable: false,
      type: "date",
      headerAlign: "center",
      align: "center",
      headerClassName: "header--cell",
      valueFormatter: (params) => {
        return formatter.periodo(params.value);
      },
    }
  ];

  if (showCuitRazonSocial) {

    columns.push(
      {
        field: "cuit",
        headerName: "Cuit",
        flex: 1.5,
        editable: false,
        headerAlign: "center",
        align: "center",
        headerClassName: "header--cell",
      },
      {
        field: "razonSocial",
        headerName: "Razon Social",
        flex: 2,
        editable: false,
        headerAlign: "center",
        align: "center",
        headerClassName: "header--cell",
      }
    );
  }

  columns.push(
    {
      field: "secuencia",
      headerName: "Numero",
      flex: 1,
      editable: false,
      headerAlign: "center",
      align: "center",
      headerClassName: "header--cell",
      valueGetter: (params) => {
        // Si secuencia es 0 es "Original" sino es "Rectificativa"+secuencia
        if (params.value === null) {
          return "Original";
        } else if (params.value === 0) {
          return "Original";
        } else {
          return "Rectif. " + params.value;
        }
      },
    }
  );

  colAportes = misDDJJColumnaAporteGet(rows);

  colAportes.forEach((elem) => {
    columns.push({
      field: "total" + elem,
      headerName: "Total " + elem,
      flex: 1,
      editable: false,
      headerAlign: "center",
      align: "center",
      headerClassName: "header--cell",
      valueFormatter: (params) => formatter.currency.format(params.value || 0),
    });
  });

  columns.push({
    field: "actions",
    headerName: "Acciones",
    flex: 1,
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
          />,
          <GridActionsCellItem
            icon={<CancelIcon />}
            label="Cancel"
            className="textPrimary"
            color="inherit"
          />,
        ];
      }

      return [
        <GridActionsCellItem
          icon={<LocalPrintshopIcon />}
          label="Print"
          color="inherit"
          onClick={() => declaracionJuradasImpresion(id)}
        />,
      ]
    },
  });

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  return (
    <div className="declaraciones_juradas_container">
      <h1 style={{
        marginBottom: "50px",
      }}>Consulta de Declaraciones Juradas</h1>
      <div className="mis_declaraciones_juradas_container"
        style={{
          marginBottom: "50px",
        }}
      >
        <Stack
          spacing={4}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale={"es"}
            localeText={
              esES.components.MuiLocalizationProvider.defaultProps.localeText
            }
          >
            <DemoContainer components={["DatePicker"]}>
              <DesktopDatePicker
                label={"Periodo desde"}
                views={["month", "year"]}
                onChange={handleChangeDesde}
                value={desde}
              />
            </DemoContainer>
          </LocalizationProvider>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale={"es"}
            localeText={
              esES.components.MuiLocalizationProvider.defaultProps.localeText
            }
          >
            <DemoContainer components={["DatePicker"]}>
              <DesktopDatePicker
                label={"Periodo hasta"}
                views={["month", "year"]}
                onChange={handleChangeHasta}
                value={hasta}
              />
            </DemoContainer>
          </LocalizationProvider>
          <div style={{
            height: "100px",
            width: "250px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "8px",
          }}>
            <TextField
              id="outlined-basic"
              label="Cuit"
              variant="outlined"
              value={cuit}
              onChange={handleChangeCuil}
            />
          </div>
        </Stack>

        <Stack
          spacing={4}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Button onClick={buscarDeclaracionesJuradas} variant="contained">
            Consultar
          </Button>
        </Stack>
      </div>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center">
        <Box
          sx={{
            margin: "0 auto",
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
              columns={columns}
              getRowId={(row) => row.internalId}
              getRowClassName={(params) =>
                params.row.internalId % 2 === 0 ? "even" : "odd"
              }
              editMode="row"
              rowModesModel={rowModesModel}
              onRowModesModelChange={handleRowModesModelChange}
              localeText={dataGridStyle.toolbarText}
              slots={{ toolbar: GridToolbar }}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[50, 75, 100]}
            />
          </ThemeProvider>
        </Box>
      </Stack>
    </div>
  )
}
