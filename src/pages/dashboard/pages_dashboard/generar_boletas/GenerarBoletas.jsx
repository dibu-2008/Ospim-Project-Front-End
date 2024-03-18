import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Paper, Button, MenuItem, Select, Box } from '@mui/material';
import { axiosGenerarBoletas } from './GenerarBoletasApi';
import "./GenerarBoletas.css";
import formatter from "@/common/formatter";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';  
//import { Boletas } from '../boletas/Boletas';

export const GenerarBoletas = () => {
    const { id } = useParams();

    const DDJJ_ID = id
    const ID_EMPRESA = JSON.parse(localStorage.getItem('stateLogin')).usuarioLogueado.empresa.id;

    const [ boletas, setBoletas ] = useState({});
    const [ showDetail, setShowDetail ] = useState(false);
    const [ afiliados, setAfiliados ] = useState([]);
    const [ primeraSeleccion, setPrimeraSeleccion ] = useState(true)
    const [ primeraSeleccionFDP, setPrimeraSeleccionFDP ] = useState(true)
    const [ habilitaBoton, sethabilitaBoton ] = useState(true)
    const [ selectedFDP, setSelectedFDP ] = useState({}) // esto tengo que revisar si sigue siendo necesario
    const navigate = useNavigate();  

    useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await axiosGenerarBoletas.getBoletasByDDJJid(ID_EMPRESA,DDJJ_ID);
            setDefaultFDP(data)
            
            setAfiliados(ordenarAfiliadosBoletas(data));
            setPrimeraSeleccion(true)
            setPrimeraSeleccionFDP(true)
            sethabilitaBoton(true)
          } catch (error) {
            console.error('Error al obtener las boletas:', error);
            navigate(`/dashboard/ddjj`);
          }
        };
    
        fetchData();
      }, []);
    
    const setDefaultFDP = (data) => {
        data.detalle_boletas.forEach(element => element.forma_de_pago = "Ventanilla" )
        setBoletas(data)
    }

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
        const fdp  = newDetalleBoletas[boletaIndex].forma_de_pago
        newDetalleBoletas[boletaIndex] = response.data;
        newDetalleBoletas[boletaIndex].forma_de_pago = fdp
        setBoletas({ ...boletas, detalle_boletas: newDetalleBoletas });
    }

    const checkFields = () => {        
        boletas.detalle_boletas.forEach(boleta =>{
            if (boleta.intencion_de_pago === '') return true    
        })
        return false
    }
    
    const setIntencionDePago = async  (codigo, fecha) => {
        if (primeraSeleccion) {
            setPrimeraSeleccion(false);
            const response = await axiosGenerarBoletas.calcularInteresBoletas(123, DDJJ_ID, fecha)
            const updatedDetalleBoletas = response.data.map((boleta) => {
                const prevBoleta = boletas.detalle_boletas.find((prevBoleta) => prevBoleta.codigo === boleta.codigo);
                return { ...boleta, forma_de_pago: prevBoleta ? prevBoleta.forma_de_pago : 'Ventanilla' };
            });
            setBoletas((prevBoletas) => ({ ...prevBoletas, detalle_boletas: updatedDetalleBoletas }));
            sethabilitaBoton(checkFields());
        } else {
            const boletaIndex = boletas.detalle_boletas.findIndex(element => element.codigo === codigo);
            const response = await axiosGenerarBoletas.calcularInteresBoleta(123, DDJJ_ID, codigo, fecha);
            setInteresInDetalleBoleta(boletaIndex, response);
            sethabilitaBoton(false);
        }
    };

   const setFormaDePagoInBoleta = (boletaIndex, forma_de_pago) => {
        const newDetalleBoletas = [...boletas.detalle_boletas];
        newDetalleBoletas[boletaIndex] = { ...newDetalleBoletas[boletaIndex], forma_de_pago };
        setBoletas({ ...boletas, detalle_boletas: newDetalleBoletas });
    }

    const setFormaDePago = (codigo, value) => {
        if (primeraSeleccionFDP){
            //setSelectedFDP(prevState => ({ ...prevState, [codigo]:value}))
            const newDetalleBoletas = boletas.detalle_boletas.map(boleta => ({ ...boleta, forma_de_pago: value }));
            setBoletas({ ...boletas, detalle_boletas: newDetalleBoletas });
            setPrimeraSeleccionFDP(false)
        } else {
            const boletaIndex = boletas.detalle_boletas.findIndex(element => element.codigo === codigo)
            setFormaDePagoInBoleta(boletaIndex, value)
        }
    }

    const toggleDetail = () => setShowDetail(!showDetail);

    const generarBoletas = async () => await axiosGenerarBoletas.generarBoletasPost(ID_EMPRESA, DDJJ_ID, boletas)
    
    const hoy =new Date().toISOString().split('T')[0]
    
    return (
        <div className='generador_boletas_container'>
            <h1>Boleta de Pago</h1>
            <p>Periodo: { boletas && boletas.periodo  ? boletas.periodo.replace('-','/'): ''} </p>
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
                                <TableCell  key={boleta.codigo}>{formatter.date(boleta.vencimiento)}</TableCell>
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
                                <TableCell key={boleta.codigo} >
                                    <Select value={boleta.forma_de_pago || ''} onChange={event=> setFormaDePago(boleta.codigo, event.target.value)}>
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
                                <TableCell key={boleta.codigo}>{formatter.currency.format(boleta.total_acumulado) }</TableCell>
                            ))}
                        </TableRow>
                        <TableRow>
                            <TableCell className='cwbcb'>Interes</TableCell>
                            {boletas.detalle_boletas && boletas.detalle_boletas.map((boleta) => (
                                <TableCell key={boleta.codigo}>{formatter.currency.format(boleta.interes)}</TableCell>
                            ))}
                        </TableRow>
                        <TableRow>
                            <TableCell className='cwbcb' style={{width:'24.5em'}}>Ajustes</TableCell>
                            {boletas.detalle_boletas && boletas.detalle_boletas.map((boleta) => (
                                <TableCell style={{width:'27.5em'}} key={boleta.codigo}>{formatter.currency.format(boleta.ajuste)}</TableCell>
                            ))}
                        </TableRow>
                        <TableRow>
                            <TableCell className='cwbcb' >Total Final</TableCell>
                            {boletas.detalle_boletas && boletas.detalle_boletas.map((boleta) => (
                                <TableCell key={boleta.codigo} style={{ backgroundColor: 'lightblue' }}>{formatter.currency.format(boleta.total_final)}</TableCell>
                            ))}
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <Box display="flex" justifyContent="flex-end" paddingTop="5em">
                <Button variant="contained" onClick={()=> generarBoletas()} color="primary" disabled={habilitaBoton}>
                    Generar
                </Button>
            </Box>
        </div>
    );
    
};