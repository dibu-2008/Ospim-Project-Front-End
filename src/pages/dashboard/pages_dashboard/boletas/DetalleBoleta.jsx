import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import "./Boletas.css"
import { Box } from '@mui/system';
import { downloadPdfDetalle, downloadPdfBoleta } from './BoletasApi';

const COLUMNS_AFILIADOS = [
  { field: 'cuil', headerName: 'CUIL', width: 200 },
  { field: 'apellido', headerName: 'Apellido', width: 200 },
  { field: 'nombre', headerName: 'Nombre', width: 200 },
  { field: 'remunerativo', headerName: 'Remunerativo', width: 200 },
  { field: 'capital', headerName: 'Capital', width: 200 },
];

export const DetalleBoleta = () => {
  const boletaDetalle = JSON.parse(localStorage.getItem('boletaDetalle'));

  const afiliadosRows = boletaDetalle.afiliados.map((afiliado, index) => ({
    ...afiliado,
    id: index + 1,
  }));
  console.log(afiliadosRows)


  const existeDato = dato => dato ? dato: ''
  return (
      <div className='boletas_container'>
        <h1>Detalle boleta {boletaDetalle.descripcion}</h1>
        <Button onClick={downloadPdfDetalle}>
          Descargar Detalle
        </Button>
        <Button onClick={downloadPdfBoleta}>
          Descargar Boleta
        </Button>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead className='titulos'>
              <TableRow>
                <TableCell className='cw'>Periodo</TableCell>
                <TableCell className='cw'>Tipo DDJJ</TableCell>
                <TableCell className='cw'>N Boleta</TableCell>
                <TableCell className='cw'>Concepto</TableCell>
                <TableCell className='cw'>Importe boleta</TableCell>
                <TableCell className='cw'>Intereses</TableCell>
                <TableCell className='cw'>Fecha de Pago</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow key={boletaDetalle.descripcion}>
                <TableCell>{existeDato(boletaDetalle.periodo)}</TableCell>
                <TableCell>{boletaDetalle.tipo_ddjj? boletaDetalle.tipo_ddjj : 'Original'}</TableCell>
                <TableCell>{boletaDetalle.nro_boleta? boletaDetalle.nro_boleta : 1}</TableCell>
                <TableCell>{existeDato(boletaDetalle.descripcion)}</TableCell>
                <TableCell>{existeDato(boletaDetalle.total_acumulado)}</TableCell>
                <TableCell>{existeDato(boletaDetalle.interes)}</TableCell>
                <TableCell>{existeDato(boletaDetalle.intencion_de_pago)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          sx={{
              width: '100%',
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#1A76D2',
                color:'white'
              },
            }}
          >
          <div style={{ height: 300, width: '100%' }}>
            <DataGrid
              rows={afiliadosRows}
              columns={COLUMNS_AFILIADOS}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              disableSelectionOnClick
            />
          </div>
        </Box>
        <TableContainer>
          <Table  sx={{ maxWidth: 200 }}>
            <TableBody>
              <TableRow>
                <TableCell>
                  Subtotal
                </TableCell>
                <TableCell>
                  {existeDato(boletaDetalle.total_acumulado) - existeDato(boletaDetalle.interes)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  Interes
                </TableCell>
                <TableCell>
                  {boletaDetalle.interes? boletaDetalle.interes : 0 }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  Ajustes
                </TableCell>
                <TableCell>
                  {boletaDetalle.ajuste? boletaDetalle.ajuste : 0}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  Total Final
                </TableCell>
                <TableCell>
                  {existeDato(boletaDetalle.total_final)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

      </div>
  );
};
