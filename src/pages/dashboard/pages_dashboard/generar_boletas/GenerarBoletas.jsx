import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, MenuItem, Select, Box } from '@mui/material';
import { calcularInteres, generarBoletasPost, getBoletasByDDJJid } from './GenerarBoletasApi';
//import { Margin } from '@mui/icons-material';
//import { width } from '@mui/system';

export const GenerarBoletas = () => {
    const DDJJ_ID = 5048119
    const ID_EMPRESA = JSON.parse(localStorage.getItem('stateLogin')).usuarioLogueado.empresa.id;

    const [boletas, setBoletas] = useState({});
    const [showDetail, setShowDetail] = useState(false);
    const [afiliados, setAfiliados] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await getBoletasByDDJJid(ID_EMPRESA,DDJJ_ID);
            setBoletas(response.data);
            setAfiliados(ordenarAfiliadosBoletas(response.data))
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
        console.log(afiliadosArray)
        return afiliadosArray
    } 

    const setIntencionDePago = (codigo, fecha) =>{
        console.log(codigo)
        console.log(fecha)
        const boletaIndex = boletas.detalle_boletas.findIndex(element => element.codigo === codigo);
    
        calcularInteres(123, DDJJ_ID, codigo, fecha).then(response => {
            const newDetalleBoletas = [...boletas.detalle_boletas]; 
            console.log(response.data)
            newDetalleBoletas[boletaIndex] = response.data; 
            
            console.log(response.data)
            
            setBoletas({
                ...boletas,
                detalle_boletas: newDetalleBoletas
            });
            console.log(boletas)
        });
        
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
    
    return (
        <div>
            <h2>Boleta de Pago</h2>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            {boletas.detalle_boletas && boletas.detalle_boletas.map((boleta) => (
                                <TableCell key={boleta.codigo}>{boleta.descripcion}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>Vencimiento</TableCell>
                            {boletas.detalle_boletas && boletas.detalle_boletas.map((boleta) => (
                                <TableCell key={boleta.codigo}>{boleta.vencimiento}</TableCell>
                            ))}
                        </TableRow>
                        <TableRow>
                            <TableCell>Intención de Pago</TableCell>
                            {boletas.detalle_boletas && boletas.detalle_boletas.map((boleta) => (
                                <TableCell key={boleta.codigo}>
                                    <input type="date" 
                                    defaultValue={boleta.intencion_de_pago?boleta.intencion_de_pago: ''} 
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
                                        <MenuItem value="BEP">BEP</MenuItem>
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
                            <TableCell style={{ width: '5em' }}>CUIL</TableCell>
                            <TableCell style={{ width: '5em' }}>Apellido</TableCell>
                            <TableCell style={{ width: '12em' }}>Remunerativo</TableCell>
                            
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
                            <TableCell>Total Acumulado</TableCell>
                            {boletas.detalle_boletas && boletas.detalle_boletas.map((boleta) => (
                                <TableCell key={boleta.codigo}>{boleta.total_acumulado}</TableCell>
                            ))}
                        </TableRow>
                        <TableRow>
                            <TableCell>Interes</TableCell>
                            {boletas.detalle_boletas && boletas.detalle_boletas.map((boleta) => (
                                <TableCell key={boleta.codigo}>{boleta.interes}</TableCell>
                            ))}
                        </TableRow>
                        <TableRow>
                            <TableCell style={{width:'24.5em'}}>Ajustes</TableCell>
                            {boletas.detalle_boletas && boletas.detalle_boletas.map((boleta) => (
                                <TableCell style={{width:'27.5em'}} key={boleta.codigo}>{boleta.ajuste}</TableCell>
                            ))}
                        </TableRow>
                        <TableRow>
                            <TableCell style={{ backgroundColor: 'lightblue' }}>Total Final</TableCell>
                            {boletas.detalle_boletas && boletas.detalle_boletas.map((boleta) => (
                                <TableCell key={boleta.codigo} style={{ backgroundColor: 'lightblue' }}>{boleta.total_acumulado}</TableCell>
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