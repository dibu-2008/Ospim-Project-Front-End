import React, { useEffect, useState } from 'react';
import { TextField, Button, IconButton, Box } from '@mui/material';
import { Visibility as VisibilityIcon, Print as PrintIcon, Edit as EditIcon } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';  // Importa useNavigate
import { getBoletasByEmpresa, downloadPdfBoleta } from './BoletasApi';
import formatter from "@/common/formatter";
import './Boletas.css';


export const Boletas = () => {
  const ID_EMPRESA = JSON.parse(localStorage.getItem('stateLogin')).usuarioLogueado.empresa.id;
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [boletas, setBoletas] = useState([]);
  const [boletasVisibles, setBoletasVisibles] = useState([]);
  const navigate = useNavigate();  


  useEffect(() => {
    console.log()
    const fetchData = async () => {
      try {
        const response = await getBoletasByEmpresa(ID_EMPRESA);
        console.log(response)
        setBoletas(response.data);
        //setBoletasVisibles(response.data.flatMap((boleta) => boleta.detalle_boletas.map((boletaDetalle, index) => ({ ...boletaDetalle, id: `${boleta.id}-${index}` }))));
        setBoletasVisibles(response.data.flatMap((boleta) => ({ ...boleta, id: `${boleta.numero_boleta}` })));
        //setBoletasVisibles(response.data)
      } catch (error) {
        console.error('Error al obtener las boletas:', error);
      }
    };

    fetchData();
  }, []);

  const handleViewClick = (boletaDetalle) => {
    
    localStorage.setItem("boletaDetalle" , JSON.stringify(boletaDetalle))
    navigate('/dashboard/detalleboleta' );  
  };

  const handleSearch = () => {
    const filteredBoletas = boletas.filter((boleta) => {
      //const fecha = boleta.detalle_boletas[0].periodo;
      const fecha = boleta.periodo;
      const [mes, anio] = fecha.split('-');
      const timestamp = new Date(`${anio}-${mes}-01`);

      return timestamp >= new Date(fromDate) && timestamp <= new Date(toDate);
    });
    setBoletasVisibles(filteredBoletas.flatMap((boleta) => ({ ...boleta, id: `${boleta.numero_boleta}` })));
  };

  const handleExport = () => {
    // TODO implementar logica para exportar
    console.log('Exportar datos');
  };

  return (
    <div className='boletas_container'>
      {window.location.href.split('/').slice(3).join('/') === "dashboard/ddjj" || <h1>Boletas</h1>}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className='mb-4em'>
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
          <Button variant="contained" onClick={handleSearch}>Buscar</Button>
          <Button variant="contained" onClick={handleExport}>Exportar</Button>
        </div>
      </div>
      <Box style={{ height: 400, width: '100%' }} 
                sx={{
                  width: '100%',
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#1A76D2',
                    color:'white'
                  }}}>
        <DataGrid
          rows={boletasVisibles}
          columns={[
            { field: 'periodo', headerName: 'Periodo', flex: 1 },
            { field: 'tipo_declaracion', headerName: 'Tipo Declaración Jurada', flex: 1 },
            { field: 'numero_boleta', headerName: 'Número de Boleta', flex: 1 },
            { field: 'descripcion', headerName: 'Concepto', flex: 1 },
            { field: 'total_acumulado', headerName: 'Importe Boleta', flex: 1 },
            { field: 'intencion_de_pago', headerName: 'Fecha de Pago', flex: 1 },
            { field: 'bep', headerName: 'BEP', flex: 1 },
            {
              field: 'acciones',
              headerName: 'Acciones',
              flex: 1,
              renderCell: (params) => (
                <>
                  <IconButton size='small' onClick={() => handleViewClick(params.row)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton size='small' onClick={downloadPdfBoleta}>
                    <PrintIcon />
                  </IconButton>
                  <IconButton size='small'>
                    <EditIcon />
                  </IconButton>
                </>
              ),
            },
          ]}
          pageSize={10}
        />
      </Box>
    </div>
  );
};

