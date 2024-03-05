import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Paper, Button, MenuItem, Select, Box } from '@mui/material';
import { calcularInteresBoleta,calcularInteresBoletas, generarBoletasPost, getBoletasByDDJJid } from './GenerarBoletasApi';
import "./GenerarBoletas.css";
//import { Margin } from '@mui/icons-material';
//import { width } from '@mui/system';

export const GenerarBoletas = () => {
    const DDJJ_ID = 5048119
    const ID_EMPRESA = JSON.parse(localStorage.getItem('stateLogin')).usuarioLogueado.empresa.id;

    const [boletas, setBoletas] = useState({});
    const [showDetail, setShowDetail] = useState(false);
    const [afiliados, setAfiliados] = useState([]);
    const [primeraSeleccion, setPrimeraSeleccion] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await getBoletasByDDJJid(ID_EMPRESA,DDJJ_ID);
            setBoletas(response.data);
            setAfiliados(ordenarAfiliadosBoletas(response.data));
          } catch (error) {
            console.error('Error al obtener las boletas:', error);
          }

        };
    
        fetchData();
      }, []);
    
    const ordenarAfiliadosBoletas = (boletas) =>{
        const afiliados = {};

        boletas.detalle_boletas.forEach(boleta => {
            boleta.afiliados.forEach(afiliado => {
                const cuil = afiliado.cuil;
                if (!afiliados[cuil]) {
                    afiliados[cuil] = {
                        apellido: afiliado.apellido,
                        boletas: Array(boletas.detalle_boletas.length).fill(0),
                        cuil: cuil,
                        nombre: afiliado.nombre,
                        remunerativo: afiliado.remunerativo
                    };
                }
                const index = boletas.detalle_boletas.findIndex(detalle => detalle.codigo === boleta.codigo);
                afiliados[cuil].boletas[index] = afiliado.capital;
            });
        });
        const afiliadosArray = Object.values(afiliados);
        return afiliadosArray
    } 

    const setInteresInDetalleBoleta = (boletaIndex, response) => {
        const newDetalleBoletas = [...boletas.detalle_boletas];
        newDetalleBoletas[boletaIndex] = response.data;
        setBoletas({ ...boletas, detalle_boletas: newDetalleBoletas });
        console.log(boletas)
    }
    
    const setIntencionDePago = (codigo, fecha) => {
        if (primeraSeleccion) {
            setPrimeraSeleccion(false);
            calcularInteresBoletas(123, DDJJ_ID, fecha).then(response => {
                setBoletas(prevBoletas => ({ ...prevBoletas, detalle_boletas: response.data }));
            });

        } else {
            const boletaIndex = boletas.detalle_boletas.findIndex(element => element.codigo === codigo);
            calcularInteresBoleta(123, DDJJ_ID, codigo, fecha).then(response => {
                setInteresInDetalleBoleta(boletaIndex, response);
            });
        }
    }

    const toggleDetail = () => setShowDetail(!showDetail);

    const generarBoletas = async () => {
        try {
            const response = await generarBoletasPost(ID_EMPRESA, DDJJ_ID, boletas);
            if (response.status === 201) {
                window.location.href = "/dashboard/boletas";
            } else {
                console.error("Error al generar boletas");
            }
        } catch (error) {
            console.error("Error al generar boletas:", error);
        }
    }
    const hoy =new Date().toISOString().split('T')[0]
    
    return (
        <div className='generador_boletas_container'>
            <h1>Boleta de Pago</h1>
            <p>Periodo: {boletas ? boletas.periodo : ''} </p>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell className='cwbcb'></TableCell>
                            {boletas.detalle_boletas && boletas.detalle_boletas.map((boleta) => (
                                <TableCell className='cwbcb' key={boleta.codigo}>{boleta.descripcion}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>Vencimiento</TableCell>
                            {boletas.detalle_boletas && boletas.detalle_boletas.map((boleta) => (
                                <TableCell  key={boleta.codigo}>{boleta.vencimiento}</TableCell>
                            ))}
                        </TableRow>
                        <TableRow>
                            <TableCell>Intención de Pago</TableCell>
                            {boletas.detalle_boletas && boletas.detalle_boletas.map((boleta) => (
                                <TableCell key={boleta.codigo}>
                                    <TextField type="date" 
                                    inputProps={{min:hoy}}
                                    value={boleta.intencion_de_pago}
                                    onChange={event => setIntencionDePago(boleta.codigo, event.target.value)}/>
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow>
                            <TableCell>Forma de Pago</TableCell>
                            {boletas.detalle_boletas && boletas.detalle_boletas.map((boleta) => (
                                <TableCell key={boleta.codigo}>
                                    <Select defaultValue="Ventanilla">
                                        <MenuItem value="Ventanilla">Ventanilla</MenuItem>
                                        <MenuItem value="Red Link">Red Link</MenuItem>
                                        <MenuItem value="PagoMisCuentas">PagoMisCuentas</MenuItem>
                                    </Select>
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow style={{ marginTop: '2em' }}>
                            <TableCell colSpan={boletas.detalle_boletas ? boletas.detalle_boletas.length + 1 : 1}>
                                <Button onClick={() => toggleDetail(boletas.detalle_boletas)}>Mostrar detalle de afiliados</Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            {showDetail && (
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell className='cwbcb' style={{ width: '5em' }}>CUIL</TableCell>
                            <TableCell className='cwbcb' style={{ width: '5em' }}>Apellido</TableCell>
                            <TableCell className='cwbcb' style={{ width: '12em' }}>Remunerativo</TableCell>
                            {boletas.detalle_boletas && boletas.detalle_boletas.map((boleta) => (
                                <TableCell className='cwbcb' key={boleta.codigo}>{boleta.descripcion}</TableCell>
                            ))}
                            
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {afiliados.map((afiliado, index) => (
                            <TableRow key={index}>
                                <TableCell>{afiliado.cuil}</TableCell>
                                <TableCell>{afiliado.apellido}</TableCell>
                                <TableCell>{afiliado.remunerativo}</TableCell>
                                {afiliado.boletas.map((boleta, boletaIndex) => (
                                    <TableCell key={boletaIndex}>{boleta}</TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )}

            <TableContainer component={Paper} style={{marginTop:'3em'}}>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell className='cwbcb'>Total Acumulado</TableCell>
                            {boletas.detalle_boletas && boletas.detalle_boletas.map((boleta) => (
                                <TableCell key={boleta.codigo}>{boleta.total_acumulado}</TableCell>
                            ))}
                        </TableRow>
                        <TableRow>
                            <TableCell className='cwbcb'>Interes</TableCell>
                            {boletas.detalle_boletas && boletas.detalle_boletas.map((boleta) => (
                                <TableCell key={boleta.codigo}>{boleta.interes}</TableCell>
                            ))}
                        </TableRow>
                        <TableRow>
                            <TableCell className='cwbcb' style={{width:'24.5em'}}>Ajustes</TableCell>
                            {boletas.detalle_boletas && boletas.detalle_boletas.map((boleta) => (
                                <TableCell style={{width:'27.5em'}} key={boleta.codigo}>{boleta.ajuste}</TableCell>
                            ))}
                        </TableRow>
                        <TableRow>
                            <TableCell className='cwbcb' >Total Final</TableCell>
                            {boletas.detalle_boletas && boletas.detalle_boletas.map((boleta) => (
                                <TableCell key={boleta.codigo} style={{ backgroundColor: 'lightblue' }}>{boleta.total_final}</TableCell>
                            ))}
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <Box display="flex" justifyContent="flex-end" paddingTop="5em">
                <Button variant="contained" onClick={()=> generarBoletas()} color="primary">
                    Generar
                </Button>
            </Box>
        </div>
    );
    
};