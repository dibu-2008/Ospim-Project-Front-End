import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
  Grid,
} from '@mui/material';
import { generarBoletaSinDDJJ } from './OtrosPagosApi';
import { getEmpresaId } from '@/components/localStorage/localStorageService'
import './OtrosPagos.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const GenerarOtrosPagos = () => {
  const [intencionDePago, setIntencionDePago] = useState('');
  const [entidad, setEntidad] = useState('');
  const [nroActa, setNroActa] = useState('');
  const [importe, setImporte] = useState('');
  const [deshabilitar, setDeshabilitar] = useState(false);
  const navigate = useNavigate();

  const ID_EMPRESA = getEmpresaId();
  
  const hoy = new Date().toISOString().split('T')[0];

  const handleImprimir = async () => {

    const body = {
      entidad,
      nroActa,
      importe,
      intencionDePago: new Date(`${intencionDePago}`).toISOString(),
      razon_de_pago: 'Nro Acta: ' + nroActa,
    };
    try {
      setDeshabilitar(true);
      await generarBoletaSinDDJJ(ID_EMPRESA, body).then(() => {
        toast.success('Boleta generada con exito', {
          onClose: () => {
            navigate('/dashboard/boletas')
          },
        });
      });
    } catch (error) {
      console.error(error);
      toast.error('Ocurrio un problema al intentar generar la boleta');
      navigate('/dashboard/boletas')
    }

  };

  return (
    <div className="otros_pagos_container">
      <h1>
        Boleta Acta
      </h1>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Fecha intención de Pago"
            type="date"
            fullWidth
            value={intencionDePago}
            inputProps={{ min: hoy }}
            onChange={(e) => setIntencionDePago(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Entidad</InputLabel>
            <Select
              value={entidad}
              onChange={(e) => setEntidad(e.target.value)}
            >
              <MenuItem value="UOMA">UOMA</MenuItem>
              <MenuItem value="OSPIM">OSPIM</MenuItem>
              <MenuItem value="AMTIMA">AMTIMA</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Nro Acta"
            fullWidth
            type="number"
            value={nroActa}
            onChange={(e) => setNroActa(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Importe"
            type="number"
            fullWidth
            value={importe}
            onChange={(e) => setImporte(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              disabled={
                !intencionDePago ||
                !entidad ||
                !importe ||
                !nroActa ||
                deshabilitar
              }
              onClick={handleImprimir}
            >
              Imprimir
            </Button>
          </Box>
        </Grid>
      </Grid>
      <ToastContainer />
    </div>
  );
};
