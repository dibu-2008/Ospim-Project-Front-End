import React, { useEffect, useState } from 'react';
import { Typography, TextField, Button, MenuItem, FormControl, InputLabel, Select, Box, Grid } from '@mui/material';
import { downloadPdfBoletaBlanca, axiosOtrosPagos } from './OtrosPagosApi';
import formatter from "@/common/formatter";
import "./OtrosPagos.css"


export const GenerarOtrosPagos = () => {
    
    const [intencionDePago, setIntencionDePago] = useState('');
    const [entidad, setEntidad] = useState('');
    const [nroActa, setNroActa] = useState('');
    const [importe, setImporte] = useState('');
    const [periodo, setPeriodo] = useState('');
    
    const ID_EMPRESA = JSON.parse(localStorage.getItem('stateLogin')).usuarioLogueado.empresa.id;


    const handleImprimir = () => {
        const body = {
            entidad,
            periodo,
            nroActa,
            importe,
            razon_de_pago: 'Nro Acta: ' + nroActa 
        }
        downloadPdfBoletaBlanca(ID_EMPRESA)
        console.log(body);
    };

    return (
        <Box p={3} className="otros_pagos_container">
            <Typography variant="h1" gutterBottom>Boleta</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Periodo"
                        type="month"
                        fullWidth
                        value={periodo}
                        onChange={(e) => setPeriodo(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Fecha intension de Pago"
                        type="date"
                        fullWidth
                        value={intencionDePago}
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
                        type='number'
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
                        disabled={ !periodo || !intencionDePago || !entidad || !importe } 
                        onClick={handleImprimir}>Imprimir</Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};
