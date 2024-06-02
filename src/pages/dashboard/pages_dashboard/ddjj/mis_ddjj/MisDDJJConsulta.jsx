import { useEffect, useState } from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import dayjs from 'dayjs';
import './MisDDJJConsulta.css';
import {
  MisDDJJConsultaGrilla,
  castearMisDDJJ,
} from './grilla/MisDDJJConsultaGrilla';
import { axiosDDJJ } from './grilla/MisDDJJConsultaGrillaApi';
import { esES } from '@mui/x-date-pickers/locales';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { CSVLink, CSVDownload } from 'react-csv';
import localStorageService from '@/components/localStorage/localStorageService';
export const MisDDJJConsulta = ({
  setDDJJState,
  setPeriodo,
  rows_mis_ddjj,
  setRowsMisDdjj,
  setTabState,
  //setRowsAltaDDJJ,
  setPeticion,
  setTituloPrimerTab,
}) => {
  const ahora = dayjs().startOf('month');
  const ahoraMenosUnAnio = ahora.add(-11, 'month');
  const [desde, setDesde] = useState(ahoraMenosUnAnio);
  const [hasta, setHasta] = useState(ahora);

  const ID_EMPRESA = localStorageService.getEmpresaId();

  const buscarDDJJ = async () => {
    try {
      let desdeDayjs = null;
      if (desde !== null) {
        desdeDayjs = dayjs(desde.$d).format('YYYY-MM-DD');
      }
      let hastaDayjs = null;
      if (hasta !== null) {
        hastaDayjs = dayjs(hasta.$d).format('YYYY-MM-DD');
      }

      const ddjjResponse = await axiosDDJJ.consultar(
        ID_EMPRESA,
        desdeDayjs,
        hastaDayjs,
      );

      setRowsMisDdjj(ddjjResponse);
      //console.log('ddjjResponse', ddjjResponse);

      const ddjjCasteadas = castearMisDDJJ(ddjjResponse);
      //console.log('ddjjCasteadas', ddjjCasteadas);

      //setRowsMisDdjj(declaracionesFiltradas);
    } catch (error) {
      console.error('Error al buscar declaraciones juradas:', error);
    }
  };

  useEffect(() => {
    buscarDDJJ();
  }, []);

  return (
    <div>
      <div className="mis_declaraciones_juradas_container">
        <Stack
          spacing={4}
          direction="row"
          display="flex"
          justifyContent="initial"
          alignItems="center"
        >
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale={'es'}
            localeText={
              esES.components.MuiLocalizationProvider.defaultProps.localeText
            }
          >
            <DemoContainer components={['DatePicker']}>
              <DesktopDatePicker
                label={'Periodo desde'}
                views={['month', 'year']}
                closeOnSelect={true}
                onChange={(oValue) => setDesde(oValue)}
                value={desde}
              />
            </DemoContainer>
          </LocalizationProvider>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale={'es'}
            localeText={
              esES.components.MuiLocalizationProvider.defaultProps.localeText
            }
          >
            <DemoContainer components={['DatePicker']}>
              <DesktopDatePicker
                label={'Periodo hasta'}
                views={['month', 'year']}
                closeOnSelect={true}
                onChange={(oValue) => setHasta(oValue)}
                value={hasta}
              />
            </DemoContainer>
          </LocalizationProvider>
        </Stack>

        <Stack
          spacing={4}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Button
            onClick={buscarDDJJ}
            variant="contained"
            style={{ marginLeft: '2em' }}
          >
            Buscar
          </Button>
        </Stack>
      </div>
      <Stack direction="row" justifyContent="center" alignItems="center">
        <MisDDJJConsultaGrilla
          setDDJJState={setDDJJState}
          setPeriodo={setPeriodo}
          rows_mis_ddjj={rows_mis_ddjj}
          setRowsMisDdjj={setRowsMisDdjj}
          setTabState={setTabState}
          // setRowsAltaDDJJ={setRowsAltaDDJJ}
          setPeticion={setPeticion}
          setTituloPrimerTab={setTituloPrimerTab}
        />
      </Stack>
    </div>
  );
};
