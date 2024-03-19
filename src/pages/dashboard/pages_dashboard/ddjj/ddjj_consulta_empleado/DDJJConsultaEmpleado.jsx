import { useEffect, useState } from "react";
import localStorageService from "@/components/localStorage/localStorageService";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { esES } from "@mui/x-date-pickers/locales";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { CSVLink, CSVDownload } from "react-csv";
import { Stack } from "@mui/material";
import Button from "@mui/material/Button";
import { GrillaDDJJConsultaEmpleado } from "./grilla/GrillaDDJJConsultaEmpleado";
import { useNavigate } from "react-router-dom";
import { axiosDDJJ } from "../mis_ddjj/grilla/GrillaMisDeclaracionesJuradasApi";
import { Box } from "@mui/system";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { DataGrid, GridActionsCellItem, GridRowModes } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import formatter from "@/common/formatter";

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

export const DDJJConsultaEmpleado = () => {

  const [rowsMisDDJJ, setRowsMisDDJJ] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [desde, setDesde] = useState(null);
  const [hasta, setHasta] = useState(null);
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState(0);
  const [occupation, setOccupation] = useState("");
  const [data, setData] = useState([
    ["Full Name", "Age", "Occupation"],
    ["Irakli Tchigladze", 32, "writer"],
    ["George Abuladze", 33, "politician"],
    ["Nick Tsereteli", 19, "public worker"],
  ]);

  const idEmpresa = localStorageService.getEmpresaId();

  let colAportes = [];

  const navigate = useNavigate();

  useEffect(() => {
    const ObtenerMisDeclaracionesJuradas = async () => {
      let ddjjResponse = await axiosDDJJ.consultar(idEmpresa);

      //Agrego las columnas deTotales de Aportes
      ddjjResponse = await castearMisDDJJ(ddjjResponse);

      setRowsMisDDJJ(ddjjResponse.map((item) => ({ id: item.id, ...item })));
    };

    ObtenerMisDeclaracionesJuradas();
  }, []);

  const declaracionJuradasImpresion = async (idDDJJ) => {
    await axiosDDJJ.imprimir(idEmpresa, idDDJJ);
  };



  const handleSubmit = (e) => {
    setData([...data, [fullName, age, occupation]]);
    setFullName("");
    setAge(0);
    setOccupation("");
  };
  const ID_EMPRESA = localStorageService.getEmpresaId();

  const handleChangeDesde = (date) => setDesde(date);

  const handleChangeHasta = (date) => setHasta(date);

  const buscarDeclaracionesJuradas = async () => {
    try {
      const ddjjResponse = await axiosDDJJ.consultar(ID_EMPRESA);
      if (desde && desde.$d && hasta && hasta.$d) {
        const { $d: $desde } = desde;
        const { $d: $hasta } = hasta;

        const fechaDesde = new Date($desde);
        fechaDesde.setDate(1); // Seteamos el día del mes a 1
        fechaDesde.setUTCHours(0, 0, 0, 0); // Ajustamos la zona horaria a UTC
        const fechaIsoDesde = fechaDesde.toISOString(); // Convertimos la fecha a ISO

        const fechaHasta = new Date($hasta);
        fechaHasta.setDate(1); // Seteamos el día del mes a 1
        fechaHasta.setUTCHours(0, 0, 0, 0); // Ajustamos la zona horaria a UTC
        const fechaIsoHasta = fechaHasta.toISOString(); // Convertimos la fecha a ISO

        const declaracionesFiltradas = ddjjResponse.filter((ddjj) => {
          const fecha = new Date(ddjj.periodo);
          return (
            fecha >= new Date(fechaIsoDesde) && fecha <= new Date(fechaIsoHasta)
          );
        });
        setRowsMisDDJJ(declaracionesFiltradas);
      } else {
        setRowsMisDDJJ(ddjjResponse);
      }
    } catch (error) {
      console.error("Error al buscar declaraciones juradas:", error);
    }
  };

  const exportarDeclaracionesJuradas = () => {
    console.log("Exportar declaraciones juradas");
    //console.log(rows_mis_ddjj);
  };

  //1ro seteo columans fijas
  let columns = [
    {
      field: "periodo",
      headerName: "Periodo",
      flex: 1.5,
      editable: true,
      type: "date",
      headerAlign: "center",
      align: "center",
      headerClassName: "header--cell",
      valueFormatter: (params) => {
        return formatter.periodo(params.value);
      },
    },
    {
      field: "secuencia",
      headerName: "Numero",
      flex: 1,
      editable: true,
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
    },
  ];

  colAportes = misDDJJColumnaAporteGet(rowsMisDDJJ);

  colAportes.forEach((elem) => {
    columns.push({
      field: "total" + elem,
      headerName: "Total " + elem,
      flex: 1,
      editable: true,
      headerAlign: "center",
      align: "center",
      headerClassName: "header--cell",
      valueFormatter: (params) => formatter.currency.format(params.value || 0),
    });
  });

  columns.push({
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
          // onClick={handleSaveClick(id)}
          />,
          <GridActionsCellItem
            icon={<CancelIcon />}
            label="Cancel"
            className="textPrimary"
            // onClick={handleCancelClick(id)}
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
      <h1>Consulta de Declaraciones Juradas</h1>
      <div className="mis_declaraciones_juradas_container">
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
                closeOnSelect={false}
                onChange={handleChangeDesde}
                value={desde}
                slotProps={{ actionBar: { actions: ["cancel", "accept"] } }}
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
                closeOnSelect={false}
                onChange={handleChangeHasta}
                value={hasta}
                slotProps={{ actionBar: { actions: ["cancel", "accept"] } }}
              />
            </DemoContainer>
          </LocalizationProvider>
        </Stack>

        <Stack
          spacing={4}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Button onClick={buscarDeclaracionesJuradas} variant="contained">
            Buscar
          </Button>

          <CSVLink data={data}>
            <Button variant="contained" onClick={exportarDeclaracionesJuradas}>
              Exportar CSV
            </Button>
          </CSVLink>
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
            width: "90%",
            "& .actions": {
              color: "text.secondary",
            },
            "& .textPrimary": {
              color: "text.primary",
            },
          }}
        >
          <DataGrid
            rows={rowsMisDDJJ}
            columns={columns}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            sx={{
              "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
                width: "8px",
                visibility: "visible",
              },
              "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb": {
                backgroundColor: "#ccc",
              },
            }}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 15, 25]}
          />
        </Box>
      </Stack>
    </div>
  )
}
