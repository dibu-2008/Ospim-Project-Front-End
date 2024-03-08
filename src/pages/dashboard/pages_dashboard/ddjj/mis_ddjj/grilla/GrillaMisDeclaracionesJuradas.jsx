import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridToolbar,
} from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { axiosDDJJ } from "./GrillaMisDeclaracionesJuradasApi";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { MyDocument } from "./MiPdf";
import Swal from "sweetalert2";
import dayjs from "dayjs";

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

export const GrillaMisDeclaracionesJuradas = ({
  rows_mis_ddjj,
  setRowsMisDdjj,
  token,
  idEmpresa,
  setTabState,
  setPeriodo,
  handleAcceptPeriodoDDJJ,
  rowsAltaDDJJ,
  setRowsAltaDDJJ,
  setPeticion,
  setIdDDJJ,
}) => {
  const [rowModesModel, setRowModesModel] = useState({});
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  let colAportes = [];

  useEffect(() => {
    const ObtenerMisDeclaracionesJuradas = async () => {
      let ddjjResponse = await axiosDDJJ.consultar(idEmpresa);
      //let ddjjResponse = await obtenerMisDeclaracionesJuradas(idEmpresa, token);

      //Agrego las columnas deTotales de Aportes
      ddjjResponse = await castearMisDDJJ(ddjjResponse);

      setRowsMisDdjj(ddjjResponse.map((item) => ({ id: item.id, ...item })));
    };

    ObtenerMisDeclaracionesJuradas();
  }, []);

  const PresentarDeclaracionesJuradas = async (id) => {
    const updatedRow = { ...rows_mis_ddjj.find((row) => row.id === id) };

    updatedRow.estado = "PR";

    const estado = {
      estado: updatedRow.estado,
    };

    const bRta = await axiosDDJJ.presentar(idEmpresa, id);
    //await presentarDeclaracionJurada(idEmpresa, id, estado, token);
    if (bRta)
      setRowsMisDdjj(
        rows_mis_ddjj.map((row) => (row.id === id ? updatedRow : row))
      );

    return updatedRow;
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id, row) => async () => {
    setTabState(0);

    const ddjj = await axiosDDJJ.getDDJJ(idEmpresa, id);
    //const ddjj = await obtenerMiDeclaracionJurada(idEmpresa, id, token);

    const periodoResponse = ddjj.periodo;
    const fecha = new Date(periodoResponse);

    const mes = fecha.getMonth() + 1; // Sumar 1 porque los meses van de 0 a 11
    const anio = fecha.getFullYear();

    setPeriodo(dayjs(`${anio}-${mes + 1}`));

    handleAcceptPeriodoDDJJ();

    const afiliados = ddjj.afiliados;

    const updateRowsAltaDDJJ = afiliados.map((item, index) => ({
      id: index + 1,
      ...item,
    }));

    setPeticion("PUT");

    setIdDDJJ(id);

    setRowsAltaDDJJ(updateRowsAltaDDJJ);
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const declaracionJuradasImpresion = async (idDDJJ) => {
    await axiosDDJJ.imprimir(idEmpresa, idDDJJ);
    //await imprimirDeclaracionJurada(idEmpresa, idDDJJ, token);
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
            const bRta = axiosDDJJ.eliminar(idEmpresa, id);
            if (bRta)
              setRowsMisDdjj(rows_mis_ddjj.filter((row) => row.id !== id));
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

    const editedRow = rows_mis_ddjj.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRowsMisDdjj(rows_mis_ddjj.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = async (newRow) => {
    const updatedRow = { ...newRow, isNew: false };

    if (newRow.isNew) {
    } else {
    }

    setRowsMisDdjj(
      rows_mis_ddjj.map((row) => (row.id === newRow.id ? updatedRow : row))
    );

    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const formatter = new Intl.NumberFormat("es-CL", {
    minimumFractionDigits: 2,
    useGrouping: true,
    currency: "CLP",
    style: "currency",
  });

  //1ro seteo columans fijas
  let columns = [
    {
      field: "periodo",
      headerName: "Periodo",
      flex: 1,
      editable: true,
      type: "date",
      headerAlign: "center",
      align: "center",
      headerClassName: "header--cell",
      valueFormatter: (params) => {
        const date = new Date(params.value);

        //const day = date.getUTCDate().toString().padStart(2, "0");
        const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
        const year = date.getUTCFullYear();

        //return `${day}-${month}-${year}`;
        return `${month}/${year}`;
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
          return "Original Nulo";
        } else if (params.value === 0) {
          return "Original";
        } else {
          return "Rectificativa " + params.value;
        }
      },
    },
  ];

  colAportes = misDDJJColumnaAporteGet(rows_mis_ddjj);

  colAportes.forEach((elem) => {
    columns.push({
      field: "total" + elem,
      headerName: "Total " + elem,
      flex: 1,
      editable: true,
      headerAlign: "center",
      align: "center",
      headerClassName: "header--cell",
      valueFormatter: (params) => formatter.format(params.value || 0),
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

      if (row.estado === "PE") {
        return [
          <Button
            sx={{
              width: "160px",
            }}
            onClick={() => PresentarDeclaracionesJuradas(id)}
            variant="contained"
          >
            Presentar
          </Button>,
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id, row)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<LocalPrintshopIcon />}
            label="Print"
            color="inherit"
            onClick={() => declaracionJuradasImpresion(id)}
          />,
          /* <PDFDownloadLink
            document={<MyDocument rows_mis_ddjj={rows_mis_ddjj} />}
            fileName="ddjj.pdf"
          >
            <GridActionsCellItem
              icon={<LocalPrintshopIcon />}
              label="Print"
              color="inherit"
            />
          </PDFDownloadLink>, */
        ];
      } else {
        return [
          <Button
            sx={{
              width: "160px",
              marginLeft: "-40px",
            }}
            variant="contained"
          >
            Generar Boleta
          </Button>,
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id, row)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<LocalPrintshopIcon />}
            label="Print"
            color="inherit"
            onClick={() => declaracionJuradasImpresion(id)}
          />,
          /* <PDFDownloadLink
            document={<MyDocument rows_mis_ddjj={rows_mis_ddjj} />}
            fileName="ddjj.pdf"
          >
            <GridActionsCellItem
              icon={<LocalPrintshopIcon />}
              label="Print"
              color="inherit"
            />
            ,
          </PDFDownloadLink>, */
        ];
      }
    },
  });

  return (
    <div
      style={{
        marginTop: 50,
        height: 400,
        width: "100%",
      }}
    >
      <Box
        sx={{
          margin: "0 auto",
          height: "600px",
          width: "100%%",
          "& .actions": {
            color: "text.secondary",
          },
          "& .textPrimary": {
            color: "text.primary",
          },
        }}
      >
        <DataGrid
          rows={rows_mis_ddjj}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          /* slots={{
                        toolbar: GridToolbar,
                    }} */
          /* 
                    slotProps={{
                        toolbar: { setRowsMisDdjj, rows_mis_ddjj, setRowModesModel },
                    }} */
          sx={{
            // ...
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
      {/* <PDFViewer style={{ width: "100%", height: "500px" }}>
        <MyDocument rows_mis_ddjj={rows_mis_ddjj} />
      </PDFViewer> */}
    </div>
  );
};
