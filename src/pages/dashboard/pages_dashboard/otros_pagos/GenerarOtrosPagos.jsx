import React, { useState } from 'react';
import { Typography, TextField, Button, MenuItem, FormControl, InputLabel, Select, Box, Grid } from '@mui/material';
import { generarBoletaSinDDJJ, tieneRectificativa } from './OtrosPagosApi';
import "./OtrosPagos.css"


export const GenerarOtrosPagos = () => {
    const formatDate = (date) => date.toISOString().slice(0, 19).replace('T', ' ');
    const [fechaPago, setFechaPago] = useState('');
    const [entidad, setEntidad] = useState('');
    const [razonPago, setRazonPago] = useState('');
    const [nroActa, setNroActa] = useState('');
    const [descripcionPago, setDescripcionPago] = useState('');
    const [importe, setImporte] = useState('');
    const [tipoPagoUOMA, setTipoPagoUOMA] = useState('');
    const [periodo, setPeriodo] = useState('')
    const [rectificativa, setRectificativa] = useState(false)
    const fecha_alta = formatDate(new Date()) 
    const ID_EMPRESA = JSON.parse(localStorage.getItem('stateLogin')).usuarioLogueado.empresa.id;
    
    const handleChangePeriodo = (fecha) => {
        setPeriodo(fecha)
        tieneRectificativa(ID_EMPRESA, fecha).then( result => setRectificativa(result.data.rectificativa))
    }

    const handleGuardar = () => {
        const body = {
            fecha_alta,
            fechaPago,
            entidad,
            razonPago,
            nroActa,
            descripcionPago,
            importe,
            tipoPagoUOMA
        }
        generarBoletaSinDDJJ(ID_EMPRESA, body)
        
        console.log();
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
                        onChange={(e) => handleChangePeriodo(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Fecha de Pago"
                        type="date"
                        fullWidth
                        value={fechaPago}
                        onChange={(e) => setFechaPago(e.target.value)}
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
                            <MenuItem value="ART46">ART46</MenuItem>
                            <MenuItem value="AMTIMA">AMTIMA</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                        <InputLabel>Razón de Pago</InputLabel>
                        <Select
                            value={razonPago}
                            onChange={(e) => setRazonPago(e.target.value)}
                        >
                            <MenuItem value="Acta">Acta</MenuItem>
                            {rectificativa && <MenuItem value="Rectificativa">Rectificativa</MenuItem>}
                            <MenuItem value="Acuerdo de Pago">Acuerdo de Pago</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                {entidad === "UOMA" && (
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Tipo de Pago UOMA</InputLabel>
                            <Select
                                value={tipoPagoUOMA}
                                onChange={(e) => setTipoPagoUOMA(e.target.value)}
                            >
                                <MenuItem value="Cuota Social">Cuota Social</MenuItem>
                                <MenuItem value="Solidario">Solidario</MenuItem>
                                <MenuItem value="Usufructo">Usufructo</MenuItem>
                                <MenuItem value="Art.46">Art.46</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                )}
                {razonPago !== "Rectificativa" &&
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Nro Acta"
                            fullWidth
                            value={nroActa}
                            onChange={(e) => setNroActa(e.target.value)}
                        />
                    </Grid>}
                <Grid item xs={12}>
                    <TextField
                        label="Descripción del Pago"
                        multiline
                        rows={4}
                        fullWidth
                        value={descripcionPago}
                        onChange={(e) => setDescripcionPago(e.target.value)}
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
                        <Button variant="contained" onClick={handleGuardar}>Guardar</Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};
