import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import formatter from "@/common/formatter";
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
import { useNavigate } from "react-router-dom";
import { StripedDataGrid, dataGridStyle } from "@/common/dataGridStyle";

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
  setDDJJState,
  setPeriodo,
  rows_mis_ddjj,
  setRowsMisDdjj,
  idEmpresa,
  setTabState,
  /* 
  handleAcceptPeriodoDDJJ, */
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

  const navigate = useNavigate();

  const handleGenerarBoletaClick = (id) => () => {
    try {
      navigate(`/dashboard/generarboletas/${id}`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const ObtenerMisDeclaracionesJuradas = async () => {
      let ddjjResponse = await axiosDDJJ.consultar(idEmpresa);

      //Agrego las columnas deTotales de Aportes
      ddjjResponse = await castearMisDDJJ(ddjjResponse);

      setRowsMisDdjj(ddjjResponse.map((item) => ({ id: item.id, ...item })));
    };

    ObtenerMisDeclaracionesJuradas();
  }, []);

  const PresentarDeclaracionesJuradas = async (id) => {
    const updatedRow = { ...rows_mis_ddjj.find((row) => row.id === id) };

    const estado = {
      estado: updatedRow.estado,
    };

    const bRta = await axiosDDJJ.presentar(idEmpresa, id);
    if (bRta) {
      setRowsMisDdjj(
        rows_mis_ddjj.map((row) => (row.id === id ? updatedRow : row))
      );
      updatedRow.estado = "PR";
    }

    return updatedRow;
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id, row) => async () => {
    const ddjj = await axiosDDJJ.getDDJJ(idEmpresa, id);
    console.log("ddjj: ", ddjj);

    const { periodo, afiliados } = ddjj;

    const fecha = formatter.periodo2(periodo);
    console.log("fecha: ", fecha);


    // Agregarle a afiliados la propiedad isNew con el valor de false
    afiliados.forEach((afiliado) => (afiliado.isNew = false));

    //Actualizo estados de solapa DDJJ y cambio de Tab
    setPeticion("PUT");
    setPeriodo(dayjs(fecha));
    setRowsAltaDDJJ(afiliados);
    setDDJJState(ddjj);
    setTabState(0);
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const declaracionJuradasImpresion = async (idDDJJ) => {
    await axiosDDJJ.imprimir(idEmpresa, idDDJJ);
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
          console.log(
            "handleDeleteClick() - idEmpresa: " + idEmpresa + " id: " + id
          );
          if (result.isConfirmed) {
            const bRta = await axiosDDJJ.eliminar(idEmpresa, id);
            console.log("bRta: " + bRta);
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
            onClick={handleEditClick(id)}
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
          />
        ];
      } else {
        return [
          <Button
            sx={{
              width: "160px",
              marginLeft: "-40px",
            }}
            variant="contained"
            onClick={handleGenerarBoletaClick(id)}
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
          />
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
        <StripedDataGrid
          rows={rows_mis_ddjj}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          localeText={dataGridStyle.toolbarText}
          slots={{
            toolbar: GridToolbar,
          }}
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
    </div>
  );
};
