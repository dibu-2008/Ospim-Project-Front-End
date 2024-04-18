import React, { useEffect, useState } from "react";
import { TextField, Button, IconButton, Box } from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Print as PrintIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { getBoletasByEmpresa, downloadPdfBoleta } from "./BoletasApi";
import { downloadPdfBoletaBlanca } from "../otros_pagos/OtrosPagosApi";
import { CSVLink } from "react-csv";
import formatter from "@/common/formatter";
import "./Boletas.css";

export const Boletas = () => {
  const ID_EMPRESA = JSON.parse(localStorage.getItem("stateLogin"))
    .usuarioLogueado.empresa.id;
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [boletas, setBoletas] = useState([]);
  const [boletasVisibles, setBoletasVisibles] = useState([]);
  const [boletasSinAfiliados, setBoletasSinAfiliados] = useState([]); //Esta la necesito para generar el csv
  const [boletasSinDDJJ, setBoletasSinDDJJ] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getBoletasByEmpresa(ID_EMPRESA);
        setBoletas(response.data["con_ddjj"]);
        setBoletasVisibles(
          response.data["con_ddjj"].flatMap((boleta) => ({
            ...boleta,
            id: `${boleta.numero_boleta}`,
          }))
        );
        setBoletasSinDDJJ(response.data["sin_ddjj"]);
        console.log(response);
        setBoletasSinAfiliados(
          response.data["con_ddjj"].flatMap((boleta) => {
            const { afiliados, ...rest } = boleta;
            return { ...rest };
          })
        );
      } catch (error) {
        console.error("Error al obtener las boletas:", error);
      }
    };

    fetchData();
  }, []);

  const handleViewClick = (boletaDetalle) => {
    console.log(boletaDetalle.numero_boleta);
    navigate(`/dashboard/detalleboleta/${boletaDetalle.numero_boleta}`);
  };

  const handleSearch = () => {
    const filteredBoletas = boletas.filter((boleta) => {
      const fecha = boleta.periodo;
      const [mes, anio] = fecha.split("-");
      const timestamp = new Date(`${anio}-${mes}-01`);

      return timestamp >= new Date(fromDate) && timestamp <= new Date(toDate);
    });
    setBoletasVisibles(
      filteredBoletas.flatMap((boleta) => ({
        ...boleta,
        id: `${boleta.numero_boleta}`,
      }))
    );
  };

  return (
    <div className="boletas_container">
      {window.location.href.split("/").slice(3).join("/") ===
        "dashboard/ddjj" || <h1>Boletas</h1>}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        className="mb-4em"
      >
        <div>
          <p>Periodo</p>
          <TextField
            label="Desde"
            type="month"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Hasta"
            type="month"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        <div>
          <Button variant="contained" onClick={handleSearch}>
            Buscar
          </Button>
        </div>
      </div>
      <Box
        style={{ height: 400, width: "100%" }}
        sx={{
          width: "100%",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#1A76D2",
            color: "white",
          },
        }}
      >
        <DataGrid
          rows={boletasVisibles}
          columns={[
            {
              field: "periodo",
              headerName: "Periodo",
              flex: 0.8,
              valueFormatter: (params) =>
                params.value ? formatter.periodo(params.value, "-") : "",
            },
            { field: "tipo_ddjj", headerName: "Tipo DDJJ", flex: 1 },
            { field: "numero_boleta", headerName: "Número", flex: 0.8 },
            { field: "descripcion", headerName: "Concepto", flex: 1 },
            {
              field: "total_final",
              headerName: "Importe Boleta",
              flex: 1,
              align: "right",
              valueFormatter: (params) =>
                params.value ? formatter.currency.format(params.value) : "",
            },
            {
              field: "importe_recibido",
              headerName: "Importe Recibido",
              flex: 1,
              align: "right",
              valueFormatter: (params) =>
                params.value ? formatter.currency.format(params.value) : "",
            },
            {
              field: "fecha_de_pago",
              headerName: "Fecha de Pago",
              flex: 1,
              valueFormatter: (params) =>
                params.value ? formatter.date(params.value) : "",
            },
            {
              field: "intencion_de_pago",
              headerName: "Intencion de Pago",
              flex: 1,
              valueFormatter: (params) =>
                params.value ? formatter.date(params.value) : "",
            },
            { field: "forma_de_pago", headerName: "Metodo de Pago", flex: 0.8 },
            {
              field: "acciones",
              headerName: "Acciones",
              flex: 1,
              renderCell: (params) => (
                <>
                  <IconButton
                    size="small"
                    onClick={() => handleViewClick(params.row)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() =>
                      downloadPdfBoleta(
                        ID_EMPRESA,
                        params.row.declaracion_jurada_id,
                        params.row.codigo
                      )
                    }
                  >
                    <PrintIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleViewClick(params.row)}
                    disabled={!!params.row.fecha_de_pago}
                  >
                    <EditIcon />
                  </IconButton>
                </>
              ),
            },
          ]}
          getRowClassName={(params) =>
            boletasVisibles.indexOf(params.row) % 2 === 0 ? "even" : ""
          }
          pageSize={50}
          components={{
            Toolbar: () => (
              <GridToolbarContainer>
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarExport />
              </GridToolbarContainer>
            ),
          }}
          localeText={{
            toolbarColumns: "Columnas",
            toolbarFilters: "Filtros",
            toolbarExport: "Exportar",
          }}
        />
      </Box>
      <Box
        style={{ height: 400, width: "100%" }}
        sx={{
          width: "100%",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#1A76D2",
            color: "white",
          },
        }}
      >
        <h1>Boletas Sin DDJJ</h1>
        <DataGrid
          rows={boletasSinDDJJ}
          columns={[
            { field: "id", headerName: "Nro. Boleta", flex: 0.5 },
            {
              field: "entidad",
              headerName: "Entidad",
              flex: 0.8,
              valueFormatter: (params) =>
                params.value ? params.value.replace("-", "/") : "",
            },
            { field: "nroActa", headerName: "Nro. Acta", flex: 1 },
            {
              field: "importe",
              headerName: "Importe",
              align: "right",
              flex: 1,
              valueFormatter: (params) =>
                params.value ? formatter.currency.format(params.value) : "",
            },
            { field: "razon_de_pago", headerName: "Razon de pago", flex: 1 },
            {
              field: "acciones",
              headerName: "Acciones",
              flex: 0.5,
              renderCell: (params) => (
                <>
                  <IconButton
                    size="small"
                    onClick={() =>
                      downloadPdfBoletaBlanca(ID_EMPRESA, params.row.id)
                    }
                  >
                    <PrintIcon />
                  </IconButton>
                </>
              ),
            },
          ]}
          pageSize={50}
          components={{
            Toolbar: () => (
              <GridToolbarContainer>
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarExport />
              </GridToolbarContainer>
            ),
          }}
          localeText={{
            toolbarColumns: "Columnas",
            toolbarFilters: "Filtros",
            toolbarExport: "Exportar",
          }}
        />
      </Box>
    </div>
  );
};
