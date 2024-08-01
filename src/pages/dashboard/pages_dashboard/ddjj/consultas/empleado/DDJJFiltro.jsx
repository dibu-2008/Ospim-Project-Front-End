import { useEffect, useState } from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Box } from '@mui/system';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import './DDJJFiltro.css';
import { axiosDDJJEmpleado } from './DDJJConsultaEmpleadoApi';

import { DDJJGrilla } from './DDJJGrilla';
import { DesktopDatePicker } from '@mui/x-date-pickers';

export const DDJJFiltro = () => {
  const ahora = dayjs().startOf('month');
  const ahoraMenosUnAnio = ahora.add(-11, 'month');
  const [filtro, setFiltro] = useState({
    desde: ahoraMenosUnAnio,
    hasta: ahora,
    cuit: null,
  });
  const [rows, setRows] = useState([]);

  const handlerConsultar = async () => {
    try {
      let desde = null;
      if (filtro.desde !== null) {
        desde = filtro.desde.startOf('month').format('YYYY-MM-DD');
      }
      let hasta = null;
      if (filtro.hasta !== null) {
        hasta = filtro.hasta.startOf('month').format('YYYY-MM-DD');
      }
      let cuit = null;
      if (filtro.cuit !== null) {
        cuit = filtro.cuit;
      }
      //const ddjjResponse = await axiosDDJJ.consultar(ID_EMPRESA, desde, hasta);
      const ddjjResponse = await axiosDDJJEmpleado.consultarFiltrado(
        desde,
        hasta,
        cuit,
      );
      console.log('handlerConsultar - ddjjResponse: ', ddjjResponse);
      setRows(ddjjResponse);
    } catch (error) {
      console.error('Error al buscar declaraciones juradas:', error);
    }
  };

  useEffect(() => {
    handlerConsultar();
  }, []);

  return (
    <div className="declaraciones_juradas_container">
      <h1
        style={{
          marginBottom: '50px',
        }}
      >
        Consulta de Declaraciones Juradas
      </h1>
      <div
        className="mis_declaraciones_juradas_container"
        style={{
          marginBottom: '50px',
        }}
      >
        <Stack
          spacing={4}
          direction="row"
          display="flex"
          justifyContent="initial"
          alignItems="center"
        >
          <DemoContainer components={['DatePicker']}>
            <DesktopDatePicker
              label={'Periodo desde'}
              views={['month', 'year']}
              closeOnSelect={true}
              onChange={(oValue) => setFiltro({ ...filtro, desde: oValue })}
              value={filtro.desde || ''}
            />
          </DemoContainer>

          <DemoContainer components={['DatePicker']}>
            <DesktopDatePicker
              label={'Periodo hasta'}
              views={['month', 'year']}
              closeOnSelect={true}
              onChange={(oValue) => setFiltro({ ...filtro, hasta: oValue })}
              value={filtro.hasta || ''}
            />
          </DemoContainer>
          <div
            style={{
              height: '100px',
              width: '250px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '8px',
            }}
          >
            <TextField
              id="outlined-basic"
              label="Cuit"
              variant="outlined"
              value={filtro.cuit || ''}
              onChange={(oValue) =>
                setFiltro({ ...filtro, cuit: oValue.target.value })
              }
            />
          </div>
        </Stack>
        <Stack
          spacing={4}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Button
            onClick={handlerConsultar}
            variant="contained"
            style={{ marginLeft: '2em' }}
          >
            Buscar
          </Button>
        </Stack>
      </div>
      <Stack direction="row" justifyContent="center" alignItems="center">
        <Box
          sx={{
            margin: '0 auto',
            height: '600px',
            width: '100%',
            '& .actions': {
              color: 'text.secondary',
            },
            '& .textPrimary': {
              color: 'text.primary',
            },
          }}
        >
          <DDJJGrilla
            rows={rows}
            showCuit={filtro.cuit == null || filtro.cuit == ''}
          />
        </Box>
      </Stack>
    </div>
  );
};
