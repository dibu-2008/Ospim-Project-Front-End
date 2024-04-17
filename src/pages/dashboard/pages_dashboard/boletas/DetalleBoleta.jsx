import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, TextField } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import "./Boletas.css"
import { Box } from '@mui/system';
import { downloadPdfDetalle, downloadPdfBoleta, getBoletaById, modificarBoletaById } from './BoletasApi';
import formatter from "@/common/formatter";
import { useParams } from 'react-router-dom';
import { calcularInteresBoleta } from '../generar_boletas/GenerarBoletasApi';


export const DetalleBoleta = () => {

  //const boletaDetalle = JSON.parse(localStorage.getItem('boletaDetalle'));
  const [ boletaDetalle, setBoletaDetalle ] = useState([])
  const [ afiliadosRows, setAfiliadosRows ] = useState([])
  const [ isEditable, setIsEditable ] = useState(true)
  const [ metodoPago, setMetodoPago ] = useState('')
  const [ intencionDePago, setIntencionDePago] = useState('')
  const [ ddjj_id, setDDDJJ_id ] = useState('')
  const [ codigo, setCodigo ] = useState('')
  const [ modoEdicion, setModoEdicion] = useState(false)
  const [ respaldoBoleta, setRespaldoBoleta] = useState([])
  const [ajustes, setAjustes] = useState([])

  const ID_EMPRESA = JSON.parse(localStorage.getItem('stateLogin')).usuarioLogueado.empresa.id;
  const { numero_boleta } = useParams()
  console.log(numero_boleta)
  const hoy =new Date().toISOString().split('T')[0]
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getBoletaById(ID_EMPRESA, numero_boleta);
        console.log(response)
        setBoletaDetalle(response.data);
        setAfiliadosRows(
          response.data.afiliados.map((afiliado, index) => ({
            ...afiliado,
            id: index + 1,
          }))
        );
        setMetodoPago(response.data.forma_de_pago)
        setIntencionDePago(response.data.intencion_de_pago)
        setDDDJJ_id(response.data.declaracion_jurada_id)
        setCodigo(response.data.codigo)
        setIsEditable(!response.data.fecha_de_pago)
        setAjustes(response.data.ajustes)
        setRespaldoBoleta(JSON.parse(JSON.stringify(response.data)))

      } catch (error) {
        console.error('Error al obtener los datos de la boleta:', error);
      }
    };
    fetchData();
  }, []);

  const guardarBoleta = () => {
    modificarBoletaById(ID_EMPRESA, numero_boleta, boletaDetalle)
  }

  const handlesSetIntencionDePago = async (value) =>{
    setIntencionDePago(value)
    const response = await calcularInteresBoleta(ID_EMPRESA,ddjj_id,codigo,value)
    // Realizar la copia superficial del objeto original
    let objetoModificado = { ...boletaDetalle };

    // Recorrer las claves del objeto a cambiar y asignar sus valores al objeto modificado
    for (let key in response.data) {
      if (response.data.hasOwnProperty(key)) {
        objetoModificado[key] = response.data[key];
      }
    }
    setBoletaDetalle(objetoModificado)
  }


  const handleSetMetodoPago = async (value) =>{
    setMetodoPago(value)
    const nuevaBoleta = JSON.parse(JSON.stringify(boletaDetalle))
    nuevaBoleta.forma_de_pago = value
    setBoletaDetalle(nuevaBoleta)
  }

  const handleGuardar = () => {
    guardarBoleta()
    setModoEdicion(!modoEdicion)
  }

  const handleCancelar = () => {
    setBoletaDetalle( respaldoBoleta)
    setIntencionDePago( respaldoBoleta.intencion_de_pago)
    setMetodoPago(respaldoBoleta.forma_de_pago)
    setModoEdicion(!modoEdicion)
  }

  const existeDato = dato => dato ? dato: ''
  return (
      <div className='boletas_container'>
        <h1>Detalle boleta {boletaDetalle.descripcion}</h1>
        <Button onClick={downloadPdfDetalle}>
          Descargar Detalle
        </Button>
        <Button onClick={() => downloadPdfBoleta(ID_EMPRESA, boletaDetalle.declaracion_jurada_id, boletaDetalle.codigo)}>
          Descargar Boleta
        </Button>
        {(isEditable && !modoEdicion) && <Button variant="contained" onClick={()=> setModoEdicion(!modoEdicion)} color="primary" >
          Editar
       </Button>}
       {(isEditable && modoEdicion) && <Button variant="contained" onClick={()=> {handleGuardar()}} color="primary" >
          Guardar
       </Button>}
        {(isEditable && modoEdicion) && <Button variant="contained" onClick={()=> {handleCancelar()} } color="primary" >
          Canclear
       </Button>}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead className='titulos'>
              <TableRow>
                <TableCell className='cw'>Periodo</TableCell>
                <TableCell className='cw'>Tipo DDJJ</TableCell>
                <TableCell className='cw'>N Boleta</TableCell>
                <TableCell className='cw'>Concepto</TableCell>
                <TableCell className='cw'>Subtotal</TableCell>
                <TableCell className='cw'>Intereses</TableCell>
                <TableCell className='cw'>Importe Boleta</TableCell>
                {boletaDetalle.importe_recibido && <TableCell className='cw'>Importe Recibido</TableCell>}
                {boletaDetalle.fecha_de_pago && <TableCell className='cw'>Fecha de Pago</TableCell>}
                <TableCell className='cw'>Intencion de Pago</TableCell>
                <TableCell className='cw'>Metodo de Pago</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow key={boletaDetalle.descripcion}>
                <TableCell>{existeDato(boletaDetalle.periodo)?formatter.periodo(boletaDetalle.periodo):""}</TableCell>
                <TableCell>{boletaDetalle.tipo_ddjj? boletaDetalle.tipo_ddjj : 'Original'}</TableCell>
                <TableCell>{boletaDetalle.nro_boleta? boletaDetalle.nro_boleta : 1}</TableCell>
                <TableCell>{existeDato(boletaDetalle.descripcion)}</TableCell>
                <TableCell>{existeDato(formatter.currency.format(boletaDetalle.total_acumulado))}</TableCell>
                <TableCell>{existeDato(formatter.currency.format(boletaDetalle.interes))}</TableCell>
                <TableCell>{existeDato(formatter.currency.format(boletaDetalle.total_acumulado + boletaDetalle.interes))}</TableCell>
                {boletaDetalle.importe_recibido && <TableCell>{existeDato(formatter.currency.format(boletaDetalle.importe_recibido))}</TableCell>}
                {boletaDetalle.fecha_de_pago && <TableCell>{existeDato(formatter.date(boletaDetalle.fecha_de_pago))}</TableCell>}
                <TableCell>{isEditable && modoEdicion?
                  (<TextField type="date"
                  inputProps={{min:hoy}}
                  value={intencionDePago}
                  onChange={event => handlesSetIntencionDePago(event.target.value)}/>)
                  :existeDato(formatter.date(boletaDetalle.intencion_de_pago))}
                </TableCell>
                <TableCell>
                  {isEditable && modoEdicion ? (
                    <Select value={metodoPago} onChange={event => handleSetMetodoPago(event.target.value)}>
                      <MenuItem value="Ventanilla">Ventanilla</MenuItem>
                      <MenuItem value="Red Link">Red Link</MenuItem>
                      <MenuItem value="PagoMisCuentas">PagoMisCuentas</MenuItem>
                    </Select>
                  ) : (
                    boletaDetalle.forma_de_pago
                  )}
              </TableCell>
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
              columns={[
                { field: 'cuil', headerName: 'CUIL', flex: 1 },
                { field: 'apellido', headerName: 'Apellido', flex: 1 },
                { field: 'nombre', headerName: 'Nombre', flex: 1 },
                { field: 'remunerativo', headerName: 'Remunerativo', flex: 1, valueFormatter: (params) => formatter.currency.format(params.value) },
                { field: 'capital', headerName: 'Capital', flex: 1, valueFormatter: (params) => formatter.currency.format(params.value) }
              ]}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              disableSelectionOnClick
            />
          </div>
        </Box>
        <div className='space-between'>

        <TableContainer className='w30'>
          <Table  sx={{ maxWidth: 200 }}>
            <TableBody>
              <TableRow>
                <TableCell>
                  Subtotal
                </TableCell>
                <TableCell>
                  {formatter.currency.format(existeDato(boletaDetalle.total_acumulado))}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  Interes
                </TableCell>
                <TableCell>
                  {boletaDetalle.interes? formatter.currency.format(boletaDetalle.interes) : formatter.currency.format(0) }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  Ajustes
                </TableCell>
                <TableCell>
                {formatter.currency.format( (boletaDetalle.ajustes) ?boletaDetalle.ajustes.reduce((acumulador, ajuste) => acumulador + ajuste.monto, 0):0)}
                  {//boletaDetalle.ajuste? formatter.currency.format(boletaDetalle.ajuste) : formatter.currency.format(0)
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  Total Final
                </TableCell>
                <TableCell>
                  {existeDato(formatter.currency.format(boletaDetalle.total_final))}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        {
        (ajustes && ajustes.length>0) && ajustes
                .map((ajuste, index) => (
                    <div key={index} className='w30'>
                    {index === 0 && <h3 style={{ color: '#1A76D2' }}>Ajustes aplicados</h3>}
                    <p>{ajuste.descripcion}</p>
                    <ul>
                        <li key={index}>{ajuste.descripcion}: {formatter.currency.format(ajuste.monto)}</li>
                    </ul>
                    </div>
            ))}
        </div>
      </div>
  );
};
