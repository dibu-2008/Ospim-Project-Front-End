import React, { useEffect, useState } from 'react';
import { Typography, TextField, Button, MenuItem, FormControl, InputLabel, Select, Box, Grid } from '@mui/material';
import { generarBoletaSinDDJJ, axiosOtrosPagos } from './OtrosPagosApi';

import "./OtrosPagos.css"


export const GenerarOtrosPagos = () => {
    
    const [intencionDePago, setIntencionDePago] = useState('');
    const [entidad, setEntidad] = useState('');
    const [razonPago, setRazonPago] = useState('');
    const [nroActa, setNroActa] = useState('');
    const [importe, setImporte] = useState('');
    const [conceptoUOMA, setConceptoUOMA] = useState('');
    const [periodo, setPeriodo] = useState('')
    const [rectificativa, setRectificativa] = useState(false)
    const [cuota, setCuota] = useState('')

    const ID_EMPRESA = JSON.parse(localStorage.getItem('stateLogin')).usuarioLogueado.empresa.id;
    

    
    const handleChangePeriodo = async (fecha) => {
        setPeriodo(fecha)
        const isRectificativa = await axiosOtrosPagos.tieneRectificativa(ID_EMPRESA, fecha)
        setRectificativa(isRectificativa.rectificativa)
    }

    const handleImprimir = () => {

        const body = {
            conceptoUOMA,
            intencionDePago,
            entidad,
            razonPago,
            nroActa,
            importe
            
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
                                value={conceptoUOMA}
                                onChange={(e) => setConceptoUOMA(e.target.value)}
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
                    {razonPago !== "Acuerdo de Pago" &&
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Cuota"
                            fullWidth
                            value={cuota}
                            onChange={(e) => setCuota(e.target.value)}
                        />
                    </Grid>}

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
                        disabled={ !periodo || !intencionDePago || !entidad || !razonPago || !importe } 
                        onClick={handleImprimir}>Imprimir</Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};
