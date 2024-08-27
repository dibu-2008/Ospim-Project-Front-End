import { useEffect, useState } from 'react';
import { axiosBoletas } from '../../BoletasApi';
import { axiosAportes } from '../../../../../../common/api/AportesApi';
import { axiosEntidades } from '../../../../../../common/api/EntidadesApi';
import { axiosFormasPago } from '../../../../../../common/api/FormaPagoApi';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Box } from '@mui/system';
import Grid from '@mui/material/Grid';

import TextField from '@mui/material/TextField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { BoletasEmpleadoGrilla } from './BoletasEmpleadoGrilla';

export const BoletaEmpleadoFiltro = () => {
  const ahora = dayjs().startOf('month');
  const ahoraMenosUnAnio = ahora.add(-11, 'month');
  const [filtro, setFiltro] = useState({
    periodoDesde: ahoraMenosUnAnio,
    periodoHasta: ahora,
    cuit: null,
    concepto: null,
    entidad: null,
    formaPago: null,
  });
  const [rows, setRows] = useState([]);
  const [aportes, setAportes] = useState([]);
  const [formasPago, setFormasPago] = useState([]);
  const [entidades, setEntidades] = useState([]);

  const handlerLimpiarFiltro = () => {
    setFiltro({
      periodoDesde: null,
      periodoHasta: null,
      cuit: null,
      concepto: null,
      entidad: null,
      formaPago: null,
    });
  };

  const handlerConsultar = async () => {
    try {
      const filtroBack = { ...filtro };

      if (filtro.periodoDesde !== null) {
        filtroBack.periodoDesde = filtro.periodoDesde
          .startOf('month')
          .format('YYYY-MM-DD');
      }

      if (filtro.periodoHasta !== null) {
        filtroBack.periodoHasta = filtro.periodoHasta
          .startOf('month')
          .format('YYYY-MM-DD');
      }

      const ddjjResponse = await axiosBoletas.getBoletasEmpleado(filtroBack);
      console.log('handlerConsultar - ddjjResponse: ', ddjjResponse);
      setRows(ddjjResponse.con_ddjj);
    } catch (error) {
      console.error('Error al buscar declaraciones juradas:', error);
    }
  };

  useEffect(() => {
    const consultarAportes = async () => {
      const response = await axiosAportes.consultarAportesDDJJ();
      response.unshift({ codigo: null, descripcion: '< todos >' });
      console.log('consultarAportes:', response);
      setAportes(response);
    };
    const consultarEntidades = async () => {
      const response = await axiosEntidades.consultar();
      response.unshift({ codigo: null, descripcion: '< todos >' });
      setEntidades(response);
    };
    const consultarFormasPago = async () => {
      const response = await axiosFormasPago.consultar();
      response.unshift({ codigo: null, descripcion: '< todos >' });
      setFormasPago(response);
    };

    consultarFormasPago();
    consultarEntidades();
    consultarAportes();
    handlerConsultar();
  }, []);

  return (
    <div className="declaraciones_juradas_container">
      <h1
        style={{
          marginBottom: '50px',
        }}
      >
        Consulta de Boletas de Pago
      </h1>
      <Box sx={{ flexGrow: 1 }} style={{ marginLeft: '5%' }}>
        <Stack direction="row" spacing={3}>
          <TextField
            id="outlined-basic"
            label={'Cuit'}
            variant="outlined"
            value={filtro.cuit || ''}
            onChange={(oValue) =>
              setFiltro({ ...filtro, cuit: oValue.target.value })
            }
          />
          <DemoContainer components={['DatePicker']}>
            <DesktopDatePicker
              label={'Periodo desde'}
              views={['month', 'year']}
              closeOnSelect={true}
              onChange={(oValue) =>
                setFiltro({ ...filtro, periodoDesde: oValue })
              }
              value={filtro.periodoDesde || ''}
            />
          </DemoContainer>

          <DemoContainer components={['DatePicker']}>
            <DesktopDatePicker
              label={'Periodo hasta'}
              views={['month', 'year']}
              closeOnSelect={true}
              onChange={(oValue) =>
                setFiltro({ ...filtro, periodoHasta: oValue })
              }
              value={filtro.periodoHasta || ''}
            />
          </DemoContainer>

          <FormControl style={{ minWidth: 120 }}>
            <InputLabel id="demo-simple-select-label">Entidad</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={filtro.entidad || ''}
              label={'Entidades'}
              onChange={(oValue) =>
                setFiltro({ ...filtro, entidad: oValue.target.value })
              }
            >
              {entidades.map((element) => (
                <MenuItem key={element.codigo} value={element.codigo}>
                  {element.codigo || '< todos >'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <Stack direction="row" spacing={3} sx={{ marginTop: '30px' }}>
          <FormControl style={{ minWidth: 150 }}>
            <InputLabel id="demo-simple-select-label">Concepto</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={filtro.concepto || ''}
              label={'Aportes'}
              onChange={(oValue) =>
                setFiltro({ ...filtro, concepto: oValue.target.value })
              }
            >
              {aportes.map((element) => (
                <MenuItem key={element.codigo} value={element.codigo}>
                  {element.descripcion}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl style={{ minWidth: 120 }}>
            <InputLabel id="demo-simple-select-label">Método</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={filtro.formaPago || ''}
              label={'Aportes'}
              onChange={(oValue) =>
                setFiltro({ ...filtro, formaPago: oValue.target.value })
              }
            >
              {formasPago.map((element) => (
                <MenuItem key={element.codigo} value={element.codigo}>
                  {element.descripcion}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <Button
              onClick={handlerLimpiarFiltro}
              variant="contained"
              style={{ marginLeft: '2em' }}
            >
              Limpiar Filtro
            </Button>
          </FormControl>
        </Stack>
      </Box>

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
          <BoletasEmpleadoGrilla rowsGrilla={rows} />
        </Box>
      </Stack>
    </div>
  );
};
