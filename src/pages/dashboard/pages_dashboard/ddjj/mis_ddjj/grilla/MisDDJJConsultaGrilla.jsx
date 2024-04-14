import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import formatter from "@/common/formatter";
import { GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { axiosDDJJ } from "./MisDDJJConsultaGrillaApi";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { StripedDataGrid, dataGridStyle } from "@/common/dataGridStyle";
import localStorageService from "@/components/localStorage/localStorageService";

export const MisDDJJConsultaGrilla = ({
  rows,
  setRows,
  setTabState,
  setIdDDJJ,
}) => {
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const ID_EMPRESA = localStorageService.getEmpresaId();

  let colAportes = [];

  const navigate = useNavigate();

  const handleGenerarBoletaClick = (id) => () => {
    try {
      navigate(`/dashboard/generarboletas/${id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const PresentarDeclaracionesJuradas = async (id) => {
    const updatedRow = { ...rows.find((row) => row.id === id) };
    const data = await axiosDDJJ.presentar(ID_EMPRESA, id);

    console.log("data: ", data);

    if (data) {
      updatedRow.estado = data.estado || null;
      updatedRow.secuencia = data.secuencia || null;
      setRows(rows.map((row) => (row.id === id ? updatedRow : row)));
    }

    return updatedRow;
  };

  const handleEditClick = (id) => async () => {
    setIdDDJJ(id);
    setTabState(0);
  };

  const declaracionJuradasImpresion = async (idDDJJ) => {
    await axiosDDJJ.imprimir(ID_EMPRESA, idDDJJ);
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
            "handleDeleteClick() - ID_EMPRESA: " + ID_EMPRESA + " id: " + id
          );
          if (result.isConfirmed) {
            const bRta = await axiosDDJJ.eliminar(ID_EMPRESA, id);
            console.log("bRta: " + bRta);
            if (bRta) setRows(rows.filter((row) => row.id !== id));
          }
        });
      } catch (error) {
        console.error("Error al ejecutar eliminarFeriado:", error);
      }
    };
    showSwalConfirm();
  };

  //1ro seteo columans fijas
  let columns = [
    {
      field: "periodo",
      headerName: "Periodo",
      flex: 1,
      editable: false,
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
      editable: false,
      headerAlign: "center",
      align: "center",
      headerClassName: "header--cell",
      valueGetter: (params) => {
        // Si secuencia es 0 es "Original" sino es "Rectificativa"+secuencia
        if (params.value === null) {
          return "Pendiente";
        } else if (params.value === 0) {
          return "Original";
        } else {
          return "Rectif. " + params.value;
        }
      },
    },
  ];

  //Agrego Columnas de Total Concepto.-
  if (rows && rows.length > 0) {
    const reg = rows[0];
    for (let x in reg) {
      const txt = "x: " + x + " - reg[x]:  " + reg[x] + "  --  ";
      if (x.startsWith("total")) {
        columns.push({
          field: "total" + x.replace("total", ""),
          headerName: "Total " + x.replace("total", ""),
          flex: 1,
          editable: false,
          headerAlign: "center",
          align: "center",
          headerClassName: "header--cell",
          valueFormatter: (params) =>
            formatter.currency.format(params.value || 0),
        });
      }
    }
  }

  columns.push({
    field: "actions",
    headerName: "Acciones",
    flex: 2,
    type: "actions",
    headerAlign: "center",
    align: "center",
    headerClassName: "header--cell",
    getActions: ({ id, row }) => {
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
          />,
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
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<LocalPrintshopIcon />}
            label="Print"
            color="inherit"
            onClick={() => declaracionJuradasImpresion(id)}
          />,
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
          rows={rows}
          columns={columns}
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
