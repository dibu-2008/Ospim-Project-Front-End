import React, { useEffect, useState } from 'react';
import './Boletas.css'
import { getBoletasByDDJJid, getBoletasByEmpresa } from './BoletasApi'
import { json } from 'react-router-dom';
import { TextField, Button, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';


export const Boletas = () => {
  const ID_EMPRESA = JSON.parse(localStorage.getItem('stateLogin')).usuarioLogueado.empresa.id;

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [boletas, setBoletas] = useState([]);
  const [boletasVisibles, setBoletasVisibles]  = useState([]);
 // const [expandedRow, setExpandedRow] = useState(null);
 // const [expandedDetail, setExpandedDetail] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getBoletasByEmpresa(ID_EMPRESA);
        setBoletas(response.data);
        setBoletasVisibles(response.data)
        console.log(boletas)
      } catch (error) {
        console.error('Error al obtener las boletas:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    const filteredBoletas = boletas.filter((boleta) => {
      const fecha = boleta.detalle_boletas[0].periodo;;
      const [mes, anio] = fecha.split('-');
      const timestamp = new Date(`${anio}-${mes}-01`);

      return timestamp >= new Date(fromDate) && timestamp <= new Date(toDate);
    });
    setBoletasVisibles(filteredBoletas);
  };

  const handleExport = () => {
    // Aquí puedes implementar la lógica para exportar los datos
    console.log('Exportar datos');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3>Periodo</h3>
          <TextField
            label="Desde"
            type="month"
            value={fromDate}
            onChange={(e) => setFromDate(new Date(e.target.value))}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Hasta"
            type="month"
            value={toDate}
            onChange={(e) => setToDate(new Date(e.target.value))}
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
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Periodo</TableCell>
            <TableCell>Tipo Declaración Jurada</TableCell>
            <TableCell>Número de Boleta</TableCell>
            <TableCell>Concepto</TableCell>
            <TableCell>Importe Boleta</TableCell>
            <TableCell>Fecha de Pago</TableCell>
            <TableCell>BEP</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {boletasVisibles.map((boletas) => (
            boletas.detalle_boletas.map(boleta =>(
              <TableRow key={boleta.id + boleta.codigo}>
              <TableCell>{boleta.periodo}</TableCell>
              <TableCell>Original</TableCell>
              <TableCell>{boleta.id}</TableCell>
              <TableCell>{boleta.descripcion}</TableCell>
              <TableCell>{boleta.total_acumulado}</TableCell>
              <TableCell>{boleta.intencion_de_pago}</TableCell>
              <TableCell>Número de BEP</TableCell>
              <TableCell>
                <Button variant="contained">Editar</Button>
                <Button variant="contained">Eliminar</Button>
                <Button variant="contained">Detalles</Button>
              </TableCell>
            </TableRow>
            ))

          ))}
        </TableBody>
      </Table>
    </div>
  );

}
